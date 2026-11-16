import type React from 'react';
import { FreshStage, freshFailures, whyCantAnimate } from './FreshStage';
import { loadFreshEngine } from './loadFreshEngine';
import { waitForTurn } from './startQueue';

type FreshStageRun<Comps> = {
  /** for its errors */
  moduleName: string;
  /** the box the canvas goes in (read once the engine is in) */
  getBox: () => HTMLElement | null;
  /** set to its stage while it's up (cleared once it's freed) */
  stageRef: React.MutableRefObject<FreshStage | null>;
  /** its comps (a dynamic import, loaded with the engine) */
  loadComps: () => Promise<Comps>;
  /** checked once the engine is in: false and it doesn't start (say, a splash already done) */
  shouldStart?: () => boolean;
  /** mounts what it draws on the new stage; false when it can't (no usable WebGL2) */
  start: (stage: FreshStage, comps: Comps) => boolean;
  /** it can't animate here (called once, with why): it goes to its still */
  onFail: (error: Error) => void;
  /** its stage is gone (failed, or unmounted): let go of what was drawn with it */
  onRelease: () => void;
};

/**
 * A component's stage, kept for a moment when its effect is cleaned up: if the same component's effect runs again straight away (a
 * new colour scheme or scale), the new run takes the stage over, and its engine plays the new comp on the same GPU context, with
 * nothing new made or compiled. Otherwise (the component went) it's freed after this task.
 */
const parked = new WeakMap<React.MutableRefObject<FreshStage | null>, FreshStage>();

const park = (stageRef: React.MutableRefObject<FreshStage | null>, stage: FreshStage): void => {
  parked.set(stageRef, stage);
  window.setTimeout(() => {
    if (parked.get(stageRef) !== stage) return;
    parked.delete(stageRef);
    stage.destroy();
    if (stageRef.current === stage) stageRef.current = null;
  }, 0);
};

/**
 * A RazorSense 2.0 component's stage, from its engine loading to it being freed: loads the engine and the component's comps,
 * puts a FreshStage on its box when it's on screen and its turn (one engine starts at a time, page-wide: startQueue), lets the
 * component start drawing, and, when it can't animate (no usable WebGL2, its engine failing to load, the stage giving up: too
 * slow, its GPU context lost, no first frame), frees the stage and says why, once. A run straight after the same component's
 * last one (a new colour scheme or scale) reuses that run's stage and engine. Returns the cleanup for the component's effect.
 */
const runFreshStage = <Comps>({
  moduleName,
  getBox,
  stageRef,
  loadComps,
  shouldStart,
  start,
  onFail,
  onRelease,
}: FreshStageRun<Comps>): (() => void) => {
  let isLive = true;
  let hasFailed = false;
  let stage: FreshStage | null = null;
  let leaveQueue: (() => void) | null = null;
  // (this component's last stage, if its effect just ran again)
  const previous = parked.get(stageRef) ?? null;
  parked.delete(stageRef);

  const fail = (reason = 'WebGL2 is unavailable, or the GPU draws only on the CPU'): void => {
    if (hasFailed || !isLive) return;
    hasFailed = true;
    // the stage freed after this frame (it may be the one telling us)
    const failed = stage;
    window.setTimeout(() => {
      failed?.destroy();
      if (stageRef.current === failed) stageRef.current = null;
      onRelease();
    }, 0);
    onFail(new Error(`${moduleName}: ${reason}`));
  };
  const onError = (reason: keyof typeof freshFailures): void => fail(freshFailures[reason]);
  // (where it can't animate anyway, it goes to its still at once: no engine or comps downloaded for nothing)
  const cant = whyCantAnimate();
  if (cant) {
    previous?.destroy();
    fail(freshFailures[cant]);
    return () => {
      isLive = false;
    };
  }
  void Promise.all([loadFreshEngine(), loadComps()])
    .then(([createFreshEngine, comps]) => {
      const box = getBox();
      if (!isLive || !box || shouldStart?.() === false) {
        previous?.destroy();
        if (stageRef.current === previous) stageRef.current = null;
        return;
      }
      if (previous?.hasEngine()) {
        // the same component again: its stage and engine take the new comp
        stage = previous;
        stage.setOnError(onError);
        stageRef.current = stage;
        if (!start(stage, comps)) fail();
        return;
      }
      previous?.destroy();
      leaveQueue = waitForTurn(box, () => {
        if (!isLive) return null;
        stage = new FreshStage(box, createFreshEngine, { onError });
        stageRef.current = stage;
        if (!start(stage, comps)) {
          fail(); // no usable WebGL2: nothing drawn, what it wraps shows as it is
          return null;
        }
        const started = stage;
        return () => started.hasDrawn();
      });
    })
    .catch(() => fail('its engine failed to load'));
  return () => {
    isLive = false;
    leaveQueue?.();
    const current = stageRef.current;
    if (current && current === stage && !hasFailed && current.hasEngine()) {
      // (kept for a moment: the same component's next run may take it over)
      park(stageRef, current);
    } else {
      current?.destroy();
      stageRef.current = null;
    }
    onRelease();
  };
};

export { runFreshStage };
export type { FreshStageRun };
