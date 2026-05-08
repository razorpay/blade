import { getContext, setContext } from 'svelte';

const TOOLTIP_CONTEXT_KEY = Symbol('tooltip-context');

/**
 * Tooltip context is a marker — its only purpose is to assert that
 * `TooltipInteractiveWrapper` is rendered inside a `Tooltip` (mirrors React's
 * `TooltipContext` boolean).
 */
export type TooltipContextValue = true;

export function setTooltipContext(getter: () => TooltipContextValue): void {
  setContext(TOOLTIP_CONTEXT_KEY, getter);
}

export function getTooltipContext(): TooltipContextValue | undefined {
  const getter = getContext<(() => TooltipContextValue) | undefined>(TOOLTIP_CONTEXT_KEY);
  return getter?.();
}
