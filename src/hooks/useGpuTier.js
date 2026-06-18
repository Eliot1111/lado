import { useMemo } from 'react';
import { useIsMobile } from './useMedia';

/** high = full glass quality, medium = balanced, low = mobile / weak GPU */
export function useGpuTier() {
  const isMobile = useIsMobile();

  return useMemo(() => {
    if (isMobile) return 'low';
    if (typeof window === 'undefined') return 'high';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'medium';

    const mem = navigator.deviceMemory;
    if (mem && mem < 4) return 'medium';

    const cores = navigator.hardwareConcurrency;
    if (cores && cores < 6) return 'medium';

    return 'high';
  }, [isMobile]);
}

export const GLASS_QUALITY = {
  high: { transmissionRes: 1024, transmissionSamples: 10, glassSeg: 128, liqSeg: 192, bloom: true, dprMax: 1.75 },
  medium: { transmissionRes: 768, transmissionSamples: 8, glassSeg: 96, liqSeg: 144, bloom: true, dprMax: 1.5 },
  low: { transmissionRes: 512, transmissionSamples: 6, glassSeg: 64, liqSeg: 96, bloom: false, dprMax: 1 },
};
