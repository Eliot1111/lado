import { Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { lerp, sectionT } from '../data/constants';
import CocktailGlass from './CocktailGlass';
import styles from './ThreeScene.module.css';

function ScrollCam({ progress, mobile }) {
  const { camera } = useThree();
  useFrame(() => {
    const z = lerp(mobile ? 5.2 : 4.5, 3.0, sectionT(progress, 0.3, 0.9));
    const y = lerp(0.05, -0.08, sectionT(progress, 0, 0.6));
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.05);
    camera.lookAt(0, 0.05, 0);
  });
  return null;
}

function Scene({ progress, mouse, low, bloom }) {
  return (
    <>
      <color attach="background" args={['#060606']} />
      <fog attach="fog" args={['#060606', 8, 20]} />

      <ambientLight intensity={0.15} color="#fff8f0" />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.4}
        color="#fff5e8"
        castShadow={!low}
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} color="#c9a962" />
      <spotLight
        position={[2, 5, 3]}
        angle={0.28}
        penumbra={1}
        intensity={2.5}
        color="#ffe8c0"
        castShadow={false}
      />
      <pointLight position={[-2, 0.8, 2]} intensity={1.2} color="#ff9500" distance={6} decay={2} />
      <pointLight position={[0.5, 0.42, 1.2]} intensity={1.8} color="#ff3355" distance={3} decay={2} />
      <pointLight position={[-1, 0.25, -0.5]} intensity={0.6} color="#8b1030" distance={2.5} decay={2} />

      <Environment preset="studio" environmentIntensity={0.85} />
      <ContactShadows
        position={[0, -0.63, 0]}
        opacity={0.45}
        scale={2.2}
        blur={2.2}
        far={1.2}
        color="#000000"
      />

      <ScrollCam progress={progress} mobile={low} />
      <CocktailGlass scrollProgress={progress} mouse={mouse} low={low} />

      {bloom && (
        <EffectComposer multisampling={4}>
          <Bloom
            intensity={0.22}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.95}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function ThreeScene({ scrollProgress, mouse, lowQuality }) {
  const dpr = useMemo(
    () => (lowQuality ? 1 : Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)),
    [lowQuality]
  );

  return (
    <div className={styles.wrap} aria-hidden="true">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0.05, 4.5], fov: 38 }}
        shadows={!lowQuality}
        gl={{
          antialias: !lowQuality,
          alpha: true,
          powerPreference: lowQuality ? 'low-power' : 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          stencil: false,
        }}
      >
        <Suspense fallback={null}>
          <Scene
            progress={scrollProgress}
            mouse={mouse}
            low={lowQuality}
            bloom={!lowQuality}
          />
        </Suspense>
      </Canvas>
      <div className={styles.glow} />
    </div>
  );
}
