import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './switch.module.css';

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
export const switchTrackStyles = cva(styles.track, {
  variants: {
    size: {
      small: styles['size-small'],
      medium: styles['size-medium'],
    },
    isChecked: {
      true: styles.checked,
      false: styles.unchecked,
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
    switch: styles.switch,
    label: styles.label,
    input: styles.input,
    track: styles.track,
    thumb: styles.thumb,
    animatedThumb: styles['animated-thumb'],
    thumbIcon: styles['thumb-icon'],
    sizeSmall: styles['size-small'],
    sizeMedium: styles['size-medium'],
    checked: styles.checked,
    unchecked: styles.unchecked,
    pressed: styles.pressed,
    effectiveChecked: styles['effective-checked'],
  };
}
