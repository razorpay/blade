import { cva } from 'class-variance-authority';
import styles from './cardFooter.module.css';

export const cardFooterStyles = cva(styles.footer, {
  variants: {
    showDivider: {
      true: styles['with-divider'],
      false: '',
    },
    paddingTop: {
      'spacing.0': styles['pt-0'],
      'spacing.3': styles['pt-3'],
      'spacing.4': styles['pt-4'],
      'spacing.5': styles['pt-5'],
      'spacing.7': styles['pt-7'],
    },
    marginTop: {
      'spacing.0': styles['mt-0'],
      'spacing.3': styles['mt-3'],
      'spacing.4': styles['mt-4'],
      'spacing.5': styles['mt-5'],
      'spacing.7': styles['mt-7'],
    },
    layout: {
      mobile: styles['layout-mobile'],
      desktop: styles['layout-desktop'],
    },
  },
  defaultVariants: {
    showDivider: true,
    paddingTop: 'spacing.4',
    marginTop: 'spacing.4',
    layout: 'desktop',
  },
});
