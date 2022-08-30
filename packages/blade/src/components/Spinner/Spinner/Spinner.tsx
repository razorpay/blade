import { BaseSpinner } from '../BaseSpinner';
import type { ColorContrastTypes } from '~tokens/theme/theme';

type SpinnerProps = {
  contrast?: ColorContrastTypes;
  size?: 'small' | 'medium' | 'large';
  accessibilityLabel?: string;
};

const Spinner = ({ accessibilityLabel, contrast, size }: SpinnerProps): React.ReactElement => {
  return <BaseSpinner accessibilityLabel={accessibilityLabel} contrast={contrast} size={size} />;
};

export { Spinner, SpinnerProps };
