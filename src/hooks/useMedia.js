import { useEffect, useState } from 'react';

export function useMediaQuery(q) {
  const [m, setM] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(q).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(q);
    const fn = (e) => setM(e.matches);
    mq.addEventListener('change', fn);
    setM(mq.matches);
    return () => mq.removeEventListener('change', fn);
  }, [q]);
  return m;
}

export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)');
}

export function useMouse() {
  const [m, setM] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e) => setM({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -(e.clientY / window.innerHeight) * 2 + 1,
    });
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);
  return m;
}
