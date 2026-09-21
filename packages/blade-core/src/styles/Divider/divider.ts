import { cva } from 'class-variance-authority';
import { cn } from '~utils/cx';
import type { DividerVariants } from './types';

export type { DividerVariants };

/**
 * CVA-based divider styles (Tailwind).
 *
 * Every visible border property (width / style / color) is orientation-dependent — horizontal
 * draws a bottom border, vertical draws a left border. In CSS Modules these were chained selectors
 * (`.horizontal.thin`, `.vertical.normal`); with no stylesheet to hold them each pairing becomes a
 * `compoundVariants` entry. `thickness` and `variant` are therefore declared as empty `variants`
 * (they do nothing on their own) and the real `border-{b,l}-*` utility is emitted per orientation.
 */
export const dividerStyles = cva('border-0', {
  variants: {
    orientation: {
      horizontal: 'grow',
      vertical: 'self-stretch',
    },
    dividerStyle: {
      // Tailwind border-style is not per-side; only the sided width below makes it visible.
      solid: 'border-solid',
      dashed: 'border-dashed',
    },
    variant: {
      normal: '',
      subtle: '',
      muted: '',
    },
    thickness: {
      thinner: '',
      thin: '',
      thick: '',
      thicker: '',
    },
  },
  compoundVariants: [
    // Thickness → sided border-width (was `.horizontal.thin` / `.vertical.thin` etc.).
    { orientation: 'horizontal', thickness: 'thinner', class: 'border-b-thinner' },
    { orientation: 'horizontal', thickness: 'thin', class: 'border-b-thin' },
    { orientation: 'horizontal', thickness: 'thick', class: 'border-b-thick' },
    { orientation: 'horizontal', thickness: 'thicker', class: 'border-b-thicker' },
    { orientation: 'vertical', thickness: 'thinner', class: 'border-l-thinner' },
    { orientation: 'vertical', thickness: 'thin', class: 'border-l-thin' },
    { orientation: 'vertical', thickness: 'thick', class: 'border-l-thick' },
    { orientation: 'vertical', thickness: 'thicker', class: 'border-l-thicker' },
    // Variant → sided border-color (was `.horizontal.normal` / `.vertical.muted` etc.).
    { orientation: 'horizontal', variant: 'normal', class: 'border-b-surface-border-gray-normal' },
    { orientation: 'horizontal', variant: 'subtle', class: 'border-b-surface-border-gray-subtle' },
    { orientation: 'horizontal', variant: 'muted', class: 'border-b-surface-border-gray-muted' },
    { orientation: 'vertical', variant: 'normal', class: 'border-l-surface-border-gray-normal' },
    { orientation: 'vertical', variant: 'subtle', class: 'border-l-surface-border-gray-subtle' },
    { orientation: 'vertical', variant: 'muted', class: 'border-l-surface-border-gray-muted' },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    dividerStyle: 'solid',
    variant: 'muted',
    thickness: 'thin',
  },
});

/**
 * Generate all classes for Divider component.
 * Routed through `cn` so a `className` override wins deterministically over the base
 * (Tailwind utility conflict resolution).
 */
export function getDividerClasses(props: DividerVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;
  return cn(dividerStyles(cvaProps), className);
}
