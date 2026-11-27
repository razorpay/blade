import { useEffect, useRef, useState } from 'react';
import type { Outcome } from './outcome';
import { useStill } from '../RazorSenseEngine/useStill';

/** the voice bottom's still (its own module per color scheme, loaded only when it's needed) */
const loadVoiceBottomStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/voiceBottomDark').then((m) => m.voiceBottomDark)
    : import('./stills/voiceBottomLight').then((m) => m.voiceBottomLight);
const loadSuccessStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/successDark').then((m) => m.successDark)
    : import('./stills/successLight').then((m) => m.successLight);
const loadErrorStill = (colorScheme: 'light' | 'dark'): Promise<string> =>
  colorScheme === 'dark'
    ? import('./stills/errorDark').then((m) => m.errorDark)
    : import('./stills/errorLight').then((m) => m.errorLight);

/** how long an outcome's still shows (ms): its piece's length */
const OUTCOME_STILL_MS = 3710;

/**
 * The bottom wave's still for the PR's states, where it can't animate: an outcome's for its piece's length, else the voice bottom's
 * while it listens; null otherwise (the bottom wave's own still shows). As the animated strip does, an outcome waits till the strip
 * can show it (`canShowOutcome`: thinking done, online, the voice look down), plays once each time it's set (a new one plays for its
 * own full length), and cleared, the strip is back at rest at once.
 */
const useStateStill = (
  isStill: boolean,
  colorScheme: 'light' | 'dark',
  isListening: boolean,
  outcome?: Outcome,
  canShowOutcome = true,
): string | null => {
  const [shown, setShown] = useState<Outcome | null>(null);
  // the outcome last shown (one shows once each time it's set)
  const shownRef = useRef<Outcome | undefined>(undefined);
  useEffect(() => {
    if (isStill && outcome) return;
    shownRef.current = undefined;
    setShown(null);
  }, [isStill, outcome]);
  useEffect(() => {
    if (!isStill || !outcome || !canShowOutcome || shownRef.current === outcome) return;
    shownRef.current = outcome;
    setShown(outcome);
  }, [isStill, outcome, canShowOutcome]);
  useEffect(() => {
    if (!shown) return undefined;
    const timer = window.setTimeout(() => setShown(null), OUTCOME_STILL_MS);
    return () => window.clearTimeout(timer);
  }, [shown]);
  const success = useStill(shown === 'success', colorScheme, loadSuccessStill);
  const error = useStill(shown === 'error', colorScheme, loadErrorStill);
  const voice = useStill(isStill && isListening, colorScheme, loadVoiceBottomStill);
  return success ?? error ?? voice;
};

export { useStateStill };
