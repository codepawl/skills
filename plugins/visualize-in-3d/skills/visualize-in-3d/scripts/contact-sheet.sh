#!/usr/bin/env bash
# Contact sheets of a film for checking: one frame per second, 5 x 4 frames per sheet, with timestamps.
# Usage: scripts/contact-sheet.sh <video> <output folder> [frames per second]
# Needs ffmpeg and ffprobe on PATH. Writes <output folder>/sheet_01.jpg, sheet_02.jpg, ...
set -euo pipefail

video="$1"
output_folder="$2"
frames_per_second="${3:-1}"

if [ ! -f "$video" ]; then
  echo "No such video: $video" >&2
  exit 1
fi
mkdir -p "$output_folder"
rm -f "$output_folder"/sheet_*.jpg

width=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$video" | head -n 1 | tr -cd "0-9")
height=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$video" | head -n 1 | tr -cd "0-9")
# Each tile is 400 px on its longer side, so a sheet stays readable and small.
if [ "$width" -ge "$height" ]; then
  scale="400:-2"
else
  scale="-2:400"
fi

ffmpeg -v error -i "$video" \
  -vf "fps=${frames_per_second},scale=${scale},drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6,tile=5x4:padding=4:color=black" \
  -q:v 3 "$output_folder/sheet_%02d.jpg"

echo "Sheets in $output_folder"
ls -l "$output_folder"/sheet_*.jpg
