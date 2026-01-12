import { cva } from 'class-variance-authority';
import styles from './cardHeader.module.css';

export const cardHeaderStyles = cva(styles.header, {
  variants: {
    showDivider: {
      true: styles['with-divider'],
      false: '',
    },
    paddingBottom: {
      'spacing.0': styles['pb-0'],
      'spacing.3': styles['pb-3'],
      'spacing.4': styles['pb-4'],
      'spacing.5': styles['pb-5'],
      'spacing.7': styles['pb-7'],
    },
    marginBottom: {
      'spacing.0': styles['mb-0'],
      'spacing.3': styles['mb-3'],
      'spacing.4': styles['mb-4'],
      'spacing.5': styles['mb-5'],
      'spacing.7': styles['mb-7'],
    },
  },
  defaultVariants: {
    showDivider: true,
    paddingBottom: 'spacing.4',
    marginBottom: 'spacing.4',
  },
});
