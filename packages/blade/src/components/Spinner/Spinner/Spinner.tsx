import React from 'react';
import { BaseSpinner } from '../BaseSpinner';
import type { BaseSpinnerProps } from '../BaseSpinner';
import type { BladeElementRef } from '~utils/types';

type SpinnerProps = BaseSpinnerProps & {
  /**
   * Sets the color of the spinner.
   *
   * @default 'default'
   */
  color?: 'primary' | 'neutral' | 'white';
};

const _Spinner = (
  {
    label,
    labelPosition,
    accessibilityLabel,
    color = 'neutral',
    size = 'medium',
    testID,
    ...styledProps
  }: SpinnerProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  return (
    <BaseSpinner
      ref={ref as never}
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

const Spinner = React.forwardRef(_Spinner);

export type { SpinnerProps };
export { Spinner };
