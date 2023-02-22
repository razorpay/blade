import { BaseSpinner } from '../BaseSpinner';
import type { BaseSpinnerProps } from '../BaseSpinner';

type SpinnerProps = Omit<BaseSpinnerProps, 'intent'>;

const Spinner = ({
  label,
  labelPosition,
  accessibilityLabel,
  contrast = 'low',
  size = 'medium',
  ...styledProps
}: SpinnerProps): React.ReactElement => {
  return (
    <BaseSpinner
      {...styledProps}
      label={label}
      labelPosition={labelPosition}
      accessibilityLabel={accessibilityLabel ?? label ?? 'Loading'}
      contrast={contrast}
      size={size}
    />
  );
};

export { Spinner, SpinnerProps };
