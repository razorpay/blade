/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable consistent-return */
import { useEffect, useRef } from 'react';
import { FluidGradientMount } from './FluidGradientMount';

interface UseFluidGradientOptions {
  size: number;
  /** Gradient origin in UV space. [0.5, 0.5] = center (default). */
  origin?: [number, number];
}

export function useFluidGradient({ size, origin = [0.5, 0.5] }: UseFluidGradientOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<FluidGradientMount | null>(null);

  // Reactively update origin without re-initialising WebGL
  useEffect(() => {
    mountRef.current?.setOrigin(origin);
  }, [origin[0], origin[1]]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mount = new FluidGradientMount(container, size, origin);
    mountRef.current = mount;

    return () => {
      mount.dispose();
      mountRef.current = null;
    };
  }, [size]); // eslint-disable-line react-hooks/exhaustive-deps

  return containerRef;
}
