import { BaseSpinner } from '../BaseSpinner';
import type { ColorContrastTypes } from '~tokens/theme/theme';

type SpinnerProps = {
  /**
   * Sets the contrast of the spinner.
   *
   * @default 'low'
   */
  contrast?: ColorContrastTypes;
  /**
   * Sets the size of the spinner.
   *
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Sets the aria-label for web & accessibilityLabel react-native.
   *
   * @default 'Loading'
   */
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
