import { FreshStage } from '../RazorSenseEngine';
import type { CreateFreshEngine, FreshFailure } from '../RazorSenseEngine';

/**
 * The Spark button hovers' stages, kept warm for a moment and handed from button to button. Making a stage is the costly part of
 * a hover's start: a GPU context, the engine's programs compiled, its framebuffers (18 ms a hover at 4x CPU on a Mac, and on a
 * Windows laptop's Direct3D a frame of 100-160 ms each, so a pointer sweeping a table skipped most hovers: the device test). A
 * stage let go isn't freed at once: it's parked (out of the page, paused) for LINGER_MS, and the next button wanting the same
 * comp takes it, moved into its own spot (a canvas keeps its GPU context and programs as it moves; the engine sizes itself to its
 * new box). Both hovers share the stages of a colour scheme (`kind`): an engine takes any comp made with its clear background
 * (FreshEngine.load), and drops the last one's layers on its first frame (into its small target pool). Keyed by the hover alone,
 * a table's rows (Investigate, then Ask Ray) found a stage of the other hover parked nearly every time: 5 of 41 reused, 32
 * contexts made in a sweep; shared, 34 of 41 and 3.
 *
 * The page's cap holds: stages held and parked are never more than MAX_STAGES (hoverSlots holds 3 at most, and a new stage is
 * made only when none parked fits; one parked for another comp is freed first).
 */
const LINGER_MS = 1500;
/**
 * The switches every hover's stage is mounted with, on top of FreshStage's own: its layers made only over what the button shows
 * (FreshSwitches.view), and each layer's blur run only over its box (blurBox, #4100's: on in FreshStage's defaults already, said
 * here so a hover keeps it whatever the defaults become). Both draw the same picture: checked frame by frame against them off.
 */
const HOVER_SWITCHES = { view: true, blurBox: true } as const;
const MAX_STAGES = 3;

type PooledStage = {
  /** what it's made for: only a stage of the same kind is handed over (the colour scheme its comps are drawn in) */
  kind: string;
  /** its own box, moved into each button's spot: the stage, its canvas and its engine live in it */
  box: HTMLSpanElement;
  stage: FreshStage;
  /** parked since (0: in use) */
  parkedAt: number;
  /** while parked: stops watching its GPU context */
  unwatch?: () => void;
};

const parked: PooledStage[] = [];
let inUse = 0;
let freeTimer = 0;

const free = (pooled: PooledStage): void => {
  pooled.unwatch?.();
  pooled.unwatch = undefined;
  pooled.stage.destroy();
  pooled.box.remove();
};

/**
 * Its GPU context is gone (the browser took it back, too many on the page or a GPU reset, or it was put to sleep): read from the
 * canvas in its own box, whose WebGL2 context getContext hands back. A lost stage is never handed on: its old frames would count
 * as drawn over a blank canvas, hiding the button's own hover (the PR review)
 */
const isLost = (pooled: PooledStage): boolean => {
  const canvas = pooled.box.querySelector('canvas');
  try {
    const gl = canvas?.getContext('webgl2');
    return !gl || gl.isContextLost();
  } catch {
    return true;
  }
};

/** a parked stage taken off the pool and freed (it lost its context, it failed, or it's past its linger) */
const drop = (pooled: PooledStage): void => {
  const i = parked.indexOf(pooled);
  if (i >= 0) parked.splice(i, 1);
  free(pooled);
};

/** frees the stages parked longer than LINGER_MS, and looks again while any are left */
const freeLingering = (): void => {
  freeTimer = 0;
  const now = performance.now();
  for (let i = parked.length - 1; i >= 0; i--) {
    if (now - parked[i].parkedAt >= LINGER_MS) free(parked.splice(i, 1)[0]);
  }
  if (parked.length) {
    const next = Math.min(...parked.map((p) => p.parkedAt + LINGER_MS - now));
    freeTimer = window.setTimeout(freeLingering, Math.max(0, next) + 1);
  }
};

/**
 * A stage for `host` playing `kind`: a parked one of the same kind moved in (its GPU context and compiled programs kept), or a
 * new one. `onError` is told what FreshStage tells (it's handed over with the stage).
 */
const takeStage = (
  host: HTMLElement,
  kind: string,
  createEngine: CreateFreshEngine,
  onError: (reason: FreshFailure) => void,
): PooledStage => {
  // (one lost while parked, or parked past its linger, its timer late as a hidden tab's are: freed, not adopted)
  const now = performance.now();
  parked
    .filter((p) => p.kind === kind && (now - p.parkedAt > LINGER_MS || isLost(p)))
    .forEach(drop);
  const i = parked.findIndex((p) => p.kind === kind);
  if (i >= 0) {
    const pooled = parked.splice(i, 1)[0];
    pooled.unwatch?.();
    pooled.unwatch = undefined;
    pooled.parkedAt = 0;
    pooled.stage.setOnError(onError);
    host.appendChild(pooled.box);
    inUse += 1;
    return pooled;
  }
  // (room for a new one: a stage parked for another comp goes first)
  while (parked.length && inUse + parked.length >= MAX_STAGES) {
    const oldest = parked.reduce((a, b) => (a.parkedAt <= b.parkedAt ? a : b));
    parked.splice(parked.indexOf(oldest), 1);
    free(oldest);
  }
  const box = document.createElement('span');
  box.style.cssText = 'position:absolute;inset:0;display:block;';
  host.appendChild(box);
  inUse += 1;
  return { kind, box, stage: new FreshStage(box, createEngine, { onError }), parkedAt: 0 };
};

/**
 * Done with it. A stage with a working engine is parked for the next button (paused, out of the page) and freed after LINGER_MS,
 * or as soon as its GPU context is lost or it fails while parked; one whose engine failed or whose context was lost (`isReusable`
 * false, or found lost) is freed at once.
 */
const letGoOfStage = (pooled: PooledStage, isReusable = true): void => {
  inUse = Math.max(0, inUse - 1);
  if (!isReusable || !pooled.stage.hasEngine() || isLost(pooled)) {
    free(pooled);
    return;
  }
  pooled.stage.setPaused(true);
  // (a parked stage that loses its context or fails is freed then and there)
  pooled.stage.setOnError(() => drop(pooled));
  const canvas = pooled.box.querySelector('canvas');
  const onLost = (): void => drop(pooled);
  canvas?.addEventListener('webglcontextlost', onLost);
  pooled.unwatch = () => canvas?.removeEventListener('webglcontextlost', onLost);
  pooled.box.remove();
  pooled.parkedAt = performance.now();
  parked.push(pooled);
  if (!freeTimer) freeTimer = window.setTimeout(freeLingering, LINGER_MS + 1);
};

/** (tests) the stages parked now, and those in use */
const stagePoolSize = (): { parked: number; inUse: number } => ({ parked: parked.length, inUse });

export { takeStage, letGoOfStage, stagePoolSize, LINGER_MS, HOVER_SWITCHES };
export type { PooledStage };
