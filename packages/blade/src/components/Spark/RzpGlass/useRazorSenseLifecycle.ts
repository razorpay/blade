import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { registerRazorSenseRuntime } from './RazorSenseRuntime';
import type {
  RazorSenseRuntimeOptions,
  RazorSenseRuntimeRegistration,
  RazorSenseRuntimeSnapshot,
} from './RazorSenseRuntime';

const INITIAL_SNAPSHOT: RazorSenseRuntimeSnapshot = {
  state: 'dormant',
  isAdmitted: false,
  isPageVisible: true,
  intersectionRatio: 0,
};

const snapshotsAreEqual = (
  first: RazorSenseRuntimeSnapshot,
  second: RazorSenseRuntimeSnapshot,
): boolean =>
  first.state === second.state &&
  first.isAdmitted === second.isAdmitted &&
  first.isPageVisible === second.isPageVisible &&
  first.intersectionRatio === second.intersectionRatio;

const useRazorSenseLifecycle = (
  hostRef: RefObject<HTMLElement>,
  options: RazorSenseRuntimeOptions,
): RazorSenseRuntimeSnapshot => {
  const [snapshot, setSnapshot] = useState<RazorSenseRuntimeSnapshot>(INITIAL_SNAPSHOT);
  const snapshotRef = useRef(snapshot);
  const optionsRef = useRef(options);
  const registrationRef = useRef<RazorSenseRuntimeRegistration>();
  optionsRef.current = options;

  const handleSnapshot = useCallback((nextSnapshot: RazorSenseRuntimeSnapshot): void => {
    if (snapshotsAreEqual(snapshotRef.current, nextSnapshot)) return;
    snapshotRef.current = nextSnapshot;
    setSnapshot(nextSnapshot);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined' || !hostRef.current) return undefined;

    const registration = registerRazorSenseRuntime(
      hostRef.current,
      optionsRef.current,
      handleSnapshot,
    );
    registrationRef.current = registration;

    return () => {
      registration.unregister();
      registrationRef.current = undefined;
    };
  }, [handleSnapshot, hostRef]);

  useEffect(() => {
    registrationRef.current?.update(optionsRef.current);
  }, [options.family, options.isInteractive, options.isPaused, options.retainsWebGL]);

  return snapshot;
};

export { useRazorSenseLifecycle };
