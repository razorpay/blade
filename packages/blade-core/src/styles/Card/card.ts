import { cva } from 'class-variance-authority';
import styles from './card.module.css';

export const cardStyles = cva(styles.card, {
  variants: {
    isSelected: {
      true: styles.selected,
      false: '',
    },
    isFocused: {
      true: styles.focused,
      false: '',
    },
    shouldScaleOnHover: {
      true: styles['scale-hover'],
      false: '',
    },
    isPressed: {
      true: styles.pressed,
      false: '',
    },
    validationState: {
      none: '',
      error: styles['validation-error'],
      success: styles['validation-success'],
    },
    isInteractive: {
      true: styles.interactive,
      false: '',
    },
    as: {
      div: '',
      label: styles.label,
    },
  },
  defaultVariants: {
    isSelected: false,
    isFocused: false,
    shouldScaleOnHover: false,
    isPressed: false,
    validationState: 'none',
    isInteractive: false,
    as: 'div',
  },
});
