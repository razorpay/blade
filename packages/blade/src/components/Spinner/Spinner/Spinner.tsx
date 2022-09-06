import { BaseSpinner } from '../BaseSpinner';
import type { ColorContrastTypes } from '~tokens/theme/theme';
import type { AccessibilityProps } from '~utils';

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
  /**
   * Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
   *
   *  @default 'assertive'
   */
  accessibilityLiveRegion?: AccessibilityProps['liveRegion'];
};

const Spinner = ({
  accessibilityLabel = 'Loading',
  accessibilityLiveRegion = 'assertive',
  contrast = 'low',
  size = 'medium',
}: SpinnerProps): React.ReactElement => {
  return (
    <BaseSpinner
      accessibilityLabel={accessibilityLabel}
      accessibilityLiveRegion={accessibilityLiveRegion}
      contrast={contrast}
      size={size}
    />
  );
};

export { Spinner, SpinnerProps };
