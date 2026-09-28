import { getContext, setContext } from 'svelte';

/**
 * Minimal ButtonGroup context (getter pattern). Mirrors React's
 * `ButtonGroupContext` — buttons read it to inherit group `size`/`variant`/etc.
 * Only the reset use-case (see `OverlayContextReset`) is needed in this scope,
 * so the shape is kept open and the default is empty.
 */
export type ButtonGroupContextValue = {
  isInsideButtonGroup?: boolean;
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: 'primary' | 'white' | 'positive' | 'negative';
  isDisabled?: boolean;
};

const BUTTON_GROUP_CONTEXT_KEY = Symbol('button-group-context');

export function setButtonGroupContext(getter: () => ButtonGroupContextValue): void {
  setContext(BUTTON_GROUP_CONTEXT_KEY, getter);
}

export function getButtonGroupContext(): ButtonGroupContextValue {
  const getter = getContext<(() => ButtonGroupContextValue) | undefined>(BUTTON_GROUP_CONTEXT_KEY);
  return getter?.() ?? {};
}
