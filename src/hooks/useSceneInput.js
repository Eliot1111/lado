import { useEffect } from 'react';
import { sceneInput } from '../store/sceneInput';

export function useSceneInput(progressFillRef) {
  useEffect(() => {
    let raf = 0;

    const updateScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      sceneInput.scroll = p;
      const el = progressFillRef.current;
      if (el) el.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateScroll);
    };

    const onMove = (e) => {
      sceneInput.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneInput.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [progressFillRef]);
}
