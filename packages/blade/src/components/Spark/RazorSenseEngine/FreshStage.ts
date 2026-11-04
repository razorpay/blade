import type { FreshEngine, FreshEngineHost, FreshExport, FreshSwitches } from './types';

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
  private readonly onError?: (reason: 'webgl2') => void;

  private engine: FreshEngine | null = null;
  private driver: FreshDriver | null = null;
  private rafId = 0;
  private last = 0;
  private isPaused = false;
  private isOnScreen = true;
  private isDestroyed = false;
  private intersectionObserver: IntersectionObserver | null = null;

  constructor(
    box: HTMLElement,
    createEngine: CreateFreshEngine,
    options: { onError?: (reason: 'webgl2') => void } = {},
  ) {
    this.box = box;
    this.createEngine = createEngine;
    this.onError = options.onError;

    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('aria-hidden', 'true');
    this.canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
    this.msg = document.createElement('div');
    this.msg.style.display = 'none';
    box.appendChild(this.canvas);
    box.appendChild(this.msg);

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.isOnScreen = entry ? entry.isIntersecting : true;
        this.update();
      });
      this.intersectionObserver.observe(box);
    }
    document.addEventListener('visibilitychange', this.update);
  }

  /** Plays this comp (the one before is freed first). Returns null when WebGL2 isn't there. */
  public mount(exp: FreshExport, switches: FreshSwitches = ALL_ON): FreshEngine | null {
    this.unmountEngine();
    if (this.isDestroyed) return null;
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
    this.unmountEngine();
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = null;
    document.removeEventListener('visibilitychange', this.update);
    this.canvas.remove();
    this.msg.remove();
  }

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
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stopLoop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  private tick = (now: number): void => {
    this.rafId = requestAnimationFrame(this.tick);
    const dt = this.last ? Math.min(MAX_STEP, (now - this.last) / 1000) : 0;
    this.last = now;
    if (this.engine && this.driver) this.driver(this.engine, dt);
  };
}

export { FreshStage };
export type { CreateFreshEngine, FreshDriver };
