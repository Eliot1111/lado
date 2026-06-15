import { useEffect, useState } from 'react';

const cache = new Map();

/**
 * Loads HEIC with heic2any; falls back to JPG/WEBP if conversion fails.
 * To use a static image instead, replace MENU_HEIC with '/photos/IMG_7290.webp'
 */
export function useHeicImage(heicPath, fallbackPath) {
  const [src, setSrc] = useState(fallbackPath);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cache.has(heicPath)) {
        setSrc(cache.get(heicPath));
        setReady(true);
        return;
      }

      try {
        const heic2any = (await import('heic2any')).default;
        const res = await fetch(heicPath);
        if (!res.ok) throw new Error('fetch failed');
        const blob = await res.blob();
        const converted = await heic2any({ blob, toType: 'image/jpeg', quality: 0.9 });
        const out = Array.isArray(converted) ? converted[0] : converted;
        const url = URL.createObjectURL(out);
        cache.set(heicPath, url);
        if (!cancelled) setSrc(url);
      } catch {
        // Fallback: use pre-converted JPG or swap path to .webp in constants.js
        if (!cancelled) setSrc(fallbackPath);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [heicPath, fallbackPath]);

  return { src, ready };
}
