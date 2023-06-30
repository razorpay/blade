import type { SkeletonProps } from './Skeleton';
import type { Typography } from '~tokens/global';

const lineHeights: Record<NonNullable<SkeletonProps['type']>, keyof Typography['lineHeights']> = {
  'body-small': 50,
  'body-medium': 100,
  'body-large': 300,
  'heading-small': 300,
  'heading-medium': 200,
  'heading-large': 400,
  'title-small': 500,
  'title-medium': 600,
  'title-large': 700,
  'title-xlarge': 800,
} as const;

export { lineHeights };
