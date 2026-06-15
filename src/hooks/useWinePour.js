import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BOWL_FLOOR_Y, getFillLocalY, FILL_RATIO } from '../components/glassUtils';

const POUR_START = 0.6;
const POUR_RATE = 0.24;
const POUR_ORIGIN = new THREE.Vector3(0.1, 1.05, 0.02);
const MAX_DROPS = 48;

export { POUR_ORIGIN };

export function useWinePour(low) {
  const fill = useRef(0);
  const pouring = useRef(false);
  const started = useRef(false);
  const time = useRef(0);
  const fillY = useRef(BOWL_FLOOR_Y);
  const topRadius = useRef(0.01);
  const done = useRef(false);

  const drops = useRef(
    Array.from({ length: low ? 24 : MAX_DROPS }, () => ({
      active: false,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      size: 0.012,
    }))
  );

  useFrame((_, delta) => {
    time.current += delta;

    if (!started.current && time.current > POUR_START) {
      started.current = true;
      pouring.current = true;
    }

    if (pouring.current && fill.current < FILL_RATIO) {
      fill.current = Math.min(FILL_RATIO, fill.current + delta * POUR_RATE);
    } else if (fill.current >= FILL_RATIO - 0.01) {
      pouring.current = false;
      done.current = true;
    }

    const ratio = Math.max(0.001, fill.current);
    fillY.current = getFillLocalY(ratio);
    topRadius.current = THREE.MathUtils.lerp(0.04, 0.36, Math.pow(ratio / FILL_RATIO, 0.85));
  });

  return { fill, fillY, topRadius, pouring, done, drops, pourOrigin: POUR_ORIGIN };
}

export function updateDrops(drops, pourOrigin, fillYVal, pouring, delta, spawnRate = 0.035) {
  if (pouring && Math.random() < spawnRate) {
    const slot = drops.current.find((d) => !d.active);
    if (slot) {
      slot.active = true;
      slot.pos.copy(pourOrigin);
      slot.pos.x += (Math.random() - 0.5) * 0.025;
      slot.pos.z += (Math.random() - 0.5) * 0.025;
      slot.vel.set(
        (Math.random() - 0.5) * 0.06,
        -0.05 - Math.random() * 0.08,
        (Math.random() - 0.5) * 0.06
      );
      slot.size = 0.008 + Math.random() * 0.012;
    }
  }

  drops.current.forEach((d) => {
    if (!d.active) return;
    d.vel.y -= 2.8 * delta;
    d.pos.addScaledVector(d.vel, delta);
    if (d.pos.y <= fillYVal + 0.02) d.active = false;
    if (d.pos.y < BOWL_FLOOR_Y - 0.1) d.active = false;
  });
}
