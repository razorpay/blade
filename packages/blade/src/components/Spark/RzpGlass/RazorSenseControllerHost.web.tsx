/* eslint-disable react/react-in-jsx-scope */

import { useEffect, useRef } from 'react';
import { bindRazorSenseControllerHost } from './RazorSenseController';
import type { RazorSenseBoundController } from './RazorSenseController';
import { RazorSensePresentationHost } from './RazorSensePresentationHost';
import type {
  RazorSensePresentationHostHandle,
  RazorSensePresentationHostProps,
} from './RazorSensePresentationHost';
import type {
  RazorSenseController,
  RazorSenseInterruptionPolicy,
  RazorSenseRunId,
  RazorSenseSequenceController,
  RazorSenseSequenceDefinition,
} from './razorSenseMotionTypes';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

type RazorSenseControllerHostProps = Omit<RazorSensePresentationHostProps, 'initialTarget'> & {
  controller: RazorSenseController | RazorSenseSequenceController;
  sequence?: RazorSenseSequenceDefinition<string, string>;
  runId?: RazorSenseRunId;
  interruptionPolicy?: RazorSenseInterruptionPolicy;
  initialTarget?: RazorSensePresentationHostProps['initialTarget'];
};

const RazorSenseControllerHost = (props: RazorSenseControllerHostProps): React.ReactElement => {
  const {
    controller,
    sequence,
    runId,
    interruptionPolicy = 'replace',
    initialTarget,
    ...presentationProps
  } = props;
  const hostRef = useRef<RazorSensePresentationHostHandle>(null);
  const boundRef = useRef<RazorSenseBoundController>();
  const boundControllerRef = useRef<RazorSenseController | RazorSenseSequenceController>();
  const previousRunIdRef = useRef(runId);
  const sequenceRef = useRef(sequence);
  const runIdRef = useRef(runId);
  sequenceRef.current = sequence;
  runIdRef.current = runId;

  useIsomorphicLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    if (boundRef.current && boundControllerRef.current !== controller) {
      boundRef.current.unbind();
      boundRef.current = undefined;
      boundControllerRef.current = undefined;
    }
    if (!boundRef.current) {
      boundRef.current = bindRazorSenseControllerHost(controller, host, {
        sequence: sequenceRef.current,
        runId: runIdRef.current,
      });
      boundControllerRef.current = controller;
      previousRunIdRef.current = runIdRef.current;
    }

    return () => {
      const bound = boundRef.current;
      bound?.unbind();
      if (boundRef.current === bound) {
        boundRef.current = undefined;
        boundControllerRef.current = undefined;
      }
    };
  }, [controller]);

  useEffect(() => {
    if (!sequence || previousRunIdRef.current === runId) return;
    previousRunIdRef.current = runId;
    boundRef.current?.restartSequence({ runId, interruptionPolicy });
  }, [interruptionPolicy, runId, sequence]);

  return (
    <RazorSensePresentationHost
      {...presentationProps}
      ref={hostRef}
      initialTarget={initialTarget ?? controller.getSnapshot().target}
    />
  );
};

export { RazorSenseControllerHost };
export type { RazorSenseControllerHostProps };
