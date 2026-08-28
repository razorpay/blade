import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

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

export type BoxProps = Omit<HTMLAttributes<HTMLElement>, 'class' | 'children'> & {
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
   * Test ID for testing
   */
  testID?: string;
  children?: Snippet | string;
};
