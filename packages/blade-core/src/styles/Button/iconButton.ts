/**
 * IconButton Class Generators
 * Functions to generate CSS classes for the IconButton component.
 */

// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './iconButton.module.css';

export type IconButtonSize = 'small' | 'medium' | 'large';
export type IconButtonEmphasis = 'subtle' | 'intense';

export type IconButtonOptions = {
  size: IconButtonSize;
  emphasis?: IconButtonEmphasis;
  isDisabled?: boolean;
  isHighlighted?: boolean;
};

/**
 * Get the CSS classes for an IconButton given its size, emphasis + state.
 */
export function getIconButtonClasses(options: IconButtonOptions): string {
  const { size, emphasis = 'intense', isDisabled, isHighlighted } = options;

  const classes = [
    styles.iconButton,
    styles[`iconButton--${size}`],
    styles[`iconButton--${emphasis}`],
  ];

  if (isHighlighted) {
    classes.push(styles['iconButton--highlighted']);
  }

  if (isDisabled) {
    classes.push(styles['iconButton--disabled']);
  }

  return classes.filter(Boolean).join(' ');
}
