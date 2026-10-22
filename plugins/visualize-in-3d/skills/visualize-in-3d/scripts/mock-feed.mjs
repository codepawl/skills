#!/usr/bin/env node
// A mock live feed for testing an embedded view without the company's real system.
// It replays a JSONL file (one JSON record per line, each with a `t` field in seconds and an `id`) in real time:
//   GET /events          Server-Sent Events, one `data:` line per record, looping at the end of the file
//   GET /snapshot.json   the latest record of every id so far
// Usage: node mock-feed.mjs --file sample.jsonl [--port 8787] [--speed 1]
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

function readOption(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

const filePath = readOption('file', null);
const port = Number(readOption('port', 8787));
const speed = Number(readOption('speed', 1));
if (!filePath) {
  console.error('Usage: node mock-feed.mjs --file sample.jsonl [--port 8787] [--speed 1]');
  process.exit(1);
}

const records = readFileSync(filePath, 'utf8')
  .split(/\r?\n/)
  .filter(line => line.trim())
  .map(line => JSON.parse(line))
  .sort((first, second) => first.t - second.t);
if (records.length === 0) {
  console.error(`No records in ${filePath}`);
  process.exit(1);
}
const loopLength = records[records.length - 1].t + 1;

const latestById = new Map();
const listeners = new Set();
const startedAt = Date.now();
let nextIndex = 0;
let loopCount = 0;

function tick() {
  const elapsed = ((Date.now() - startedAt) / 1000) * speed;
  while (true) {
    const record = records[nextIndex];
    const recordTime = record.t + loopCount * loopLength;
    if (recordTime > elapsed) break;
    const sent = { ...record, t: Math.round(recordTime * 1000) / 1000 };
    latestById.set(String(record.id), sent);
    const line = `data: ${JSON.stringify(sent)}\n\n`;
    for (const response of listeners) response.write(line);
    nextIndex += 1;
    if (nextIndex === records.length) {
      nextIndex = 0;
      loopCount += 1;
    }
  }
}
setInterval(tick, 50);

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' };

createServer((request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  if (path === '/events') {
    response.writeHead(200, { ...corsHeaders, 'Content-Type': 'text/event-stream', Connection: 'keep-alive' });
    response.write(': connected\n\n');
    listeners.add(response);
    request.on('close', () => listeners.delete(response));
    return;
  }
  if (path === '/snapshot.json') {
    response.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ updatedAt: Date.now(), records: [...latestById.values()] }));
    return;
  }
  response.writeHead(404, corsHeaders);
  response.end('Not found. Use /events or /snapshot.json');
}).listen(port, () => {
  console.log(`Mock feed: ${records.length} records from ${filePath} at http://localhost:${port}/events and /snapshot.json`);
});
