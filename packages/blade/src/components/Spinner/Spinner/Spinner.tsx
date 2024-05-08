import { BaseSpinner } from '../BaseSpinner';
import type { BaseSpinnerProps } from '../BaseSpinner';

type SpinnerProps = BaseSpinnerProps & {
  /**
   * Sets the color of the spinner.
   *
   * @default 'default'
   */
  color?: 'primary' | 'neutral' | 'white';
};

const Spinner = ({
  label,
  labelPosition,
  accessibilityLabel,
  color = 'neutral',
  size = 'medium',
  testID,
  ...styledProps
}: SpinnerProps): React.ReactElement => {
  return (
    <BaseSpinner
      label={label}
      labelPosition={labelPosition}
      accessibilityLabel={accessibilityLabel ?? label ?? 'Loading'}
      color={color}
      size={size}
      testID={testID}
      {...styledProps}
    />
  );
};

export type { SpinnerProps };
export { Spinner };
