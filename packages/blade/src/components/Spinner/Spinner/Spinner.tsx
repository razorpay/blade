import { BaseSpinner } from '../BaseSpinner';
import type { ColorContrastTypes } from '~tokens/theme/theme';

type SpinnerProps = {
  contrast?: ColorContrastTypes;
  size?: 'small' | 'medium' | 'large';
  accessibilityLabel?: string;
};

const Spinner = ({
  accessibilityLabel = 'Loading',
  contrast = 'low',
  size = 'medium',
}: SpinnerProps): React.ReactElement => {
  return <BaseSpinner accessibilityLabel={accessibilityLabel} contrast={contrast} size={size} />;
};

export { Spinner, SpinnerProps };
