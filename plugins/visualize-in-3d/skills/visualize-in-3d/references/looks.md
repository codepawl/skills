# Looks

Each topic file names one look. The look sets the world's rendering, the UI skin and what the film shows; the data
model, the dashboard parts and the film's click-driven shape stay the same. Reading map: Toy isometric (default),
Point-cloud survey, Photoreal terrain analysis, Dark documentary, Choosing.

Reference stills or clips for a look are optional. If you have some, save them under `{{WORK_DIR}}/references/<slug>/`
and point the briefs at them; they are for study only and never ship in the app or the film. Without them, the
description of each look below is enough.

## Toy isometric (default)

Built for an AI data center, an agents office, an airport ramp, a chip fab, air traffic control, a metro and a toll
plaza. Think of a clean isometric diorama inside a light operations dashboard.

- World: a diorama on a ground slab with soft edges, seen from about 35 to 45 degrees above with a long lens (field
  of view 25 to 35). Light cool palette, one strong brand colour for the main units, a second colour for alerts.
- Scale: real dimensions, but vehicles and people slightly chunky (about 1.1x thickness) so they read when small.
- Light: one soft sun with long, soft shadows, a sky fill, ambient occlusion, gentle bloom only on lamps and screens.
- Materials: matte paint, rubber and concrete with low roughness variation; glass slightly tinted; no busy textures.
- Assets: Blender models with bevels and panel detail (Pass 1 as written).
- UI: light dashboard, white rounded cards with soft shadows, one font family, coloured status icons, numbers in
  tabular figures.

## Point-cloud survey

Reference: a strait-monitoring app drawn as white dots over terrain. Fits places defined by their land and water: straits, ports, borders, mountains, coasts, a city seen from above.

- World: terrain as a dense grid of small white spheres raised by a real heightmap, so slopes shade and valleys sit
  in shadow. Water is a flat, matte, light-grey plane. Vehicles and buildings are matte white clay models (no
  textures, no colour) with real detail; wakes, trails and exhaust are particles of the same dots.
- Rendering: under about 150k dots, `InstancedMesh` of low-poly spheres (8x6 segments). Above that, `THREE.Points`
  with a sphere-impostor shader (round point sprite, normal from the sprite UV for lambert shading, depth written so
  dots occlude). Jitter each dot slightly so the grid does not moire. SSAO is what makes it read as 3D; add a light
  bokeh depth of field (tilt-shift) and a soft overcast key light with long, faint shadows. No bloom.
- Heights: a real DEM of the place (see `real-objects.md`, Terrain), resampled to the dot grid; exaggerate height
  1.5-3x when the land is low.
- UI: almost monochrome (white, greys, near-black text), one alarm colour (orange about #FF5A1F) used only for
  alerts, the selected unit and a crossed threshold. Monospace type, bracketed section titles (`[STRAIT]`), thin
  HUD furniture over the scene (heading tape, pitch ladder, range rings), mac-style window chrome, small line
  charts with dashed baselines, a hatched band between panel groups. House UI rules still apply (no divider lines
  between rows, icon-led statuses, no eyebrows).
- Film: slow low-angle drift along the terrain with the depth of field, the selected unit in sharp focus.
- Traps: dots too big (reads as Lego) or too sparse (reads as noise); aim for 2-4 px per dot at 1080p in the
  wide shot. Without AO it looks like a flat stipple texture.

## Photoreal terrain analysis

Reference: wildfire analysis tools that scrub a fire's spread across real terrain. Fits events that happen across
real land over time: wildfire, flood, an expedition, a manhunt, a battle, a historical route.

- World: real DEM terrain with a satellite-style or procedurally painted ground texture (dry grass, rock, scattered
  instanced trees), long mountain shadows, atmospheric haze toward the horizon. Overlays drape on the terrain:
  burned or affected area as a translucent red/orange fill, the event's front as a glowing line, dated waypoints
  ("Aug 14, 14:26") as pins with leader lines, arrows for the direction of spread.
- Time is the main control: a timeline slider scrubs the event from start to end, and every overlay, chart and the
  key-events list follow it. A 2D map toggle shows the same overlays on a flat topographic map.
- Units: drones or aircraft fly real paths; clicking one opens its camera feed in a floating window (a thermal
  palette, purple to yellow, with a crosshair and HUD numbers).
- UI: warm off-white panels (paper, beige), dark text, red/orange for the event; layers panel with opacity sliders,
  an incident overview card, weather and behaviour cards, small area and rate-of-spread charts along the bottom.
- Film: open on the wide 3D view, scrub time so the overlay grows, switch to the 2D map, open a unit's feed, fly the
  camera low along the front.

## Dark documentary

Reference: the dark map-and-silhouette style of documentary YouTube channels such as LEMMiNO (study only; copy no
frames, music or text). Fits a case file or a piece of history: a crime, a disappearance, an investigation.

- Palette: near-black (#0b0b0c to #1a1a1c), greys, white text, one red (about #e0262b) for the crime, the clue and
  the key word; a muted blue only for police or investigators. No other colour.
- Map: a dark historical street map, thin light-grey lines on black, street names in letter-spaced caps, slight
  grain and vignette; crime sites are glowing red X marks or dots; the camera pushes in slowly from the district to
  the street. A public domain period map (USGS historical topo, an old city plan) traced or shaded dark works.
- 3D reconstructions: dark low-poly rooms and buildings lit by a few warm windows and one red light pool where the
  crime happened (the red light stands in for violence: never blood, bodies or wounds). People are flat solid
  silhouettes: white for the victim or witness in focus, blue for police, translucent grey for others.
- Labels: small boxed captions in spaced caps with thin leader lines (`PC THOMAS BARRETT`, `SUSPECT`), red dots at
  the anchor; a thin red timeline across the top with times and events (`04:45 BODY IS FOUND`), a note that times
  are approximate.
- Documents: quotes as small centred grey text with the key phrase in red and an italic source line with the date;
  footnote brackets `[6:207]` in a corner; fact cards (name in spaced caps, age, address, dates) beside a framed
  portrait. Portraits are engraved-style sketches with a label tab; a victim's frame is red. Draw no likeness of a
  real person from imagination; use a public domain image or leave the frame as a name card.
- Opening: a black card saying the events may disturb and no graphic imagery is shown; an engraved-style panorama
  of the place under a starry sky with the place and year in spaced caps (year in red); the title in spaced caps
  with the name in a glowing red script. A building of interest is its footprint extruded dark on the map with a
  red glowing outline and a boxed label.
- Motion and sound: slow pushes and dissolves, nothing snappy; a low ambient drone with soft hits on reveals.
- Respect: victims are named with dates and treated as people; the film follows the investigation, not the gore.

## Choosing

Toy isometric is the default for every topic. The point-cloud look can read as dull on a busy site, so use it when
it is asked for. Otherwise pick the look the place itself suggests: built places full of moving vehicles go toy
isometric; land and water seen from above go point-cloud; an event spreading across real land over time goes
photoreal terrain; a case or a piece of history told in order goes dark documentary. Write the look's name in the
topic file. Add a new look only after saving its reference and writing a section here.
