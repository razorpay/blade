/**
 * Attributes a native option container carries: `checked` drives the
 * `checked:` style variants and `disabled` the pressed state, both read by
 * the bridge as plain attributes.
 */
export function nativeOptionState(active: boolean, disabled: boolean): Record<string, string> {
  const state: Record<string, string> = {};
  if (active) {
    state.checked = 'true';
  }
  if (disabled) {
    state.disabled = 'true';
  }
  return state;
}
