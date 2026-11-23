import { PerformanceManager } from '../RzpGlass/PerformanceManager';
import type { GpuTier } from '../RzpGlass/PerformanceManager';

/**
 * Where a page starts (the PR review: a known weak GPU drew 3-6 s of janky full-quality frames before stepping down): from
 * PerformanceManager.detect's class, as today's RazorSense seeds its quality. A low GPU (old Intel HD, Mali-400 / G5x, Adreno 3xx /
 * 4xx...) two steps down, a mid one on a phone one step down, a high or unknown one, or a mid one on a laptop, at full. A software
 * renderer never gets here: it shows the still (FreshStage's WebGL2 check). Loaded with the engine, so the page's always-loaded code
 * doesn't carry it.
 */
const startLevelOf = (tier: GpuTier, isMobile: boolean): number => {
  if (tier === 'low') return 2;
  if (tier === 'mid' && isMobile) return 1;
  return 0;
};

const DEBUG_INFO = { UNMASKED_RENDERER_WEBGL: 0x9246, UNMASKED_VENDOR_WEBGL: 0x9245 };

/**
 * The page's starting step from the GPU names FreshStage's WebGL2 check read (null where the browser hides them: then the device's
 * memory, cores and mobile decide, as PerformanceManager does). Its context is gone by now, so detect() reads the names it had.
 */
const deviceStartLevel = (names: { renderer: string | null; vendor: string | null }): number => {
  const hasNames = Boolean(names.renderer ?? names.vendor);
  const named = {
    getExtension: (name: string) =>
      name === 'WEBGL_debug_renderer_info' && hasNames ? DEBUG_INFO : null,
    getParameter: (p: number) =>
      p === DEBUG_INFO.UNMASKED_RENDERER_WEBGL ? names.renderer : names.vendor,
  };
  // (no caveat: a page gets here only past FreshStage's WebGL2 check, made with failIfMajorPerformanceCaveat; detect() would otherwise
  // make a WebGL1 probe context of its own, on Direct3D right before the first engine)
  const { tier, isMobile } = PerformanceManager.detect(
    (named as unknown) as WebGLRenderingContext,
    {
      hasMajorPerformanceCaveat: false,
    },
  );
  return startLevelOf(tier, isMobile);
};

export { deviceStartLevel, startLevelOf };
