---
name: visualize-in-3d
description: Make things that are hard to picture visible as a 3D world people can watch or play with - an operation (airport, data center, port, factory, hospital), a system, an event spreading over real land (wildfire, flood), or a story in time (a historical event, a case). Builds a live three.js app with a dashboard and a 30 s film, or a shot-by-shot documentary film, with models made in Blender from real references (or in three.js when Blender is missing). Use for "visualize how X works", "show this event on a 3D map", "a live 3D dashboard of how X runs", "a documentary-style 3D explainer".
license: MIT
---

# Visualize in 3D

Some things are hard to understand from text, tables or a long video: how an airport turns a plane around in 45
minutes, what an ER does with ten arrivals at once, where a data center's power goes, how a warehouse ships an order,
how a case unfolded across a county, why a reactor exploded at 01:23. This skill turns them into a 3D world you can
watch or click through, so the parts, the order and the cause can be seen at a glance. Two modes share one toolkit (models from real references, a
deterministic virtual clock, contact-sheet checks):

- **Live app**: a system or an operation. A real dashboard around a 3D world, a seeded simulation moving units and
  numbers, and a 30 s film recorded by driving the app with real clicks. Steps below; briefs in `references/brief.md`.
- **Documentary film**: an event, a case or a piece of history told in order. A fact file, a map, block-built scenes
  with flat glowing figures, captions timed for reading, sound and a score by section. See
  `references/documentary.md`.

Pick the look in `references/looks.md` (toy isometric, point-cloud survey, photoreal terrain, dark documentary).
Paths use `{{WORK_DIR}}` for the folder where projects live (the current directory unless the user names one) and
`{{SKILL_DIR}}` for this skill's folder. Write paths with forward slashes on every platform.

## Before you start

1. **Blender:** run `blender --version` (or look for it in the usual install folder). If it is missing, tell the user
   it gives much better models and is a free download from blender.org, and ask whether to wait for the install or
   go on without it. Without Blender, build the models in three.js as `references/no-blender.md` describes and say
   in the report that model quality is lower.
2. **Node and a browser for recording:** Node 20+ and Playwright with Chromium. ffmpeg for encoding and checks.
3. **Subagents:** where the harness has them, hand each pass to a fresh subagent with its brief (each pass stays
   inside a sane budget). Where it does not, run the passes one after another in this session, finishing and
   checking one before starting the next, and re-read the topic file at the start of each.
4. **Downloads** (elevation, map data, reference images, recorded sounds): name the source, count and rough size and
   get the user's OK first.

## Live app steps

1. **Write the topic file** `{{WORK_DIR}}/TOPIC-<slug>.md` in the shape of the files in `examples/` (airport ramp,
   AI data center, agent office, wildfire valley): folder and port, sites, the world (real parts of the place and what
   moves), data (units, tasks, fields), four KPIs, what the bottom timeline follows, made-up names, and the look (toy isometric when the user names none).
   Research the real operation first and list the real object types the main assets stand for.
2. **Pass 1, assets** with the Pass 1 brief (`references/brief.md`), or `references/no-blender.md` without Blender.
3. **Pass 2, app and film** with the Pass 2 brief, once pass 1 is checked.
4. **Check before showing anyone:** contact sheets of the film (`scripts/contact-sheet.sh`, sheets newer than the
   video) and the screenshots, against the faults in `references/film.md` and the brief's checks.
5. **Final polish:** what you or the user find goes into one more pass with "everything else is approved, change
   nothing else", then re-record the film.

## Rules

- Original designs only: no real brands, logos, liveries or characters.
- Every main asset is modelled from a reference sheet of the real thing (`references/real-objects.md`); models from
  memory read as toys. This holds without Blender too.
- A live app's film is driven by real input on a virtual clock; a documentary film is scripted shot by shot. Both
  follow `references/film.md`.
- Real people and real harm: facts from sources, victims named with respect, no gore (`references/documentary.md`).
- Reference images and videos are for study only: never ship them in the app or the film.
