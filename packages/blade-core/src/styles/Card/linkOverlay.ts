import { cva } from 'class-variance-authority';
import styles from './linkOverlay.module.css';

export const linkOverlayStyles = cva(styles['link-overlay'], {
  variants: {
    as: {
      a: styles['link-overlay'],
      button: styles['link-overlay-button'],
    },
  },
  defaultVariants: {
    as: 'a',
  },
});
