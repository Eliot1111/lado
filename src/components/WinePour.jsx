import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { updateDrops } from '../hooks/useWinePour';

const dropMat = new THREE.MeshPhysicalMaterial({
  color: '#7a1228',
  emissive: '#3a0610',
  emissiveIntensity: 0.2,
  roughness: 0.12,
  clearcoat: 0.7,
  transparent: false,
});

const streamMat = new THREE.MeshPhysicalMaterial({
  color: '#8b1a32',
  emissive: '#3d0612',
  emissiveIntensity: 0.15,
  roughness: 0.1,
  clearcoat: 0.6,
  transparent: false,
});

export default function WinePourEffect({ pourOrigin, fillY, pouring, drops, low }) {
  const streamRef = useRef();
  const instRef = useRef();
  const dummy = useRef(new THREE.Object3D()).current;
  const frame = useRef(0);
  const p0 = useRef(new THREE.Vector3());
  const p1 = useRef(new THREE.Vector3());
  const p2 = useRef(new THREE.Vector3());
  const p3 = useRef(new THREE.Vector3());
  const curve = useRef(new THREE.CubicBezierCurve3(p0.current, p1.current, p2.current, p3.current));

  const dropGeo = useRef(new THREE.SphereGeometry(1, low ? 8 : 12, low ? 8 : 12)).current;

  useFrame((_, delta) => {
    updateDrops(drops, pourOrigin, fillY.current, pouring.current, delta, low ? 0.025 : 0.04);

    const surfaceY = fillY.current + 0.02;
    const isPouring = pouring.current;

    if (streamRef.current) {
      streamRef.current.visible = isPouring && fillY.current > 0.01;

      if (isPouring) {
        frame.current += 1;
        if (frame.current % 2 === 0) {
          p0.current.copy(pourOrigin);
          p1.current.set(pourOrigin.x + 0.05, pourOrigin.y - 0.35, pourOrigin.z);
          p2.current.set(0.03, (pourOrigin.y + surfaceY) * 0.5, 0);
          p3.current.set(0, surfaceY, 0);

          const tubeGeo = new THREE.TubeGeometry(curve.current, low ? 20 : 24, 0.011, 6, false);
          if (streamRef.current.geometry) streamRef.current.geometry.dispose();
          streamRef.current.geometry = tubeGeo;
        }
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

      <mesh ref={streamRef} visible={false} material={streamMat}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
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
