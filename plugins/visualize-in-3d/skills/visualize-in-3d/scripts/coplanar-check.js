// Finds flat surfaces that fight for the same depth (z-fighting): two thin meshes, flat along the same axis, whose
// faces overlap and lie within `tolerance` metres of each other. It checks all three axes, so it catches a sign on a
// windscreen or a poster on a wall as well as paint on a road. Run it in the page once the world is built:
//   import { findCoplanarPairs } from './coplanar-check.js';
//   console.table(findCoplanarPairs(scene));
// Fix every pair it reports: remove the hidden surface, or move the layers at least 3 cm apart.
import * as THREE from 'three';

const FLAT_RATIO = 0.05;
const AXES = ['x', 'y', 'z'];

/** The axes along which this box is thin, each with the two other axes that span its face. */
function flatAxes(box) {
  const size = { x: box.max.x - box.min.x, y: box.max.y - box.min.y, z: box.max.z - box.min.z };
  const result = [];
  for (const axis of AXES) {
    const others = AXES.filter((other) => other !== axis);
    const span = Math.max(size[others[0]], size[others[1]]);
    if (size[others[0]] <= 0 || size[others[1]] <= 0) continue;
    if (size[axis] <= FLAT_RATIO * span || size[axis] <= 0.3) result.push({ axis, others });
  }
  return result;
}

function overlapArea(first, second, others) {
  const [one, two] = others;
  const overlapOne = Math.min(first.max[one], second.max[one]) - Math.max(first.min[one], second.min[one]);
  const overlapTwo = Math.min(first.max[two], second.max[two]) - Math.max(first.min[two], second.min[two]);
  if (overlapOne <= 0 || overlapTwo <= 0) return 0;
  return overlapOne * overlapTwo;
}

/** The smallest distance between a face of one box and the same-facing face of the other, along the axis. */
function faceGap(first, second, axis) {
  const maxGap = Math.abs(first.max[axis] - second.max[axis]);
  const minGap = Math.abs(first.min[axis] - second.min[axis]);
  return Math.min(maxGap, minGap);
}

export function findCoplanarPairs(scene, { tolerance = 0.03, minimumArea = 0.05 } = {}) {
  scene.updateMatrixWorld(true);
  const flats = [];
  scene.traverse((object) => {
    if (!object.isMesh || !object.visible || object.isInstancedMesh) return;
    const material = Array.isArray(object.material) ? object.material[0] : object.material;
    if (material && material.transparent && material.opacity < 0.5) return;
    const box = new THREE.Box3().setFromObject(object);
    const axes = flatAxes(box);
    if (axes.length) flats.push({ name: object.name || object.parent?.name || '(unnamed)', box, axes });
  });
  const pairs = [];
  for (let first = 0; first < flats.length; first++) {
    for (let second = first + 1; second < flats.length; second++) {
      for (const { axis, others } of flats[first].axes) {
        if (!flats[second].axes.some((entry) => entry.axis === axis)) continue;
        const gap = faceGap(flats[first].box, flats[second].box, axis);
        if (gap >= tolerance) continue;
        const area = overlapArea(flats[first].box, flats[second].box, others);
        if (area < minimumArea) continue;
        pairs.push({ first: flats[first].name, second: flats[second].name, axis, gapCm: +(gap * 100).toFixed(1), overlapM2: +area.toFixed(2) });
        break;
      }
    }
  }
  return pairs.sort((left, right) => right.overlapM2 - left.overlapM2);
}
