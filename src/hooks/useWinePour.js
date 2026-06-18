import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BOWL_FLOOR_Y, getFillLocalY, FILL_RATIO } from '../components/glassUtils';

const POUR_START = 0.6;
const POUR_RATE = 0.24;
const POUR_ORIGIN = new THREE.Vector3(0.1, 1.05, 0.02);
const MAX_DROPS = 48;
const SLOSH_OMEGA = 13;
const SLOSH_DAMP = 0.52;

export { POUR_ORIGIN };

export function useWinePour(low) {
  const fill = useRef(0);
  const pouring = useRef(false);
  const started = useRef(false);
  const time = useRef(0);
  const fillY = useRef(BOWL_FLOOR_Y);
  const topRadius = useRef(0.01);
  const done = useRef(false);
  const prevFill = useRef(0);

  const sloshX = useRef(0);
  const sloshZ = useRef(0);
  const sloshY = useRef(0);
  const sloshVelX = useRef(0);
  const sloshVelZ = useRef(0);

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
    const dt = Math.min(delta, 0.032);

    if (!started.current && time.current > POUR_START) {
      started.current = true;
      pouring.current = true;
    }

    if (pouring.current && fill.current < FILL_RATIO) {
      fill.current = Math.min(FILL_RATIO, fill.current + dt * POUR_RATE);
    } else if (fill.current >= FILL_RATIO - 0.01) {
      pouring.current = false;
      done.current = true;
    }

    const ratio = Math.max(0.001, fill.current);
    fillY.current = getFillLocalY(ratio);
    topRadius.current = THREE.MathUtils.lerp(0.04, 0.36, Math.pow(ratio / FILL_RATIO, 0.85));

    const fillDelta = fill.current - prevFill.current;
    prevFill.current = fill.current;

    if (fillDelta > 0.0001) {
      sloshVelX.current += (Math.random() - 0.5) * fillDelta * 14;
      sloshVelZ.current += (Math.random() - 0.5) * fillDelta * 14;
    }

    const active = pouring.current || fill.current < FILL_RATIO * 0.98;
    if (active) {
      sloshVelX.current += Math.sin(time.current * 8.5) * dt * 1.8;
      sloshVelZ.current += Math.cos(time.current * 6.8) * dt * 1.6;
      sloshY.current = Math.sin(time.current * 11) * 0.007 * Math.min(1, ratio * 3);
    } else {
      sloshY.current *= 0.92;
    }

    const spring = -SLOSH_OMEGA * SLOSH_OMEGA;
    const damp = -2 * SLOSH_DAMP * SLOSH_OMEGA;
    sloshVelX.current += (spring * sloshX.current + damp * sloshVelX.current) * dt;
    sloshVelZ.current += (spring * sloshZ.current + damp * sloshVelZ.current) * dt;
    sloshX.current += sloshVelX.current * dt;
    sloshZ.current += sloshVelZ.current * dt;

    const maxTilt = 0.11;
    sloshX.current = THREE.MathUtils.clamp(sloshX.current, -maxTilt, maxTilt);
    sloshZ.current = THREE.MathUtils.clamp(sloshZ.current, -maxTilt, maxTilt);
  });

  return {
    fill,
    fillY,
    topRadius,
    pouring,
    done,
    drops,
    pourOrigin: POUR_ORIGIN,
    sloshX,
    sloshZ,
    sloshY,
  };
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
