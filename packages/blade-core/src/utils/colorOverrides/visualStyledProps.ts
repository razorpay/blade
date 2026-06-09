import { getTokenCSSVariable } from '../tokenToCSSVariable';

/**
 * ## Option A — Visual styled props (inline-style fallback)
 *
 * Extends the styled-props idea to *visual* properties (background, color, border,
 * radius). Resolves a token string to a `var(--token)` reference, otherwise passes
 * the raw value straight through to an inline style declaration — exactly mirroring
 * how spacing styled props fall back from `spacing.4` to `12px`.
 *
 * ⚠️ This option is included for side-by-side evaluation. It is intentionally
 * **state-unaware**: writing `background-color` directly *dead-ends* a stateful
 * component's hover/active/disabled background (those come from token classes the
 * inline value now shadows). This is the shipped bug in checkout's Contact CTA and
 * NotificationBanner (proposal §1.1). Prefer Option B (`resolveButtonOverrides`)
 * for stateful components. See instance-level-styling-proposal §4 Option A.
 */
export type VisualStyledProps = Partial<{
  backgroundColor: string;
  color: string;
  borderColor: string;
  borderRadius: string;
}>;

const TOKEN_PREFIXES = ['surface.', 'interactive.', 'feedback.', 'spacing.', 'border.'];

/**
 * If the value looks like a Blade dot-notation token, return a `var(--token)`
 * reference; otherwise return the raw value (arbitrary CSS string passthrough).
 */
const resolveVisualValue = (value: string): string => {
  const isToken = TOKEN_PREFIXES.some((prefix) => value.startsWith(prefix));
  return isToken ? getTokenCSSVariable(value) : value;
};

/**
 * Convert visual styled props into a flat inline-style map (camelCase keys, as
 * the Svelte/React layer would spread onto a `style` attribute).
 *
 * @example
 * resolveVisualStyledProps({ backgroundColor: '#1a59ff', borderRadius: '24px' })
 * // { backgroundColor: '#1a59ff', borderRadius: '24px' }
 */
export const resolveVisualStyledProps = (
  props: VisualStyledProps | undefined,
): Record<string, string> => {
  if (!props) return {};
  const styles: Record<string, string> = {};

  if (props.backgroundColor) {
    styles.backgroundColor = resolveVisualValue(props.backgroundColor);
  }
  if (props.color) {
    styles.color = resolveVisualValue(props.color);
  }
  if (props.borderColor) {
    styles.borderColor = resolveVisualValue(props.borderColor);
  }
  if (props.borderRadius) {
    styles.borderRadius = resolveVisualValue(props.borderRadius);
  }

  return styles;
};
