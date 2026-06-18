import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { lerp, sectionT } from '../data/constants';
import { GLASS_QUALITY } from '../hooks/useGpuTier';
import { sceneInput } from '../store/sceneInput';
import CocktailGlass from './CocktailGlass';
import styles from './ThreeScene.module.css';

function ScrollCam({ mobile }) {
  const { camera } = useThree();
  useFrame(() => {
    const progress = sceneInput.scroll;
    const z = lerp(mobile ? 5.2 : 4.5, 3.0, sectionT(progress, 0.3, 0.9));
    const y = lerp(0.05, -0.08, sectionT(progress, 0, 0.6));
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.05);
    camera.lookAt(0, 0.05, 0);
  });
  return null;
}

function AdaptiveDpr({ max }) {
  const setDpr = useThree((s) => s.setDpr);
  const level = useRef(max);

  return (
    <PerformanceMonitor
      flipflops={4}
      onDecline={() => {
        level.current = Math.max(1, +(level.current - 0.25).toFixed(2));
        setDpr(level.current);
      }}
      onIncline={() => {
        level.current = Math.min(max, +(level.current + 0.25).toFixed(2));
        setDpr(level.current);
      }}
    />
  );
}

function Scene({ tier, quality }) {
  const low = tier === 'low';

  return (
    <>
      <color attach="background" args={['#faf8f4']} />
      <fog attach="fog" args={['#faf8f4', 10, 24]} />

      <ambientLight intensity={0.55} color="#fffef8" />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.2}
        color="#fff8e8"
        castShadow={!low}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 3, -3]} intensity={0.45} color="#9ed4f0" />
      <spotLight
        position={[2, 5, 3]}
        angle={0.28}
        penumbra={1}
        intensity={1.8}
        color="#fff5d6"
        castShadow={false}
      />
      <pointLight position={[-2, 0.8, 2]} intensity={0.8} color="#f0c75e" distance={6} decay={2} />
      <pointLight position={[0.5, 0.42, 1.2]} intensity={1.2} color="#ff5577" distance={3} decay={2} />
      <pointLight position={[-1, 0.25, -0.5]} intensity={0.4} color="#c94060" distance={2.5} decay={2} />

      <Environment preset="apartment" environmentIntensity={0.65} />
      <ContactShadows
        position={[0, -0.63, 0]}
        opacity={0.22}
        scale={2.2}
        blur={low ? 1.8 : 2.5}
        far={1.2}
        color="#8a9aab"
      />

      <AdaptiveDpr max={quality.dprMax} />
      <ScrollCam mobile={low} />
      <CocktailGlass quality={quality} low={low} />

      {quality.bloom && (
        <EffectComposer multisampling={tier === 'high' ? 2 : 0}>
          <Bloom
            intensity={0.12}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.95}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function ThreeScene({ gpuTier }) {
  const quality = GLASS_QUALITY[gpuTier] ?? GLASS_QUALITY.high;
  const dpr = useMemo(
    () => Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, quality.dprMax),
    [quality.dprMax]
  );

  return (
    <div className={styles.wrap} aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0.05, 4.5], fov: 38 }}
        shadows={gpuTier !== 'low'}
        gl={{
          antialias: gpuTier !== 'low',
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          stencil: false,
        }}
      >
        <Suspense fallback={null}>
          <Scene tier={gpuTier} quality={quality} />
        </Suspense>
      </Canvas>
      <div className={styles.glow} />
    </div>
  );
}
