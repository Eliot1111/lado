import * as THREE from 'three';

export const BOWL_FLOOR_Y = 0.02;
export const FILL_RATIO = 0.88;

export function outerGlassProfile() {
  return [
    new THREE.Vector2(0.0, -0.62),
    new THREE.Vector2(0.22, -0.62),
    new THREE.Vector2(0.048, -0.54),
    new THREE.Vector2(0.038, -0.1),
    new THREE.Vector2(0.055, -0.04),
    new THREE.Vector2(0.14, 0.02),
    new THREE.Vector2(0.28, 0.18),
    new THREE.Vector2(0.38, 0.38),
    new THREE.Vector2(0.405, 0.52),
    new THREE.Vector2(0.395, 0.565),
  ];
}

export function innerGlassProfile() {
  const t = 0.018;
  return [
    new THREE.Vector2(0.0, -0.58),
    new THREE.Vector2(0.2 - t, -0.58),
    new THREE.Vector2(0.048 - t * 0.5, -0.52),
    new THREE.Vector2(0.038 - t * 0.3, -0.1),
    new THREE.Vector2(0.055 - t * 0.3, -0.04),
    new THREE.Vector2(0.14 - t, 0.02),
    new THREE.Vector2(0.28 - t * 1.2, 0.18),
    new THREE.Vector2(0.38 - t * 1.4, 0.38),
    new THREE.Vector2(0.405 - t * 1.5, 0.52),
    new THREE.Vector2(0.395 - t * 1.5, 0.555),
  ];
}

export function bowlTopY() {
  return innerGlassProfile().at(-1).y;
}

export function getFillLocalY(ratio = FILL_RATIO) {
  const top = bowlTopY();
  return BOWL_FLOOR_Y + (top - BOWL_FLOOR_Y) * ratio;
}

/** Rim edge for garnish placement */
export const RIM_Y = 0.555;
export const RIM_RADIUS = 0.392;

/** Liquid volume profile — inset slightly from inner wall */
export function liquidFillProfile(fill = FILL_RATIO) {
  const inner = innerGlassProfile();
  const inset = 0.006;
  const fillY = getFillLocalY(fill);
  const pts = [new THREE.Vector2(0, BOWL_FLOOR_Y)];

  for (const p of inner) {
    if (p.y < BOWL_FLOOR_Y) continue;
    if (p.y >= fillY) {
      const prev = pts[pts.length - 1];
      const t = (fillY - prev.y) / (p.y - prev.y);
      pts.push(new THREE.Vector2(
        THREE.MathUtils.lerp(prev.x, p.x - inset, t),
        fillY
      ));
      break;
    }
    pts.push(new THREE.Vector2(Math.max(p.x - inset, 0.01), p.y));
  }

  return { profile: pts, fillY, topRadius: pts[pts.length - 1].x };
}

export function subdivideProfile(profile, steps = 4) {
  if (profile.length < 2) return profile;
  const out = [];
  for (let i = 0; i < profile.length - 1; i++) {
    out.push(profile[i].clone());
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      out.push(new THREE.Vector2(
        THREE.MathUtils.lerp(profile[i].x, profile[i + 1].x, t),
        THREE.MathUtils.lerp(profile[i].y, profile[i + 1].y, t)
      ));
    }
  }
  out.push(profile[profile.length - 1].clone());
  return out;
}

export function latheGeo(profile, segments) {
  const geo = new THREE.LatheGeometry(profile, segments);
  geo.computeVertexNormals();
  return geo;
}

