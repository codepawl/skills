// Finds flat surfaces that fight for the same depth (z-fighting): two meshes whose footprints overlap
// and whose top faces lie within `tolerance` metres of each other. Run it in the page once the world is built:
//   import { findCoplanarPairs } from './coplanar-check.js';
//   console.table(findCoplanarPairs(scene));
// Fix every pair it reports: remove the hidden surface, or move the layers at least 3 cm apart.
import * as THREE from 'three';

const FLAT_RATIO = 0.05;

function flatFootprint(mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  const height = box.max.y - box.min.y;
  const width = box.max.x - box.min.x;
  const depth = box.max.z - box.min.z;
  if (width <= 0 || depth <= 0) return null;
  if (height > FLAT_RATIO * Math.max(width, depth) && height > 0.3) return null;
  return { box, top: box.max.y };
}

function overlapArea(first, second) {
  const overlapX = Math.min(first.max.x, second.max.x) - Math.max(first.min.x, second.min.x);
  const overlapZ = Math.min(first.max.z, second.max.z) - Math.max(first.min.z, second.min.z);
  if (overlapX <= 0 || overlapZ <= 0) return 0;
  return overlapX * overlapZ;
}

export function findCoplanarPairs(scene, { tolerance = 0.03, minimumArea = 0.25 } = {}) {
  scene.updateMatrixWorld(true);
  const flats = [];
  scene.traverse((object) => {
    if (!object.isMesh || !object.visible || object.isInstancedMesh) return;
    const material = Array.isArray(object.material) ? object.material[0] : object.material;
    if (material && material.transparent && material.opacity < 0.5) return;
    const footprint = flatFootprint(object);
    if (footprint) flats.push({ name: object.name || object.parent?.name || '(unnamed)', ...footprint });
  });
  const pairs = [];
  for (let first = 0; first < flats.length; first++) {
    for (let second = first + 1; second < flats.length; second++) {
      const gap = Math.abs(flats[first].top - flats[second].top);
      if (gap >= tolerance) continue;
      const area = overlapArea(flats[first].box, flats[second].box);
      if (area < minimumArea) continue;
      pairs.push({ first: flats[first].name, second: flats[second].name, gapCm: +(gap * 100).toFixed(1), overlapM2: +area.toFixed(1) });
    }
  }
  return pairs.sort((left, right) => right.overlapM2 - left.overlapM2);
}
