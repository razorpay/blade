import { logger } from '~utils/logger';

type FreshRange = { min: number; max: number };

/**
 * The sizes apps may set on the Fresh RazorSense components: sensible ranges, not free. RazorSense was tuned at flow 9's sizes;
 * past these it stops looking like itself, so a value outside its range is held at the nearest end (with a warning in development).
 */
const FRESH_RANGES = {
  /** the whole effect bigger or smaller, bands included */
  scale: { min: 0.75, max: 1.25 },
  /**
   * the chat input the chat background stretches to (CSS px): down to a phone's (a 320 px screen's input, 0.33x flow 9's 840) and up
   * to 1.5x it; 58 px tall (0.6x flow 9's 97) up to a chat input grown with several lines or attachments (the bands keep their size)
   */
  chatInputWidth: { min: 280, max: 1260 },
  chatInputHeight: { min: 58, max: 320 },
} as const;

const warned = new Set<string>();

/**
 * `value` held in `range`. Outside it, a development warning (once per component and prop) says what it was held at;
 * `describe` words a value for that warning (e.g. a stretch as the chat input's width in px).
 */
const holdInRange = (
  value: number,
  range: FreshRange,
  moduleName: string,
  propName: string,
  describe: (v: number) => string = String,
): number => {
  const held = Number.isFinite(value) ? Math.min(range.max, Math.max(range.min, value)) : 1;
  const key = `${moduleName}.${propName}`;
  if (held !== value && !warned.has(key)) {
    warned.add(key);
    logger({
      type: 'warn',
      moduleName,
      message: `${propName} ${describe(value)} is outside ${describe(range.min)} to ${describe(
        range.max,
      )}; it's held at ${describe(held)}.`,
    });
  }
  return held;
};

export { FRESH_RANGES, holdInRange };
export type { FreshRange };
