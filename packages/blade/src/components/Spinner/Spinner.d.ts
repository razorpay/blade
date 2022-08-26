import type { ColorContrastTypes, Feedback } from '~tokens/theme/theme';

export * from './Spinner.web';

export type SpinnerProps = {
  intent?: Feedback;
  contrast?: ColorContrastTypes;
  size?: 'small' | 'medium' | 'large';
  accessibilityLabel?: string;
};
