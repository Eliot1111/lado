import { useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Reservation from './components/Reservation';
import Contacts from './components/Contacts';
import ThreeScene from './components/ThreeScene';
import Footer from './components/Footer';
import { useScrollProgress } from './hooks/useScroll';
import { useIsMobile, useMouse } from './hooks/useMedia';
import styles from './App.module.css';

export default function App() {
  const scrollProgress = useScrollProgress();
  const mouse = useMouse();
  const isMobile = useIsMobile();
  const mouse3d = useMemo(() => (isMobile ? { x: 0, y: 0 } : mouse), [isMobile, mouse]);

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <div className="progress-bar" aria-hidden="true">
        <div className="progress-bar__fill" style={{ transform: `scaleX(${scrollProgress})` }} />
      </div>

      <Navbar />

      <div className={styles.scene}>
        <ThreeScene scrollProgress={scrollProgress} mouse={mouse3d} lowQuality={isMobile} />
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
