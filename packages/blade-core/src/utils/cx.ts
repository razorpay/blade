import { cx } from 'class-variance-authority';
import { extendTailwindMerge } from 'tailwind-merge';
import { spacing, border } from '~tokens/global';

/**
 * `cx` is CVA's plain space-join — no conflict resolution. It stays the default for composing
 * non-conflicting class fragments (base + variant + compound), which is the common case and is
 * cheaper than a full merge.
 *
 * `cn` adds Tailwind-aware, last-wins conflict resolution via `tailwind-merge`, so an override
 * (styleOverride, styled-props, a consumer prop) reliably beats the base class for the SAME CSS
 * property: `cn('p-spacing-2', 'p-spacing-4')` → `'p-spacing-4'`. Use `cn` on any merge where a
 * later value must win over an earlier one.
 *
 * tailwind-merge is configured for Blade's namespaced custom scales. The scale KEYS are derived
 * from the same token sources the preset generator uses (`~tokens/global`), so the merge config and
 * the preset can never disagree about which utilities exist. Blade's semantic COLOR utilities
 * (`bg-…`, `text-…`, `border-…`) are handled by tailwind-merge's built-in color groups, which treat
 * the class segment after the prefix as an opaque color name — no extra config needed for them.
 */
const spacingScaleKeys = Object.keys(spacing).map((key) => `spacing-${key}`);
const borderRadiusKeys = Object.keys(border.radius);
const borderWidthKeys = Object.keys(border.width);

export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      // `spacing` feeds every padding / margin / gap / inset group in tailwind-merge, so registering
      // the namespaced keys here makes `p-spacing-*`, `m-spacing-*`, `gap-spacing-*`, `top-spacing-*`
      // etc. all dedupe correctly.
      spacing: spacingScaleKeys,
      borderRadius: borderRadiusKeys,
      borderWidth: borderWidthKeys,
    },
  },
});

/**
 * Conflict-resolving class merge: `twMerge(cx(...))`. Route base+override merges through this.
 */
export const cn = (...inputs: Parameters<typeof cx>): string => twMerge(cx(...inputs));

export { cx };
