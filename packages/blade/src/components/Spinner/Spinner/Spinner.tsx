import { BaseSpinner } from '../BaseSpinner';
import type { BaseSpinnerProps } from '../BaseSpinner';

type SpinnerProps = Omit<BaseSpinnerProps, 'intent'> & {
  /**
   * Sets the color of the spinner.
   *
   * @default 'default'
   */
  color?: 'default' | 'white';
};

const Spinner = ({
  label,
  labelPosition,
  accessibilityLabel,
  color = 'default',
  // TODO: Remove contrast prop in favor of color in the next major release
  contrast = 'low',
  size = 'medium',
  testID,
  ...styledProps
}: SpinnerProps): React.ReactElement => {
  return (
    <BaseSpinner
      label={label}
      labelPosition={labelPosition}
      accessibilityLabel={accessibilityLabel ?? label ?? 'Loading'}
      contrast={contrast}
      color={color}
      size={size}
      testID={testID}
      {...styledProps}
    />
  );
};

export type { SpinnerProps };
export { Spinner };
