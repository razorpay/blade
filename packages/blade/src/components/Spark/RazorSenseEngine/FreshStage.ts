import type { FreshDoc, FreshEngine, FreshEngineHost, FreshExport, FreshSwitches } from './types';
import { POTATO_TIER_PATTERNS } from '../RzpGlass/PerformanceManager';

type MakeFreshEngine<Made> = (
  host: FreshEngineHost,
  exp: FreshExport,
  switches: FreshSwitches,
) => Made;

type CreateFreshEngine = MakeFreshEngine<FreshEngine> & {
  /** the same engine made a step at a time: each next() is one part of it, and the engine is what the last one returns */
  steps?: MakeFreshEngine<Generator<void, FreshEngine, void>>;
};

/** An engine being made ahead of its comp, a step at a time (FreshStage.prepareStep), with the clear background it's made with. */
type PreparedEngine = {
  steps: Generator<void, FreshEngine, void>;
  engine: FreshEngine | null;
  hasFailed: boolean;
};

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
 * fallback under 20 fps). The component shows its still instead, and so does every one on this page until it reloads: a
 * device that's too slow once stays too slow, and checking again would mean 3 more janky seconds for each new one (the chat's
 * thinking, a new page section). That's deliberate; the first 2 seconds of each stage aren't counted, so a single stall (a
 * heavy render, a GC pause) doesn't trip it.
 */
const SLOW_FPS = 20;
const SLOW_SECONDS = 3;
/** a stage's first frames don't count (its first draws, and a page still booting, stall) (ms) */
const SLOW_WARMUP = 2000;

/**
 * Between full quality and the still, for devices that can't keep up (page-wide, like the still): running under EASE_FPS (or under
 * three quarters of the screen's own rate, on a slower screen) for EASE_SECONDS, every stage draws every other frame: the same
 * picture, half the work. Still under it, at a lower sharpness too (its canvas at EASE_DPR). Only under SLOW_FPS does it go to its
 * still. Under SLOW_FPS each step comes sooner (SLOW_STEP_SECONDS). A device that holds its frame rate never gets here, so
 * everywhere else it's exactly as made. The screen's rate is measured before any engine draws (screenFps): a device slow from its
 * first frame never shows its screen's rate once drawing (the review: compared with the best seen, it never stepped down).
 */
const EASE_FPS = 45;
const EASE_SECONDS = 3;
const SLOW_STEP_SECONDS = 2;
const EASE_DPR = 1.2;
/** 0: full; 1: every other frame; 2: and at EASE_DPR */
let easeLevel = 0;

/**
 * the screen's frame rate (0: not measured yet), from the page's own frames from the moment a RazorSense component mounts, before
 * its engine has even loaded (measureScreen; not as this module loads: every app importing a Blade component would run it, the
 * PR review): the gap of its fastest tenth of 60 frames, so a page busy with its own start-up (long frames) still shows its
 * screen's rate
 */
let screenFps = 0;
let isProbing = false;
const measureScreen = (): void => {
  if (screenFps || isProbing || typeof requestAnimationFrame !== 'function') return;
  isProbing = true;
  const times: number[] = [];
  const step = (time: number): void => {
    times.push(time);
    if (times.length < 60) {
      requestAnimationFrame(step);
      return;
    }
    const gaps = times
      .slice(1)
      .map((t, i) => t - times[i])
      .sort((a, b) => a - b);
    const fast = gaps[Math.floor(gaps.length / 10)];
    screenFps = fast > 0 ? Math.min(240, 1000 / fast) : 60;
  };
  requestAnimationFrame(step);
};

let wasSlow = false;
/**
 * A stage on this page drew nothing in its first FIRST_DRAW_MS on screen: its GPU is stuck (compiling, on Direct3D). Every stage
 * after it shows its still at once, rather than giving that GPU more to compile (and each a blank box while it waits).
 */
let wasStalled = false;

/**
 * why a stage can't animate: no usable WebGL2, frames too slow, a GPU context the browser took back and didn't return, or a first
 * frame that never came
 */
type FreshFailure = 'webgl2' | 'slow' | 'lost' | 'stalled';

/** each failure in words, for a component's onError */
const freshFailures: Record<FreshFailure, string> = {
  webgl2: 'WebGL2 is unavailable, or the GPU draws only on the CPU',
  slow: 'its frames are too slow on this device',
  lost: 'the browser took its GPU context back (too many on the page) and did not return it',
  stalled: 'it drew nothing in its first 45 s on screen (its GPU never got going)',
};

/**
 * How long a new engine may run on screen without drawing a frame before the component gives up on it and keeps its still (ms).
 * Meanwhile the component shows its still (runFreshStage's onWaiting), so nothing is blank while it waits. Patient: on Direct3D
 * (Chrome on Windows) the first compile of the main pass takes tens of seconds with the page still responsive (the shaders compile
 * in the background), and the browser caches it, so a later visit draws at once. A GPU that never draws (the review's blank first
 * load) still ends on the still.
 */
const FIRST_DRAW_MS = 45000;

/**
 * Its canvas is looked at each frame for a frame to show only while one can come: the stage running or settling, or this long
 * after it's armed (a frame a component draws by seeking; an engine waking, which redraws by itself: WAKE_SHOW_MS). Paused, off
 * screen or hidden it isn't polled (the PR review: a stage paused from the start polled forever): update() looks again (ms)
 */
const SHOW_GRACE_MS = 1000;
const WAKE_SHOW_MS = 10000;

/**
 * Out of sight this long (its box off screen, past WAKE_MARGIN), a stage's engine gives its GPU memory back (sleep: its context
 * let go, everything else kept), and makes it again once its box comes within WAKE_MARGIN of the screen, so its frame is back by
 * the time it scrolls in (ms)
 */
const SLEEP_AFTER_MS = 30000;
const WAKE_MARGIN = '400px';

/** how long a lost GPU context may take to come back before the stage gives up on it (ms) */
const LOST_MS = 2000;

/**
 * Frames drawn a second at most: 60, so a 120 Hz screen doesn't draw twice as often. Each frame the browser gives adds its time to
 * a budget, a frame is drawn once a frame's worth (FRAME_MS, less FRAME_SLACK_MS for the browser's timing) has built up, and
 * what's over carries on: 60 a second on any screen of 60 Hz or more, a 75 Hz or 144 Hz one too (measured from the last frame
 * drawn, those drew at 37.5 and 48; the PR review). After a long gap (a hidden tab, a stall) it starts afresh.
 */
const FRAME_MS = 1000 / 60;
const FRAME_SLACK_MS = 2;

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

/**
 * Why nothing could animate here, known before anything is loaded: no usable WebGL2 (or a GPU that draws only on the CPU), or an
 * animation on this page was already too slow. Null when it can try.
 */
const whyCantAnimate = (): FreshFailure | null => {
  if (!hasUsableGpu()) return 'webgl2';
  if (wasSlow) return 'slow';
  if (wasStalled) return 'stalled';
  return null;
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
  private canvas: HTMLCanvasElement;
  private readonly msg: HTMLElement;
  private readonly createEngine: CreateFreshEngine;
  private onError?: (reason: FreshFailure) => void;
  private onShown?: () => void;
  private firstDrawTimer = 0;
  private waitedForFirstDraw = 0;
  private hasStalled = false;

  private engine: FreshEngine | null = null;
  private prepared: PreparedEngine | null = null;
  private driver: FreshDriver | null = null;
  private rafId = 0;
  private last = 0;
  // the frame budget (ms built up towards the next frame drawn) and the browser's last frame, drawn or not
  private budget = 0;
  private lastTick = 0;
  private isPaused = false;
  private isOnScreen = true;
  private isDestroyed = false;
  // frames counted for the slow check: since `second` began, and how many seconds running were too slow
  private second = 0;
  private frames = 0;
  private slowSeconds = 0;
  private hasReportedSlow = false;
  private easeSeconds = 0;
  private easedTo = 0;
  private settleId = 0;
  private showId = 0;
  // its canvas waiting to show a frame past this one (showOnFirstFrame), looked at each frame till showUntil when not running
  private isShowPending = false;
  private showAfter = 0;
  private showUntil = 0;
  // its first frame's clock is wanted (watchFirstDraw): it ticks only while the stage runs
  private isFirstDrawWatched = false;
  private sleepTimer = 0;
  private isAsleep = false;
  private isNear = true;
  private nearObserver: IntersectionObserver | null = null;
  private lostTimer = 0;
  private intersectionObserver: IntersectionObserver | null = null;
  private msgObserver: MutationObserver | null = null;

  constructor(
    box: HTMLElement,
    createEngine: CreateFreshEngine,
    options: { onError?: (reason: FreshFailure) => void; onShown?: () => void } = {},
  ) {
    this.box = box;
    this.createEngine = createEngine;
    this.onError = options.onError;
    this.onShown = options.onShown;

    this.canvas = this.makeCanvas();
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
        // (its only message: a lost GPU context it couldn't set up again, as the review found: a lost context, not no WebGL2)
        if (this.msg.textContent) this.onError?.('lost');
      });
      this.msgObserver.observe(this.msg, { childList: true, characterData: true, subtree: true });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(([entry]) => {
        this.isOnScreen = entry ? entry.isIntersecting : true;
        this.update();
      });
      this.intersectionObserver.observe(box);
      this.nearObserver = new IntersectionObserver(
        ([entry]) => {
          this.isNear = entry ? entry.isIntersecting : true;
          this.update();
        },
        { rootMargin: WAKE_MARGIN },
      );
      this.nearObserver.observe(box);
    }
    document.addEventListener('visibilitychange', this.update);
    // (the screen's rate, while nothing of this stage draws yet)
    measureScreen();
  }

  /**
   * One step of making this stage's engine ahead of its comp, while the page is idle: true once it's made, or when there's
   * nothing to make here. `alpha` is the clear background its comp will ask for (its GPU context is made with it). Made in one
   * go, an engine is one long task (190-330 ms on a mid-range Android phone, about 1 s there on the first visit after the engine
   * changes); a step at a time, the page draws its frames between them. `mount` then hands it its comp.
   */
  public prepareStep(alpha: boolean): boolean {
    if (this.isDestroyed || this.engine || !this.createEngine.steps || whyCantAnimate())
      return true;
    if (!this.prepared) {
      const prepared: PreparedEngine = {
        steps: this.createEngine.steps(
          {
            canvas: this.canvas,
            box: this.box,
            msg: this.msg,
            // (no WebGL2 after all: mount makes its engine the usual way, and that says so)
            onError: () => {
              prepared.hasFailed = true;
            },
            isHeld: true,
          },
          // (no comp yet: the engine starts on its blank document, and load gives it the real one)
          { doc: (undefined as unknown) as FreshDoc, opts: { alpha, paused: true } },
          ALL_ON,
        ),
        engine: null,
        hasFailed: false,
      };
      this.prepared = prepared;
      // (making it is a step of its own: the first call compiles the engine's code)
      return false;
    }
    const prepared = this.prepared;
    if (prepared.engine || prepared.hasFailed) return true;
    try {
      const step = prepared.steps.next();
      if (step.done) prepared.engine = step.value;
      return Boolean(step.done) || prepared.hasFailed;
    } catch {
      prepared.hasFailed = true;
      return true;
    }
  }

  /**
   * Plays this comp. On a stage already playing one, the same engine takes it (its GPU context and compiled programs kept: a new
   * colour scheme or scale makes nothing new); one made ahead (prepareStep) takes it the same way; otherwise a new engine. Returns
   * null when WebGL2 isn't there, it draws only on the CPU, or an animation on this page was already too slow.
   */
  public mount(exp: FreshExport, switches: FreshSwitches = ALL_ON): FreshEngine | null {
    if (this.engine && !this.isDestroyed && this.engine.load?.(exp)) {
      // (what the last comp's component set on it goes: its new one sets its own)
      this.driver = null;
      if (this.settleId) cancelAnimationFrame(this.settleId);
      this.settleId = 0;
      this.update();
      return this.engine;
    }
    this.unmountEngine();
    if (this.isDestroyed) return null;
    const cant = whyCantAnimate();
    if (cant) {
      this.dropPrepared();
      this.onError?.(cant);
      return null;
    }
    const prepared = this.takePrepared(exp, switches);
    if (prepared) {
      this.engine = prepared;
      this.update();
      this.watchFirstDraw();
      this.showOnFirstFrame();
      return prepared;
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
    this.watchFirstDraw();
    this.showOnFirstFrame();
    return engine;
  }

  /** whether it has an engine (made, not freed): one a component can hand its next comp to */
  public hasEngine(): boolean {
    return Boolean(this.engine) && !this.isDestroyed;
  }

  /** whether its engine has drawn a frame yet */
  public hasDrawn(): boolean {
    return (this.engine?.drawn?.() ?? 1) > 0;
  }

  /** whether its engine only waits on its GPU for its first frame (a shader compiling in the background): it needs nothing more of the page */
  public waitsOnGpu(): boolean {
    return !this.isDestroyed && Boolean(this.engine?.waitsOnGpu?.());
  }

  /** whether it's drawing now (on screen, not paused, the tab shown): a stage that isn't can't be waited on to draw */
  public isRunning(): boolean {
    return !this.isDestroyed && !this.isPaused && this.isOnScreen && !document.hidden;
  }

  /** who's told when its canvas shows a frame: its first, or its first since waking (a component taking over a stage it had before) */
  public setOnShown(onShown?: () => void): void {
    this.onShown = onShown;
  }

  /** who's told when it can't animate (a component taking over a stage it had before) */
  public setOnError(onError?: (reason: FreshFailure) => void): void {
    this.onError = onError;
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
      // (a frame drawn while it isn't running: shown now)
      this.checkShown();
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
    window.clearInterval(this.firstDrawTimer);
    this.stopLoop();
    if (this.settleId) cancelAnimationFrame(this.settleId);
    this.settleId = 0;
    cancelAnimationFrame(this.showId);
    this.showId = 0;
    window.clearTimeout(this.sleepTimer);
    this.sleepTimer = 0;
    this.nearObserver?.disconnect();
    this.nearObserver = null;
    this.dropPrepared();
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
    // (let go on purpose, out of sight: not a loss)
    if (this.isDestroyed || this.lostTimer || this.isAsleep) return;
    this.lostTimer = window.setTimeout(() => {
      this.lostTimer = 0;
      if (!this.isDestroyed) this.onError?.('lost');
    }, LOST_MS);
  };

  private onContextRestored = (): void => {
    window.clearTimeout(this.lostTimer);
    this.lostTimer = 0;
  };

  /**
   * A new engine has FIRST_DRAW_MS of running on screen (not paused, the tab shown) to draw its first frame; after that the
   * component is told ('stalled') and goes to its still, so a GPU that never draws can't leave a blank box.
   */
  private watchFirstDraw(): void {
    window.clearInterval(this.firstDrawTimer);
    this.firstDrawTimer = 0;
    this.waitedForFirstDraw = 0;
    this.isFirstDrawWatched = Boolean(this.engine?.drawn);
    this.armFirstDrawWatch();
  }

  /** (its clock ticks only while the stage runs: paused, off screen or hidden, nothing polls, and update() starts it again) */
  private armFirstDrawWatch(): void {
    if (!this.isFirstDrawWatched || this.firstDrawTimer || !this.isRunning()) return;
    const STEP = 250;
    this.firstDrawTimer = window.setInterval(() => {
      if (this.isDestroyed || !this.engine || this.hasDrawn()) {
        this.isFirstDrawWatched = false;
      } else if (this.isRunning()) {
        this.waitedForFirstDraw += STEP;
        if (this.waitedForFirstDraw < FIRST_DRAW_MS) return;
        this.isFirstDrawWatched = false;
        this.hasStalled = true;
        wasStalled = true;
        this.onError?.('stalled');
      }
      window.clearInterval(this.firstDrawTimer);
      this.firstDrawTimer = 0;
    }, STEP);
  }

  /**
   * a canvas for the box (the engine's GPU context is made on it), watched for that context being taken back: hidden till its
   * engine's first frame (showOnFirstFrame)
   */
  private makeCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;visibility:hidden;';
    canvas.addEventListener('webglcontextlost', this.onContextLost);
    canvas.addEventListener('webglcontextrestored', this.onContextRestored);
    return canvas;
  }

  /**
   * The engine made ahead (prepareStep), finished if it isn't yet, given this comp: null when there's none, or it can't take
   * this one (made with another clear background, or other switches). Then it goes with its canvas, since a canvas keeps the
   * GPU context it was first given, and mount makes a new engine on a new canvas.
   */
  private takePrepared(exp: FreshExport, switches: FreshSwitches): FreshEngine | null {
    const prepared = this.prepared;
    this.prepared = null;
    if (!prepared) return null;
    try {
      while (!prepared.engine && !prepared.hasFailed) {
        const step = prepared.steps.next();
        if (step.done) prepared.engine = step.value;
      }
    } catch {
      prepared.hasFailed = true;
    }
    const { engine } = prepared;
    const isAllOn = (Object.keys(ALL_ON) as (keyof FreshSwitches)[]).every(
      (key) => (switches[key] ?? ALL_ON[key]) === ALL_ON[key],
    );
    if (engine && !prepared.hasFailed && engine.ok && isAllOn && engine.load?.(exp)) return engine;
    this.prepared = prepared;
    this.dropPrepared();
    const old = this.canvas;
    old.removeEventListener('webglcontextlost', this.onContextLost);
    old.removeEventListener('webglcontextrestored', this.onContextRestored);
    this.canvas = this.makeCanvas();
    old.replaceWith(this.canvas);
    return null;
  }

  /** the engine made ahead goes, unused (its stage going, or nothing to play here after all) */
  private dropPrepared(): void {
    const prepared = this.prepared;
    this.prepared = null;
    if (!prepared) return;
    // (softly, as one that never drew: its context goes with its canvas)
    if (prepared.engine) prepared.engine.destroy(true);
    else prepared.steps.return((undefined as unknown) as FreshEngine);
  }

  /**
   * Its canvas shows from its engine's first frame. Before that an opaque one (the Loader's) is black: its GPU context is made and
   * nothing is drawn yet, which on a slow GPU (compiling its shaders) or with an engine made ahead could be a second or more. The
   * box's own background (the splash's ground) or the component's still shows meanwhile.
   */
  private showOnFirstFrame(after = 0, graceMs = SHOW_GRACE_MS): void {
    this.isShowPending = true;
    this.showAfter = after;
    this.showUntil = performance.now() + graceMs;
    this.checkShown();
  }

  private checkShown = (): void => {
    cancelAnimationFrame(this.showId);
    this.showId = 0;
    if (!this.isShowPending || this.isDestroyed || !this.engine) return;
    if ((this.engine.drawn?.() ?? 1) > this.showAfter) {
      this.isShowPending = false;
      this.canvas.style.visibility = '';
      this.onShown?.();
      return;
    }
    if (this.isRunning() || this.settleId || performance.now() < this.showUntil) {
      this.showId = requestAnimationFrame(this.checkShown);
    }
  };

  /** asleep, or a timer to sleep, or awake again: by whether its box is in sight, or near it */
  private updateSleep(): void {
    const { engine } = this;
    if (!engine?.sleep || this.isDestroyed) return;
    if (this.isAsleep) {
      if (this.isNear) this.wake();
      return;
    }
    if (this.isNear) {
      window.clearTimeout(this.sleepTimer);
      this.sleepTimer = 0;
    } else if (!this.sleepTimer) {
      this.sleepTimer = window.setTimeout(this.sleep, SLEEP_AFTER_MS);
    }
  }

  private sleep = (): void => {
    this.sleepTimer = 0;
    const { engine } = this;
    // (one that hasn't drawn yet is still compiling: let go now, it would compile it all again on waking)
    if (!engine?.sleep || this.isDestroyed || this.isAsleep || this.isNear || !this.hasDrawn())
      return;
    this.isAsleep = true;
    if (!engine.sleep()) {
      this.isAsleep = false;
      return;
    }
    // (its canvas is blank now: hidden till the frame it had is drawn again)
    this.canvas.style.visibility = 'hidden';
  };

  private wake(): void {
    const { engine } = this;
    this.isAsleep = false;
    if (!engine) return;
    // (it redraws by itself as its context comes back, running or not)
    this.showOnFirstFrame(engine.drawn?.() ?? 0, WAKE_SHOW_MS);
    engine.wake?.();
  }

  private unmountEngine(): void {
    window.clearTimeout(this.sleepTimer);
    this.sleepTimer = 0;
    this.isAsleep = false;
    if (this.engine) {
      // (one that never drew is let go softly: losing its context by hand waits for a GPU that may be stuck compiling)
      this.engine.destroy(this.hasStalled || !this.hasDrawn());
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
    this.updateSleep();
    // (its first frame looked for again, now that one may come)
    this.checkShown();
    this.armFirstDrawWatch();
  };

  private startLoop(): void {
    if (this.rafId) return;
    this.last = 0;
    this.lastTick = 0;
    this.budget = 0;
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
    // (every other frame on a device that can't keep up: half the frames, the same picture)
    const frameMs = easeLevel >= 1 ? 2 * FRAME_MS : FRAME_MS;
    const gap = this.lastTick ? now - this.lastTick : 0;
    this.lastTick = now;
    this.budget = gap > 4 * frameMs ? frameMs : this.budget + gap;
    if (this.last && this.budget < frameMs - FRAME_SLACK_MS) return;
    this.budget = this.last ? Math.min(frameMs, this.budget - frameMs) : 0;
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
    // the middle step first (a second under EASE_FPS, or under 3/4 of the screen's rate on a slower screen, counts towards it;
    // under SLOW_FPS each step comes sooner): each step down starts the still's count again, so the still comes only once the
    // lowest step can't keep up either
    this.easeSeconds =
      fps < Math.min(EASE_FPS, 0.75 * (screenFps || 60)) ? this.easeSeconds + 1 : 0;
    if (this.easeSeconds >= (fps < SLOW_FPS ? SLOW_STEP_SECONDS : EASE_SECONDS) && easeLevel < 2) {
      easeLevel += 1;
      this.easeSeconds = 0;
      this.slowSeconds = 0;
    } else if (this.easedTo !== easeLevel) {
      // (another stage on the page stepped down: this one's count starts again too)
      this.slowSeconds = 0;
    }
    if (this.slowSeconds >= SLOW_SECONDS && easeLevel >= 2) wasSlow = true;
    if (this.easedTo !== easeLevel) {
      this.easedTo = easeLevel;
      this.engine?.sharpness?.(easeLevel >= 2 ? EASE_DPR : 0);
    }
    // (another animation on the page found it too slow: this one stops too)
    if (wasSlow && !this.hasReportedSlow) {
      this.hasReportedSlow = true;
      this.onError?.('slow');
    }
  }
}

export { FreshStage, freshFailures, measureScreen, whyCantAnimate };
export type { CreateFreshEngine, FreshDriver, FreshFailure };
