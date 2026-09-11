import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/**
 * Box deliberately omits `StyledPropsBlade` (margin, display, position, grid,
 * flex props, etc.) that every other blade-svelte component extends.
 *
 * This is a **permanent, intentional divergence**: Box is designed as a minimal
 * layout primitive for consumers who style with utility CSS (e.g. Tailwind)
 * rather than Blade's CSS-in-JS style props. Adding `StyledPropsBlade` would
 * introduce Blade token dependencies that defeat the utility-CSS use case.
 *
 * Consumers needing Blade style props should use `Card`, `BaseText`, or other
 * full-featured Blade components instead.
 */
export type BoxAs =
  | 'div'
  | 'section'
  | 'footer'
  | 'header'
  | 'main'
  | 'aside'
  | 'nav'
  | 'span'
  | 'label';

export type BoxProps = Omit<
  HTMLAttributes<HTMLElement>,
  'class' | 'children' | 'this'
> & {
  /**
   * Element/tag Box renders as.
   *
   * @default 'div'
   */
  as?: BoxAs;
  /**
   * Additional class names, forwarded as-is to the underlying DOM element.
   * Box has no style props of its own — use this to apply utility-class
   * styling (e.g. Tailwind), including responsive variants.
   */
  className?: string;
  /**
   * Inline styles, forwarded as-is to the underlying DOM element.
   * Useful for CSS custom properties (e.g. `--cols: 3`) that cannot be
   * set via `className`.
   */
  style?: string | Record<string, string | number>;
  /**
   * Test ID for testing
   */
  testID?: string;
  children?: Snippet | string;
};
