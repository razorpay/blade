import { BaseSpinner } from '../BaseSpinner';
import type { ColorContrastTypes } from '~tokens/theme/theme';

type SpinnerProps = {
  /**
   * Sets the label of the spinner.
   *
   * @default 'right'
   */
  label?: string;
  /**
   * Sets the label of the spinner.
   *
   */
  labelPosition?: 'right' | 'bottom';
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
   * Sets the aria-label for web & accessibilityLabel for react-native. Uses `label` as its value if it exists otherwise falls back to "Loading"
   *
   * @default 'Loading'
   */
  accessibilityLabel?: string;
};

const Spinner = ({
  label,
  labelPosition,
  accessibilityLabel,
  contrast = 'low',
  size = 'medium',
}: SpinnerProps): React.ReactElement => {
  return (
    <BaseSpinner
      label={label}
      labelPosition={labelPosition}
      accessibilityLabel={accessibilityLabel ?? label ?? 'Loading'}
      contrast={contrast}
      size={size}
    />
  );
};

export { Spinner, SpinnerProps };
