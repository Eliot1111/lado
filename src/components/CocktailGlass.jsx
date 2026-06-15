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
      renderOrder={10}
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
        <mesh renderOrder={11}>
          <sphereGeometry args={[0.052, seg, seg]} />
          <meshPhysicalMaterial color="#b81830" emissive="#5a0818" emissiveIntensity={0.18} roughness={0.2} clearcoat={1} />
        </mesh>
      </group>
    </group>
  );
}

export default function CocktailGlass({ scrollProgress, mouse, low }) {
  const glassRef = useRef();
  const liquidCoreRef = useRef();
  const liquidShellRef = useRef();
  const meniscusRef = useRef();
  const garnishRef = useRef();
  const lastFillRatio = useRef(-1);

  const pour = useWinePour(low);
  const liqSeg = low ? 96 : 192;
  const glassSeg = low ? 64 : 128;

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

    const scrollRot = scrollProgress * Math.PI * 3.5;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, scrollRot + mouse.x * 0.28, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, mouse.y * 0.12 + Math.sin(scrollProgress * Math.PI) * 0.08, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, Math.sin(t * 0.7 + scrollProgress * 2) * 0.04, 0.04);

    const ratio = pour.fill.current;
    const fy = pour.fillY.current;
    const tr = pour.topRadius.current;

    if (Math.abs(ratio - lastFillRatio.current) > 0.003) {
      const { profile } = liquidFillProfile(Math.max(0.008, ratio));
      const geo = latheGeo(subdivideProfile(profile, 5), liqSeg);
      [liquidCoreRef, liquidShellRef].forEach((ref) => {
        if (ref.current?.geometry) ref.current.geometry.dispose();
        if (ref.current) ref.current.geometry = geo;
      });
      lastFillRatio.current = ratio;
    }

    if (meniscusRef.current) {
      meniscusRef.current.visible = ratio > 0.04;
      meniscusRef.current.position.y = fy + 0.002;
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
      <WinePourEffect
        pourOrigin={pour.pourOrigin}
        fillY={pour.fillY}
        pouring={pour.pouring}
        drops={pour.drops}
        low={low}
      />

      {/* Wine fill — grows over time */}
      <mesh ref={liquidCoreRef} geometry={initialGeo} scale={0.985} renderOrder={1}>
        <meshPhysicalMaterial
          color="#5c0a18"
          emissive="#280208"
          emissiveIntensity={0.12}
          roughness={0.18}
          transparent
          opacity={0.92}
          clearcoat={0.5}
          side={THREE.DoubleSide}
          depthWrite
        />
      </mesh>

      <mesh ref={liquidShellRef} geometry={initialGeo} renderOrder={2}>
        <MeshTransmissionMaterial
          backside
          samples={low ? 8 : 12}
          resolution={low ? 512 : 1024}
          transmission={0.62}
          roughness={0.05}
          thickness={0.9}
          ior={1.34}
          color="#a82848"
          attenuationColor="#3a0614"
          attenuationDistance={0.18}
          clearcoat={0.65}
          clearcoatRoughness={0.12}
        />
      </mesh>

      <mesh ref={meniscusRef} visible={false} rotation={[-Math.PI / 2, 0, 0]} renderOrder={3}>
        <ringGeometry args={[0.28, 0.36, low ? 64 : 128]} />
        <meshStandardMaterial
          color="#c84058"
          emissive="#901830"
          emissiveIntensity={0.35}
          roughness={0.15}
          transparent
          opacity={0.88}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh geometry={outerGeo} castShadow receiveShadow renderOrder={5}>
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.25}
          samples={low ? 6 : 12}
          resolution={low ? 512 : 1024}
          transmission={1}
          roughness={0.012}
          thickness={0.45}
          ior={1.52}
          color="#ffffff"
          attenuationColor="#e8dcc8"
          attenuationDistance={3.5}
          clearcoat={1}
          clearcoatRoughness={0.04}
        />
      </mesh>

      <mesh geometry={innerGeo} renderOrder={4}>
        <MeshTransmissionMaterial
          backside
          samples={low ? 4 : 8}
          resolution={low ? 512 : 1024}
          transmission={0.96}
          roughness={0.02}
          thickness={0.08}
          ior={1.52}
          color="#faf8f4"
          side={THREE.BackSide}
        />
      </mesh>

      <mesh position={[0, 0.562, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={6}>
        <torusGeometry args={[0.39, 0.005, 16, glassSeg]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
      </mesh>

      <RimGarnish low={low} groupRef={garnishRef} />
    </group>
  );
}
