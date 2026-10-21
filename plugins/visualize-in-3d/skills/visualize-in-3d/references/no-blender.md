# Without Blender

When Blender is not installed and the user chose to go on without it, build the models in three.js. Tell the user
in the report that model quality is lower: no proper bevels, baked ambient occlusion or sculpted detail. The
reference-sheet rule still applies (`real-objects.md`); only the modelling tool changes.

## Building models in code

- One module per asset family (`src/models/crane.js`) that returns a `THREE.Group` built at real size in metres from
  the reference sheet's dimension table.
- Shapes: `BoxGeometry`, `CylinderGeometry`, `CapsuleGeometry`, `LatheGeometry` for turned parts, `ExtrudeGeometry`
  with `bevelEnabled` for panels and plates (a 2-4 cm bevel stops the toy look), `TubeGeometry` for pipes and cables.
- Merge static parts that share a material with `BufferGeometryUtils.mergeGeometries` to keep draw calls low; keep
  moving parts (wheels, doors, booms, limbs) as separate named children with their pivot at the joint.
- Detail in the order the camera sees it: silhouette, large forms, then panel lines (thin dark boxes inset by a few
  millimetres), bolts, vents, windows, lights. Size small parts against a 1.8 m figure.
- Materials: `MeshStandardMaterial` with roughness and metalness from the reference photos; small canvas textures for
  signage and wear; emissive for lights. Add `SSAO` or `N8AO` in post so contact shadows read.
- Repeats: `InstancedMesh` for anything that appears more than about 20 times.

## Checks

- Render each asset alone from the side and three-quarter views next to its reference image (a small Playwright page
  that loads one model) and fix proportions, missing parts and part counts, as the Blender compare renders do.
- Export each finished model to GLB with `GLTFExporter` so pass 2 loads it the same way as a Blender asset.
