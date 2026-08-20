import { useEffect, useRef } from 'react';
import {
  assertRazorSenseSequenceControllerDefinition,
  createRazorSenseController,
  createRazorSenseSequenceController,
  disposeRazorSenseController,
} from './RazorSenseController';
import type {
  RazorSenseController,
  RazorSenseSequenceController,
  RazorSenseSequenceDefinition,
  RazorSenseState,
} from './razorSenseMotionTypes';

type UseRazorSenseControllerOptions = {
  /** @default 'idle' */
  initialState?: RazorSenseState;
};

const disposeIfGenerationIsCurrent = (
  lifecycleGeneration: { current: number },
  generation: number,
  controller: RazorSenseController | RazorSenseSequenceController,
): void => {
  if (lifecycleGeneration.current === generation) disposeRazorSenseController(controller);
};

const useDeferredControllerDisposal = (
  controller: RazorSenseController | RazorSenseSequenceController,
): void => {
  const lifecycleGeneration = useRef(0);

  useEffect(() => {
    const generation = ++lifecycleGeneration.current;
    return () => {
      // React Strict Mode intentionally replays effects. Deferring disposal by
      // one microtask lets the second setup retain the same SSR-seeded store,
      // while a real unmount still releases pending commands and listeners.
      void Promise.resolve().then(() => {
        disposeIfGenerationIsCurrent(lifecycleGeneration, generation, controller);
      });
    };
  }, [controller]);
};

/** Creates one component-scoped event-driven RazorSense controller and disposes it on unmount. */
const useRazorSenseController = (
  options: UseRazorSenseControllerOptions = {},
): RazorSenseController => {
  const controllerRef = useRef<RazorSenseController>();
  if (!controllerRef.current) {
    controllerRef.current = createRazorSenseController({
      initialState: options.initialState,
    });
  }
  useDeferredControllerDisposal(controllerRef.current);
  return controllerRef.current;
};

/** Creates a controller permanently bound to the supplied immutable sequence definition. */
const useRazorSenseSequenceController = <Cue extends string, ForegroundSlot extends string>(
  sequence: RazorSenseSequenceDefinition<Cue, ForegroundSlot>,
): RazorSenseSequenceController => {
  const controllerRef = useRef<RazorSenseSequenceController>();
  if (!controllerRef.current) {
    controllerRef.current = createRazorSenseSequenceController(sequence);
  } else {
    assertRazorSenseSequenceControllerDefinition(
      controllerRef.current,
      sequence as RazorSenseSequenceDefinition<string, string>,
    );
  }
  useDeferredControllerDisposal(controllerRef.current);
  return controllerRef.current;
};

export { useRazorSenseController, useRazorSenseSequenceController };
export type { UseRazorSenseControllerOptions };
