import { useEffect, useState } from 'react';
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
 * The bottom wave's still for the PR's states, where it can't animate: an outcome's for its piece's length once it's set, else the
 * voice bottom's while it listens; null otherwise (the bottom wave's own still shows)
 */
const useStateStill = (
  isStill: boolean,
  colorScheme: 'light' | 'dark',
  isListening: boolean,
  outcome?: Outcome,
): string | null => {
  const [shown, setShown] = useState<Outcome | null>(null);
  useEffect(() => {
    if (!isStill || !outcome) {
      setShown(null);
      return undefined;
    }
    setShown(outcome);
    const timer = window.setTimeout(() => setShown(null), OUTCOME_STILL_MS);
    return () => window.clearTimeout(timer);
  }, [isStill, outcome]);
  const success = useStill(shown === 'success', colorScheme, loadSuccessStill);
  const error = useStill(shown === 'error', colorScheme, loadErrorStill);
  const voice = useStill(isStill && isListening, colorScheme, loadVoiceBottomStill);
  return success ?? error ?? voice;
};

export { useStateStill };
