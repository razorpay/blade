import { cva } from 'class-variance-authority';

export type SwitchSize = 'small' | 'medium';

export type SwitchVariants = {
  size?: SwitchSize;
  isChecked?: boolean;
};

/**
 * CVA-based track styles. Combines `size` (drives width/height across breakpoints)
 * with `isChecked` (drives background color across default and disabled states).
 *
 * The `[disabled]` attribute selector handled in the CSS module covers the
 * disabled-checked / disabled-unchecked combinations, so they don't need
 * compound variants here.
 */
export const switchTrackStyles = cva('blade-switch-track', {
  variants: {
    size: {
      small: 'blade-switch-size-small',
      medium: 'blade-switch-size-medium',
    },
    isChecked: {
      true: 'blade-switch-checked',
      false: 'blade-switch-unchecked',
    },
  },
  defaultVariants: {
    size: 'medium',
    isChecked: false,
  },
});

/**
 * Generate the combined class string for the Switch track element.
 */
export function getSwitchClasses(props: SwitchVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;
  return [switchTrackStyles(cvaProps), className].filter(Boolean).join(' ');
}

/**
 * Get all Switch component template classes as an object. Calling this from a
 * Svelte component prevents tree-shaking from dropping classes that are only
 * referenced inside templates (for example, `thumb`, `animated-thumb`).
 *
 * @example
 * const switchClasses = getSwitchTemplateClasses();
 * // switchClasses.thumb, switchClasses.animatedThumb, switchClasses.thumbIcon
 */
export function getSwitchTemplateClasses(): {
  switch: string;
  label: string;
  input: string;
  track: string;
  thumb: string;
  animatedThumb: string;
  thumbIcon: string;
  sizeSmall: string;
  sizeMedium: string;
  checked: string;
  unchecked: string;
  pressed: string;
  effectiveChecked: string;
} {
  return {
    switch: 'blade-switch',
    label: 'blade-switch-label',
    input: 'blade-switch-input',
    track: 'blade-switch-track',
    thumb: 'blade-switch-thumb',
    animatedThumb: 'blade-switch-animated-thumb',
    thumbIcon: 'blade-switch-thumb-icon',
    sizeSmall: 'blade-switch-size-small',
    sizeMedium: 'blade-switch-size-medium',
    checked: 'blade-switch-checked',
    unchecked: 'blade-switch-unchecked',
    pressed: 'blade-switch-pressed',
    effectiveChecked: 'blade-switch-effective-checked',
  };
}
