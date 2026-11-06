import type { FreshEngine, FreshEngineHost, FreshExport, FreshSwitches } from './types';
import { POTATO_TIER_PATTERNS } from '../RzpGlass/PerformanceManager';

type CreateFreshEngine = (
  host: FreshEngineHost,
  exp: FreshExport,
  switches: FreshSwitches,
) => FreshEngine;

/** Called every frame while the stage runs: the component moves its clock and seeks the engine here. */
type FreshDriver = (engine: FreshEngine, dtSeconds: number) => void;

/** Every GPU speed-up on (see ray/ds/gpu_raster.js); each is checked against the studio's own picture. */
const ALL_ON: FreshSwitches = {
  gpuRaster: true,
  accTrim: true,
  scissor: true,
  stableSizes: true,
  box: true,
  spec: true,
};

/** The longest step a frame may take on the component's clock: a stall or a hidden tab doesn't jump the animation. */
const MAX_STEP = 0.1;

/**
 * Too slow to animate: under this many frames a second for this many seconds running (as RazorSense drops to its static
 * fallback under 20 fps). The component shows its still instead, and so does every one after it on this page.
 */
const SLOW_FPS = 20;
const SLOW_SECONDS = 3;
/** a stage's first frames don't count (its first draws, and a page still booting, stall) (ms) */
const SLOW_WARMUP = 2000;
let wasSlow = false;

/** why a stage can't animate: no usable WebGL2, frames too slow, or a GPU context the browser took back and didn't return */
type FreshFailure = 'webgl2' | 'slow' | 'lost';

/** each failure in words, for a component's onError */
const freshFailures: Record<FreshFailure, string> = {
  webgl2: 'WebGL2 is unavailable, or the GPU draws only on the CPU',
  slow: 'its frames are too slow on this device',
  lost: 'the browser took its GPU context back (too many on the page) and did not return it',
};

/** how long a lost GPU context may take to come back before the stage gives up on it (ms) */
const LOST_MS = 2000;

/**
 * Frames drawn a second at most: 60, so a 120 Hz screen doesn't draw twice as often. A frame is drawn once this long (ms, less a
 * little slack for the browser's timing) has passed since the last.
 */
const MIN_FRAME_MS = 1000 / 60 - 2;

let usableGpu: boolean | null = null;

/**
 * Whether this machine draws WebGL2 on a GPU (checked once): not where the browser flags a major performance caveat or names
 * a software renderer (some remote desktops, VMs, graphics acceleration turned off). There the engine would hold the page up,
 * so the components show as they do without WebGL2.
 */
const hasUsableGpu = (): boolean => {
  if (usableGpu !== null) return usableGpu;
  usableGpu = false;
  try {
    const gl = document
      .createElement('canvas')
      .getContext('webgl2', { failIfMajorPerformanceCaveat: true });
    if (gl) {
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = info
        ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) ?? '').toLowerCase()
        : '';
      // the renderers that draw on the CPU, as RazorSense's PerformanceManager lists them (one list for both)
      usableGpu = !POTATO_TIER_PATTERNS.some((pattern) => pattern.test(renderer));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch {
    usableGpu = false;
  }
  return usableGpu;
};

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * FreshStage
 *
 * The box a RazorSense Fresh component draws in: one canvas that follows the box's size, one engine at a time.
 * It stops drawing while the box is off-screen or the tab is hidden, and frees the engine's GPU memory when it goes.
 */
class FreshStage {
  public readonly reducedMotion = prefersReducedMotion();

  private readonly box: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly msg: HTMLElement;
  private readonly createEngine: CreateFreshEngine;
  private readonly onError?: (reason: FreshFailure) => void;

  private engine: FreshEngine | null = null;
  private driver: FreshDriver | null = null;
  private rafId = 0;
  private last = 0;
  private isPaused = false;
  private isOnScreen = true;
  private isDestroyed = false;
  // frames counted for the slow check: since `second` began, and how many seconds running were too slow
  private second = 0;
  private frames = 0;
  private slowSeconds = 0;
  private hasReportedSlow = false;
  private settleId = 0;
  private lostTimer = 0;
  private intersectionObserver: IntersectionObserver | null = null;
  private msgObserver: MutationObserver | null = null;

  constructor(
    box: HTMLElement,
    createEngine: CreateFreshEngine,
    options: { onError?: (reason: FreshFailure) => void } = {},
  ) {
    this.box = box;
    this.createEngine = createEngine;
    this.onError = options.onError;

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
    // the engine's own failure text (a GPU context it couldn't restore): never shown in a decorative box, told through
    // onError instead
    this.msg = document.createElement('div');
    this.msg.setAttribute('aria-hidden', 'true');
    this.msg.style.cssText =
      'display:none;position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none;';
    box.appendChild(this.canvas);
    box.appendChild(this.msg);
    if (typeof MutationObserver !== 'undefined') {
      this.msgObserver = new MutationObserver(() => {
        if (this.msg.textContent) this.onError?.('webgl2');
      });
      this.msgObserver.observe(this.msg, { childList: true, characterData: true, subtree: true });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.isOnScreen = entry ? entry.isIntersecting : true;
        this.update();
      });
      this.intersectionObserver.observe(box);
    }
    document.addEventListener('visibilitychange', this.update);
    this.canvas.addEventListener('webglcontextlost', this.onContextLost);
    this.canvas.addEventListener('webglcontextrestored', this.onContextRestored);
  }

  /**
   * Plays this comp (the one before is freed first). Returns null when WebGL2 isn't there, it draws only on the CPU, or an
   * animation on this page was already too slow.
   */
  public mount(exp: FreshExport, switches: FreshSwitches = ALL_ON): FreshEngine | null {
    this.unmountEngine();
    if (this.isDestroyed) return null;
    if (!hasUsableGpu()) {
      this.onError?.('webgl2');
      return null;
    }
    if (wasSlow) {
      this.onError?.('slow');
      return null;
    }
    let failed = false;
    const engine = this.createEngine(
      {
        canvas: this.canvas,
        box: this.box,
        msg: this.msg,
        onError: (reason) => {
          failed = true;
          this.onError?.(reason);
        },
      },
      exp,
      { ...ALL_ON, ...switches },
    );
    if (failed || !engine.ok) {
      engine.destroy();
      return null;
    }
    this.engine = engine;
    this.update();
    return engine;
  }

  /**
   * Draws a still frame and keeps drawing it for a moment (reduced motion, where nothing runs): the engine needs a few frames to
   * settle (its layers rastered, its programs linked), so a single draw can come out blank. `draw` seeks the still.
   */
  public settle(draw: () => void, seconds = 1): void {
    if (this.settleId) cancelAnimationFrame(this.settleId);
    const until = performance.now() + seconds * 1000;
    const step = (): void => {
      this.settleId = 0;
      if (this.isDestroyed || !this.engine) return;
      draw();
      if (performance.now() < until) this.settleId = requestAnimationFrame(step);
    };
    step();
  }

  /** The component's per-frame clock (null: the engine plays its comp's own timeline). */
  public setDriver(driver: FreshDriver | null): void {
    this.driver = driver;
    this.update();
  }

  public setPaused(isPaused: boolean): void {
    this.isPaused = isPaused;
    this.update();
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.stopLoop();
    if (this.settleId) cancelAnimationFrame(this.settleId);
    this.settleId = 0;
    this.unmountEngine();
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
    this.msgObserver?.disconnect();
    this.msgObserver = null;
    document.removeEventListener('visibilitychange', this.update);
    window.clearTimeout(this.lostTimer);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.canvas.removeEventListener('webglcontextrestored', this.onContextRestored);
    this.canvas.remove();
    this.msg.remove();
  }

  /** the browser took the GPU context back (too many on a page, a GPU reset): if it isn't back soon, the component goes to its still */
  private onContextLost = (): void => {
    if (this.isDestroyed || this.lostTimer) return;
    this.lostTimer = window.setTimeout(() => {
      this.lostTimer = 0;
      if (!this.isDestroyed) this.onError?.('lost');
    }, LOST_MS);
  };

  private onContextRestored = (): void => {
    window.clearTimeout(this.lostTimer);
    this.lostTimer = 0;
  };

  private unmountEngine(): void {
    if (this.engine) {
      this.engine.destroy();
      this.engine = null;
    }
  }

  /** Runs the right loop for the state: the component's clock, the engine's own, or nothing (paused, off-screen, hidden). */
  private update = (): void => {
    const engine = this.engine;
    const isRunning =
      !this.isDestroyed &&
      !this.isPaused &&
      this.isOnScreen &&
      !document.hidden &&
      !this.reducedMotion;
    if (!engine) {
      this.stopLoop();
      return;
    }
    engine.setRunning(isRunning && !this.driver);
    if (isRunning && this.driver) this.startLoop();
    else this.stopLoop();
  };

  private startLoop(): void {
    if (this.rafId) return;
    this.last = 0;
    // (a fresh count: a hidden tab's or a paused stretch's frames don't count as slow)
    this.second = 0;
    this.slowSeconds = 0;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stopLoop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private tick = (now: number): void => {
    this.rafId = requestAnimationFrame(this.tick);
    // (every frame the browser gives counts for the slow check; only some are drawn)
    this.countFrame(now);
    if (this.last && now - this.last < MIN_FRAME_MS) return;
    const dt = this.last ? Math.min(MAX_STEP, (now - this.last) / 1000) : 0;
    this.last = now;
    if (this.engine && this.driver) this.driver(this.engine, dt);
  };

  /** the slow check, a second at a time: too many slow ones running and the component is told (it shows its still instead) */
  private countFrame(now: number): void {
    if (!this.second) {
      this.second = now + SLOW_WARMUP;
      this.frames = 0;
      return;
    }
    if (now < this.second) return;
    this.frames += 1;
    if (now - this.second < 1000) return;
    const fps = (this.frames * 1000) / (now - this.second);
    this.slowSeconds = fps < SLOW_FPS ? this.slowSeconds + 1 : 0;
    this.second = now;
    this.frames = 0;
    if (this.slowSeconds >= SLOW_SECONDS) wasSlow = true;
    // (another animation on the page found it too slow: this one stops too)
    if (wasSlow && !this.hasReportedSlow) {
      this.hasReportedSlow = true;
      this.onError?.('slow');
    }
  }
}

export { FreshStage, freshFailures };
export type { CreateFreshEngine, FreshDriver, FreshFailure };
