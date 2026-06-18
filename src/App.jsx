import { useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Reservation from './components/Reservation';
import Contacts from './components/Contacts';
import ThreeScene from './components/ThreeScene';
import Footer from './components/Footer';
import { useSceneInput } from './hooks/useSceneInput';
import { useGpuTier } from './hooks/useGpuTier';
import styles from './App.module.css';

export default function App() {
  const progressFillRef = useRef(null);
  useSceneInput(progressFillRef);
  const gpuTier = useGpuTier();

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <div className="progress-bar" aria-hidden="true">
        <div ref={progressFillRef} className="progress-bar__fill" style={{ transform: 'scaleX(0)' }} />
      </div>

      <Navbar />

      <div className={styles.scene}>
        <ThreeScene gpuTier={gpuTier} />
      </div>

      <main>
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <Reservation />
        <Contacts />
      </main>

      <Footer />
    </>
  );
}
