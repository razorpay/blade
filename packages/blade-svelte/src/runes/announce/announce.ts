import { getAdapters } from '../../adapters';
import { defineContext } from '../context';

export interface LiveMessage {
  id: number;
  text: string;
}

/** The one polite live region an overlay host renders (`provideLiveRegion`). */
export interface LiveRegion {
  /** What it says now, oldest first. Tracked by whatever reads it. */
  readonly messages: readonly LiveMessage[];
  /** Adds a message; it leaves after a second, so the same text is said again next time. */
  announce(message: string): void;
}

export const LIVE_REGION = defineContext<LiveRegion>('blade-live-region');

/**
 * Says a message to a screen reader: through the app's `adapters.announce`,
 * else the nearest overlay host's live region. Without either it says
 * nothing. Call during component init; call the result any time.
 */
export function getAnnounce(): (message: string) => void {
  const adapters = getAdapters();
  const region = LIVE_REGION.get();
  return (message) => {
    if (message) {
      (adapters.announce ?? region?.announce)?.(message);
    }
  };
}
