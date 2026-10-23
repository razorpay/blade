import { defaultSchedule } from '../base/schedule';
import type { Schedule } from '../base/schedule';
import { LIVE_REGION } from './announce';
import type { LiveMessage, LiveRegion } from './announce';

/** How long a message stays in the region, as Blade React's LiveAnnouncer. */
const MESSAGE_MS = 1000;

let nextId = 0;

/**
 * BladeProvider's live region, for the components below it (`getAnnounce`):
 * each message is a node of its own, added and then removed, so a screen
 * reader says a repeated message again. Call during component init.
 */
export function provideLiveRegion(options: { schedule?: Schedule } = {}): LiveRegion {
  const schedule = options.schedule ?? defaultSchedule;
  let messages = $state.raw<readonly LiveMessage[]>([]);
  const region: LiveRegion = {
    get messages() {
      return messages;
    },
    announce(text) {
      const message = { id: nextId++, text };
      messages = [...messages, message];
      schedule(() => {
        messages = messages.filter((m) => m !== message);
      }, MESSAGE_MS);
    },
  };
  LIVE_REGION.set(region);
  return region;
}
