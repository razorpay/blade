import { getAdapters } from '../../adapters';
import type { HapticKind } from '../../adapters';

export type { HapticKind };

/**
 * Reports what a press or a pick meant to `adapters.vibrate`, which decides
 * whether the device vibrates: a button reports `press`, a choice control
 * `select` (a radio, a chip) or `toggle` (a checkbox, a switch), a refused
 * press `warning`. Call during component init; call the result on the
 * event.
 */
export function getHaptics(): (kind: HapticKind) => void {
  const adapters = getAdapters();
  return (kind) => adapters.vibrate?.(kind);
}
