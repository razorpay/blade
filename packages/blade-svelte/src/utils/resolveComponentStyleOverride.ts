import type { StyleOverride } from '@razorpay/blade-core/styles';
import { mergeStyleOverride } from '@razorpay/blade-core/utils';
import type { BladeThemeContextValue, BladeComponentName } from '../components/BladeProvider/types';

/**
 * Merges provider `componentConfig.styleOverride` with an instance override.
 * Instance wins on slot conflicts.
 *
 * Pass `themeContextGetter` from `getBladeThemeContextGetter()` (captured during
 * component init) so context is read reactively inside `$derived`.
 */
export function resolveComponentStyleOverride<Slot extends string>(
  componentName: BladeComponentName,
  instanceOverride: StyleOverride<Slot> | undefined,
  themeContextGetter: (() => BladeThemeContextValue) | undefined,
): StyleOverride<Slot> {
  const providerOverride = themeContextGetter?.().componentConfig?.[componentName]?.styleOverride;

  return mergeStyleOverride(providerOverride, instanceOverride);
}
