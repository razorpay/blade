/**
 * PerformanceManager
 *
 * Detects GPU tier and device capability, then produces recommended
 * RzpGlass render settings. Uses a layered heuristic approach:
 *
 *   1. WEBGL_debug_renderer_info  – parse GPU renderer/vendor strings
 *   2. failIfMajorPerformanceCaveat  – fast browser-level GPU check
 *   3. Device signals  – deviceMemory, hardwareConcurrency, mobile UA
 *
 * Tier definitions:
 *   high   – discrete / flagship mobile GPU, ample memory
 *   mid    – integrated / mid-range mobile GPU
 *   low    – software renderer, very old GPU, or constrained device
 *   unknown – could not determine (treated as mid for safety)
 */

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type GpuTier = 'high' | 'mid' | 'low' | 'potato' | 'unknown';

export type RenderSettings = {
  /** Max rendered pixel count passed to RzpGlassMount */
  maxPixelCount: number;
  /** Minimum device pixel ratio passed to RzpGlassMount */
  minPixelRatio: number;
};

export type PerformanceProfile = {
  tier: GpuTier;
  /** Raw GL_RENDERER string (null if extension unavailable) */
  gpuRenderer: string | null;
  /** Raw GL_VENDOR string (null if extension unavailable) */
  gpuVendor: string | null;
  /** navigator.deviceMemory in GB (null if unavailable) */
  deviceMemory: number | null;
  /** navigator.hardwareConcurrency */
  hardwareConcurrency: number;
  isMobile: boolean;
  /** Whether the browser signalled a major performance caveat */
  hasMajorPerformanceCaveat: boolean;
  /** Render settings for the detected tier */
  renderSettings: RenderSettings;
};

// ---------------------------------------------------------------------------
// Known renderer pattern lists
// ---------------------------------------------------------------------------

/**
 * Patterns that indicate a software / CPU renderer (potato tier).
 * These devices cannot run WebGL at any usable framerate.
 */
const POTATO_TIER_PATTERNS: RegExp[] = [
  /swiftshader/,
  /llvmpipe/,
  /softpipe/,
  /microsoft basic render/,
  /virgl/,
];

/**
 * Patterns that strongly indicate a low-end GPU.
 * Tested against the lowercased GL_RENDERER string.
 */
const LOW_TIER_PATTERNS: RegExp[] = [
  // Old Intel integrated
  /intel.*hd\s*(graphics)?\s*(2000|3000|4000|400|500|510|520|530)/,
  /intel.*gma/,
  // Old AMD integrated
  /amd.*radeon.*r[2-5]\s/,
  /amd.*radeon.*hd\s*(6|7)\d{3}/,
  // Very old NVIDIA
  /nvidia.*geforce\s*(4|5|6|7|8|9)\d{2}[^0]/,
  // Old mobile GPUs
  /mali-(4|t[0-9]|g5[0-7])\d*/,
  /adreno\s*(3|4)\d{2}/,
  /powervr.*sgx/,
  /vivante/,
  /gc\d{3}[^0-9]/, // Vivante GC series
];

/**
 * Patterns that indicate a high-end GPU.
 */
const HIGH_TIER_PATTERNS: RegExp[] = [
  // NVIDIA discrete
  /nvidia.*rtx/,
  /nvidia.*gtx\s*1[0-9]{3}/,
  /nvidia.*gtx\s*[2-9]\d{3}/,
  /nvidia.*quadro/,
  /nvidia.*titan/,
  // AMD discrete
  /amd.*rx\s*(5|6|7)\d{3}/,
  /amd.*radeon\s*(pro|rx)\s*(vega|5|6|7)/,
  /radeon\s*r9/,
  // Apple Silicon
  /apple\s*(m[1-9]|a1[5-9]|a[2-9]\d)/,
  // Modern mobile flagship
  /adreno\s*(7[3-9]\d|8\d{2})/,
  /mali-g(7[1-9]|[89]\d|[1-9]\d{2})/,
  /gpu\s*family\s*(apple\s*[5-9]|apple\s*[1-9]\d)/,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isMobileDevice(): boolean {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

function getDeviceMemoryGB(): number | null {
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return mem != null ? mem : null;
}

function getCpuCores(): number {
  return navigator.hardwareConcurrency ?? 2;
}

/**
 * Probes the WEBGL_debug_renderer_info extension to get raw GPU strings.
 * Returns nulls if the extension is unavailable or blocked (privacy protection).
 */
function getGpuStrings(
  gl: WebGLRenderingContext,
): { renderer: string | null; vendor: string | null } {
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  if (!ext) return { renderer: null, vendor: null };

  const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string | null;
  const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string | null;
  return { renderer, vendor };
}

/**
 * Checks whether the browser signals a major performance caveat (software/swiftshader).
 */
function checkMajorPerformanceCaveat(): boolean {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
  return gl === null;
}

/**
 * Classify a GPU into a tier using the renderer / vendor strings.
 * Returns null if classification is inconclusive.
 */
function classifyByRendererString(renderer: string | null, vendor: string | null): GpuTier | null {
  if (!renderer && !vendor) return null;

  const combined = `${renderer ?? ''} ${vendor ?? ''}`.toLowerCase();

  for (const pattern of POTATO_TIER_PATTERNS) {
    if (pattern.test(combined)) return 'potato';
  }

  for (const pattern of LOW_TIER_PATTERNS) {
    if (pattern.test(combined)) return 'low';
  }

  for (const pattern of HIGH_TIER_PATTERNS) {
    if (pattern.test(combined)) return 'high';
  }

  return null; // inconclusive – fall through to device signals
}

/**
 * Derive a tier purely from device-level signals (no GPU string needed).
 */
function classifyByDeviceSignals(memoryGB: number | null, cores: number, mobile: boolean): GpuTier {
  // Very constrained device
  if (memoryGB !== null && memoryGB <= 2) return 'low';
  if (cores <= 2) return 'low';

  // Well-resourced device
  if (memoryGB !== null && memoryGB >= 8 && cores >= 8 && !mobile) return 'high';
  if (memoryGB !== null && memoryGB >= 6 && cores >= 6) return 'high';

  return 'mid';
}

// ---------------------------------------------------------------------------
// Per-tier render settings
// ---------------------------------------------------------------------------

const RENDER_SETTINGS: Record<GpuTier, RenderSettings> = {
  high: {
    // ~4K equivalent
    maxPixelCount: 1920 * 1080 * 4,
    minPixelRatio: 2,
  },
  mid: {
    // ~1080p equivalent
    maxPixelCount: 1920 * 1080 * 2,
    minPixelRatio: 1,
  },
  low: {
    // ~720p max
    maxPixelCount: 1280 * 720,
    minPixelRatio: 1,
  },
  potato: {
    // Software renderer – show static fallback immediately
    maxPixelCount: 0,
    minPixelRatio: 1,
  },
  unknown: {
    // Treat conservatively – same as mid
    maxPixelCount: 1920 * 1080 * 2,
    minPixelRatio: 1,
  },
};

/**
 * Maps PerformanceLevel → RenderSettings so callers can apply the right
 * pixel budget when the level changes. Reuses RENDER_SETTINGS values so the
 * two tables stay in sync.
 *
 *   3 (full)     → high  tier settings
 *   2 (stable)   → mid   tier settings
 *   1 (degraded) → low   tier settings
 *   0 (fallback) → low   tier settings (canvas will be hidden anyway)
 */
const LEVEL_RENDER_SETTINGS: Record<PerformanceLevel, RenderSettings> = {
  3: RENDER_SETTINGS.high,
  2: RENDER_SETTINGS.mid,
  1: RENDER_SETTINGS.low,
  0: RENDER_SETTINGS.low,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Builds a PerformanceProfile by inspecting the provided WebGL context and
 * available browser / navigator APIs. No async work is performed.
 *
 * @example
 * ```ts
 * const profile = PerformanceManager.detect(gl);
 * console.log(profile.tier);          // 'high' | 'mid' | 'low' | 'unknown'
 *
 * const mount = new RzpGlassMount(
 *   el,
 *   assets,
 *   {},
 *   0,
 *   profile.renderSettings.minPixelRatio,
 *   profile.renderSettings.maxPixelCount,
 * );
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class PerformanceManager {
  /**
   * Detect GPU tier and return a full PerformanceProfile.
   *
   * @param gl - An existing WebGLRenderingContext (e.g. from RzpGlassMount).
   *             If not provided, a temporary offscreen context is created.
   */
  static detect(gl?: WebGLRenderingContext): PerformanceProfile {
    let ownedCanvas = false;
    let ctx = gl ?? null;

    if (!ctx) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      ctx = canvas.getContext('webgl') ?? null;
      ownedCanvas = true;
    }

    const mobile = isMobileDevice();
    const memoryGB = getDeviceMemoryGB();
    const cores = getCpuCores();
    const hasMajorPerformanceCaveat = checkMajorPerformanceCaveat();

    let gpuRenderer: string | null = null;
    let gpuVendor: string | null = null;

    if (ctx) {
      const { renderer, vendor } = getGpuStrings(ctx);
      gpuRenderer = renderer;
      gpuVendor = vendor;
      if (ownedCanvas) {
        // Let the browser GC the temp context – no explicit destroy needed
        ctx = null;
      }
    }

    // Immediate potato-tier signal from caveat check (software renderer)
    let tier: GpuTier;
    if (hasMajorPerformanceCaveat) {
      tier = 'potato';
    } else {
      tier =
        classifyByRendererString(gpuRenderer, gpuVendor) ??
        classifyByDeviceSignals(memoryGB, cores, mobile);
    }

    // Downgrade high → mid on mobile (thermal / power constraints)
    if (tier === 'high' && mobile) {
      tier = 'mid';
    }

    return {
      tier,
      gpuRenderer,
      gpuVendor,
      deviceMemory: memoryGB,
      hardwareConcurrency: cores,
      isMobile: mobile,
      hasMajorPerformanceCaveat,
      renderSettings: RENDER_SETTINGS[tier],
    };
  }

  /**
   * Convenience: returns only the recommended RenderSettings without the
   * full diagnostic data.
   */
  static getRenderSettings(gl?: WebGLRenderingContext): RenderSettings {
    return PerformanceManager.detect(gl).renderSettings;
  }
}

// ---------------------------------------------------------------------------
// WebGLPerformanceController
// ---------------------------------------------------------------------------

/** Performance level: 3 = full quality, 0 = static fallback */
export type PerformanceLevel = 0 | 1 | 2 | 3;

export type WebGLPerformanceControllerOptions = {
  gl: WebGLRenderingContext;
  /** Called whenever the level changes (including forced fallback at level 0) */
  onLevelChange?: ((level: PerformanceLevel) => void) | null;
};

const TIER_INITIAL_STATE: Record<GpuTier, PerformanceLevel> = {
  high: 3,
  mid: 2,
  low: 1,
  potato: 0,
  unknown: 2,
};

/**
 * Monitors real-time FPS and fires onLevelChange when quality should be adjusted.
 * Initial level is seeded from the GPU tier detected by PerformanceManager.
 *
 * Level semantics:
 *   3 – full quality
 *   2 – stable
 *   1 – degraded
 *   0 – static fallback (onLevelChange(0) fired)
 *
 * @example
 * ```ts
 * const controller = new WebGLPerformanceController({
 *   canvas,
 *   gl,
 *   onLevelChange: (level) => {
 *     if (level === 0) showStaticFallback();
 *   },
 * });
 *
 * // When done:
 * controller.dispose();
 * ```
 */
class WebGLPerformanceController {
  private onLevelChange: ((level: PerformanceLevel) => void) | null;

  private level: PerformanceLevel;

  private readonly cooldown = 3000;
  private lastChange = 0;

  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;

  private rafId: number | null = null;
  private disposed = false;

  constructor({ gl, onLevelChange = null }: WebGLPerformanceControllerOptions) {
    this.onLevelChange = onLevelChange;

    const { tier } = PerformanceManager.detect(gl);
    this.level = TIER_INITIAL_STATE[tier];

    if (this.level === 0) {
      this.forceStaticFallback();
      return;
    }

    onLevelChange?.(this.level);
    this.startMonitoring();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleVisibilityChange = (): void => {
    if (document.hidden) {
      // Pause the monitoring loop — RAF is throttled while hidden and would
      // produce artificially low FPS readings that trigger false fallbacks.
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    } else {
      // Reset FPS state so the stale hidden-period sample is discarded,
      // then resume monitoring from a clean baseline.
      this.frameCount = 0;
      this.lastTime = performance.now();
      this.fps = 60;
      this.startMonitoring();
    }
  };

  private setLevel(level: PerformanceLevel): void {
    if (this.level === level) return;

    const now = performance.now();
    if (now - this.lastChange < this.cooldown) return;

    this.level = level;
    this.lastChange = now;

    if (level === 0) {
      this.forceStaticFallback();
      return;
    }

    this.onLevelChange?.(level);
  }

  forceStaticFallback(): void {
    this.level = 0;
    this.onLevelChange?.(0);
  }

  private evaluatePerformance(): void {
    if (this.fps < 20) {
      this.setLevel(0);
    } else if (this.fps < 40) {
      this.setLevel(1);
    } else if (this.fps < 55) {
      this.setLevel(2);
    } else {
      this.setLevel(3);
    }
  }

  private startMonitoring(): void {
    const loop = (): void => {
      if (this.disposed) return;

      const now = performance.now();
      this.frameCount++;

      if (now - this.lastTime >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastTime = now;
        this.evaluatePerformance();
      }

      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  isPotato(): boolean {
    return this.level === 0;
  }

  /** Current performance level (3 = full, 0 = fallback) */
  getLevel(): PerformanceLevel {
    return this.level;
  }

  /** Stop the monitoring loop and release resources */
  dispose(): void {
    this.disposed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

export { WebGLPerformanceController, RENDER_SETTINGS, LEVEL_RENDER_SETTINGS };
