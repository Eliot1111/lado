import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import {
  outerGlassProfile,
  innerGlassProfile,
  liquidFillProfile,
  subdivideProfile,
  latheGeo,
  RIM_Y,
  RIM_RADIUS,
} from './glassUtils';
import { useWinePour } from '../hooks/useWinePour';
import WinePourEffect from './WinePour';
import { sceneInput } from '../store/sceneInput';

function RimGarnish({ low, groupRef }) {
  const seg = low ? 24 : 36;
  const rimAngle = 0.55;
  const rimX = Math.cos(rimAngle) * RIM_RADIUS;
  const rimZ = Math.sin(rimAngle) * RIM_RADIUS;

  return (
    <group
      ref={groupRef}
      visible={false}
      position={[rimX, RIM_Y + 0.008, rimZ]}
      rotation={[0.08, rimAngle + Math.PI / 2, 0.12]}
      renderOrder={12}
    >
      <group position={[0, 0.02, 0]} rotation={[0, 0, -0.35]}>
        <mesh position={[0.06, 0.012, 0]} rotation={[0, 0, -0.15]}>
          <cylinderGeometry args={[0.004, 0.003, 0.14, 6]} />
          <meshStandardMaterial color="#4a3520" roughness={0.85} />
        </mesh>
        <mesh position={[0.13, 0.022, 0.01]} rotation={[0, 0.2, -0.4]}>
          <cylinderGeometry args={[0.003, 0.002, 0.09, 6]} />
          <meshStandardMaterial color="#3d2a18" roughness={0.9} />
        </mesh>
        <mesh position={[0.04, 0.028, 0.012]} rotation={[0.5, 0.3, 0.8]} scale={[0.045, 0.018, 0.025]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#2d5a28" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0.1, 0.034, -0.008]} rotation={[0.4, -0.5, 0.6]} scale={[0.04, 0.015, 0.022]}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#3a6b32" roughness={0.7} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[-0.01, 0.035, 0]} rotation={[0.3, 0, 0.2]}>
        <cylinderGeometry args={[0.0035, 0.004, 0.05, 8]} />
        <meshStandardMaterial color="#3d5c28" roughness={0.65} />
      </mesh>
      <group position={[-0.015, -0.018, 0.02]}>
        <mesh renderOrder={13}>
          <sphereGeometry args={[0.052, seg, seg]} />
          <meshPhysicalMaterial color="#b81830" emissive="#5a0818" emissiveIntensity={0.18} roughness={0.2} clearcoat={1} />
        </mesh>
      </group>
    </group>
  );
}

export default function CocktailGlass({ quality, low }) {
  const glassRef = useRef();
  const liquidGroupRef = useRef();
  const liquidCoreRef = useRef();
  const liquidShellRef = useRef();
  const meniscusRef = useRef();
  const garnishRef = useRef();
  const lastFillRatio = useRef(-1);
  const sharedLiquidGeo = useRef(null);

  const pour = useWinePour(low);
  const { liqSeg, glassSeg, transmissionRes, transmissionSamples } = quality;

  const initialGeo = useMemo(() => {
    const { profile } = liquidFillProfile(0.008);
    return latheGeo(subdivideProfile(profile, 5), liqSeg);
  }, [liqSeg]);

  const { outerGeo, innerGeo } = useMemo(() => ({
    outerGeo: latheGeo(outerGlassProfile(), glassSeg),
    innerGeo: latheGeo(innerGlassProfile(), glassSeg),
  }), [glassSeg]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = glassRef.current;
    if (!g) return;

    const scroll = sceneInput.scroll;
    const scrollRot = scroll * Math.PI * 3.5;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, scrollRot + sceneInput.mouseX * 0.28, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, sceneInput.mouseY * 0.12 + Math.sin(scroll * Math.PI) * 0.08, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, Math.sin(t * 0.7 + scroll * 2) * 0.04, 0.04);

    const ratio = pour.fill.current;
    const fy = pour.fillY.current;
    const tr = pour.topRadius.current;
    const sx = pour.sloshX.current;
    const sz = pour.sloshZ.current;

    const lg = liquidGroupRef.current;
    if (lg) {
      lg.rotation.x = THREE.MathUtils.lerp(lg.rotation.x, sx, 0.22);
      lg.rotation.z = THREE.MathUtils.lerp(lg.rotation.z, sz, 0.22);
      lg.position.y = THREE.MathUtils.lerp(lg.position.y, pour.sloshY.current, 0.18);
      lg.position.x = THREE.MathUtils.lerp(lg.position.x, sx * 0.06, 0.15);
      lg.position.z = THREE.MathUtils.lerp(lg.position.z, sz * 0.06, 0.15);
    }

    if (Math.abs(ratio - lastFillRatio.current) > 0.004) {
      const { profile } = liquidFillProfile(Math.max(0.008, ratio));
      const geo = latheGeo(subdivideProfile(profile, 5), liqSeg);
      if (sharedLiquidGeo.current) sharedLiquidGeo.current.dispose();
      sharedLiquidGeo.current = geo;
      if (liquidCoreRef.current) liquidCoreRef.current.geometry = geo;
      if (liquidShellRef.current) liquidShellRef.current.geometry = geo;
      lastFillRatio.current = ratio;
    }

    if (meniscusRef.current) {
      meniscusRef.current.visible = ratio > 0.04;
      meniscusRef.current.position.set(sx * 0.05, fy + 0.002 + pour.sloshY.current * 0.5, sz * 0.05);
      meniscusRef.current.rotation.x = -Math.PI / 2 + sx * 0.75;
      meniscusRef.current.rotation.z = sz * 0.75;
      const s = tr / 0.36;
      meniscusRef.current.scale.set(s, s, 1);
    }

    if (garnishRef.current) {
      garnishRef.current.visible = pour.done.current;
      if (pour.done.current) {
        garnishRef.current.rotation.y = 0.55 + Math.PI / 2 + Math.sin(t * 0.5) * 0.03;
      }
    }
  });

  return (
    <group ref={glassRef}>
      {/* Liquid + pour — tilts independently for slosh */}
      <group ref={liquidGroupRef}>
        <WinePourEffect
          pourOrigin={pour.pourOrigin}
          fillY={pour.fillY}
          pouring={pour.pouring}
          drops={pour.drops}
          low={low}
        />

        <mesh ref={liquidCoreRef} geometry={initialGeo} scale={0.985} renderOrder={1}>
          <meshPhysicalMaterial
            color="#4a0818"
            emissive="#22040a"
            emissiveIntensity={0.2}
            roughness={0.22}
            metalness={0}
            clearcoat={0.4}
            side={THREE.DoubleSide}
            depthWrite
          />
        </mesh>

        <mesh ref={liquidShellRef} geometry={initialGeo} renderOrder={2}>
          <meshPhysicalMaterial
            color="#8b1a32"
            emissive="#3a0610"
            emissiveIntensity={0.14}
            roughness={0.1}
            metalness={0}
            transmission={0.12}
            thickness={0.35}
            ior={1.34}
            clearcoat={0.95}
            clearcoatRoughness={0.05}
            transparent
            opacity={0.94}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={meniscusRef} visible={false} renderOrder={3}>
          <ringGeometry args={[0.28, 0.36, low ? 64 : 128]} />
          <meshStandardMaterial
            color="#a82040"
            emissive="#601020"
            emissiveIntensity={0.45}
            roughness={0.1}
            transparent
            opacity={0.97}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Clear glass shell — renders on top, shows liquid inside */}
      <mesh geometry={innerGeo} renderOrder={8}>
        <MeshTransmissionMaterial
          backside
          samples={Math.max(4, transmissionSamples - 2)}
          resolution={transmissionRes}
          transmission={1}
          roughness={0.015}
          thickness={0.08}
          ior={1.52}
          color="#ffffff"
          chromaticAberration={0.03}
          anisotropy={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh geometry={outerGeo} castShadow receiveShadow renderOrder={9}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.2}
          samples={transmissionSamples}
          resolution={transmissionRes}
          transmission={1}
          roughness={0.008}
          thickness={0.42}
          ior={1.52}
          color="#ffffff"
          chromaticAberration={0.04}
          anisotropy={0.15}
          clearcoat={1}
          clearcoatRoughness={0.03}
          attenuationColor="#f0e8dc"
          attenuationDistance={4}
        />
      </mesh>

      <mesh position={[0, 0.562, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={10}>
        <torusGeometry args={[0.39, 0.005, 16, glassSeg]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
      </mesh>

      <RimGarnish low={low} groupRef={garnishRef} />
    </group>
  );
}
