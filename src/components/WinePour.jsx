import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { updateDrops } from '../hooks/useWinePour';

const dropMat = new THREE.MeshPhysicalMaterial({
  color: '#9e1838',
  emissive: '#4a0818',
  emissiveIntensity: 0.15,
  roughness: 0.1,
  clearcoat: 0.8,
  transparent: true,
  opacity: 0.95,
});

export default function WinePourEffect({ pourOrigin, fillY, pouring, drops, low }) {
  const streamRef = useRef();
  const instRef = useRef();
  const dummy = useRef(new THREE.Object3D()).current;

  const dropGeo = useRef(new THREE.SphereGeometry(1, low ? 8 : 12, low ? 8 : 12)).current;

  useFrame((_, delta) => {
    updateDrops(drops, pourOrigin, fillY.current, pouring.current, delta, low ? 0.025 : 0.04);

    const surfaceY = fillY.current + 0.02;
    const isPouring = pouring.current;

    if (streamRef.current) {
      streamRef.current.visible = isPouring && fillY.current > 0.01;

      if (isPouring) {
        const end = new THREE.Vector3(0, surfaceY, 0);
        const curve = new THREE.CubicBezierCurve3(
          pourOrigin.clone(),
          new THREE.Vector3(pourOrigin.x + 0.05, pourOrigin.y - 0.35, pourOrigin.z),
          new THREE.Vector3(0.03, (pourOrigin.y + surfaceY) * 0.5, 0),
          end
        );
        const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.01 + Math.sin(Date.now() * 0.01) * 0.002, 8, false);
        streamRef.current.geometry.dispose();
        streamRef.current.geometry = tubeGeo;
      }
    }

    const inst = instRef.current;
    if (!inst) return;

    let i = 0;
    drops.current.forEach((d) => {
      if (!d.active) return;
      dummy.position.copy(d.pos);
      dummy.scale.setScalar(d.size);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      i += 1;
    });
    inst.count = i;
    inst.instanceMatrix.needsUpdate = true;
    inst.visible = i > 0;
  });

  return (
    <group renderOrder={8}>
      <group position={[pourOrigin.x - 0.02, pourOrigin.y + 0.08, pourOrigin.z]} rotation={[0, 0, 0.42]}>
        <mesh>
          <cylinderGeometry args={[0.028, 0.038, 0.14, 16]} />
          <meshPhysicalMaterial color="#1a0808" roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.032, 0.028, 0.05, 16]} />
          <meshPhysicalMaterial color="#2a1010" roughness={0.3} />
        </mesh>
      </group>

      <mesh ref={streamRef} visible={false}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
        <MeshTransmissionMaterial
          color="#a82040"
          attenuationColor="#3a0614"
          attenuationDistance={0.15}
          transmission={0.55}
          roughness={0.08}
          thickness={0.4}
          ior={1.34}
          samples={low ? 4 : 6}
          resolution={256}
        />
      </mesh>

      <instancedMesh
        ref={instRef}
        args={[dropGeo, dropMat, drops.current.length]}
        frustumCulled={false}
        renderOrder={9}
      />
    </group>
  );
}
