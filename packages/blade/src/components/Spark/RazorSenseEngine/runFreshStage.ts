import type React from 'react';
import { FreshStage, freshFailures, whyCantAnimate } from './FreshStage';
import { loadFreshEngine } from './loadFreshEngine';

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
 * A RazorSense 2.0 component's stage, from its engine loading to it being freed: loads the engine and the component's comps,
 * puts a FreshStage on its box, lets the component start drawing, and, when it can't animate (no usable WebGL2, its engine
 * failing to load, the stage giving up: too slow, its GPU context lost), frees the stage and says why, once. Returns the
 * cleanup for the component's effect.
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
  const fail = (reason = 'WebGL2 is unavailable, or the GPU draws only on the CPU'): void => {
    if (hasFailed || !isLive) return;
    hasFailed = true;
    // the stage freed after this frame (it may be the one telling us)
    window.setTimeout(() => {
      stage?.destroy();
      if (stageRef.current === stage) stageRef.current = null;
      onRelease();
    }, 0);
    onFail(new Error(`${moduleName}: ${reason}`));
  };
  // (where it can't animate anyway, it goes to its still at once: no engine or comps downloaded for nothing)
  const cant = whyCantAnimate();
  if (cant) {
    fail(freshFailures[cant]);
    return () => {
      isLive = false;
    };
  }
  void Promise.all([loadFreshEngine(), loadComps()])
    .then(([createFreshEngine, comps]) => {
      const box = getBox();
      if (!isLive || !box || shouldStart?.() === false) return;
      stage = new FreshStage(box, createFreshEngine, {
        onError: (reason) => fail(freshFailures[reason]),
      });
      stageRef.current = stage;
      if (!start(stage, comps)) fail(); // no usable WebGL2: nothing drawn, what it wraps shows as it is
    })
    .catch(() => fail('its engine failed to load'));
  return () => {
    isLive = false;
    stageRef.current?.destroy();
    stageRef.current = null;
    onRelease();
  };
};

export { runFreshStage };
export type { FreshStageRun };
