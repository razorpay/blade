import { cva } from 'class-variance-authority';
import styles from './cardSurface.module.css';

export const cardSurfaceStyles = cva(styles.surface, {
  variants: {
    backgroundColor: {
      'surface.background.gray.intense': styles['bg-gray-intense'],
      'surface.background.gray.moderate': styles['bg-gray-moderate'],
      'surface.background.gray.subtle': styles['bg-gray-subtle'],
    },
    borderRadius: {
      medium: styles['radius-medium'],
      large: styles['radius-large'],
      xlarge: styles['radius-xlarge'],
    },
    elevation: {
      none: styles['elevation-none'],
      lowRaised: styles['elevation-low-raised'],
      midRaised: styles['elevation-mid-raised'],
      highRaised: styles['elevation-high-raised'],
    },
    padding: {
      'spacing.0': styles['padding-0'],
      'spacing.3': styles['padding-3'],
      'spacing.4': styles['padding-4'],
      'spacing.5': styles['padding-5'],
      'spacing.7': styles['padding-7'],
    },
  },
  defaultVariants: {
    backgroundColor: 'surface.background.gray.intense',
    borderRadius: 'medium',
    elevation: 'lowRaised',
    padding: 'spacing.7',
  },
});
