import { BaseSpinner } from '../BaseSpinner';
import type { BaseSpinnerProps } from '../BaseSpinner';

type SpinnerProps = Omit<BaseSpinnerProps, 'intent'>;

const Spinner = ({
  label,
  labelPosition,
  accessibilityLabel,
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
      size={size}
      testID={testID}
      {...styledProps}
    />
  );
};

export { Spinner, SpinnerProps };
