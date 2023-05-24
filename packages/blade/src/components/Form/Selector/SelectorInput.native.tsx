/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { BladeElementRef } from '~utils/useBladeInnerRef';

type HoverProps = {
  isChecked?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
};

// noop in react-native
const _SelectorInput: React.ForwardRefRenderFunction<
  BladeElementRef,
  HoverProps & { inputProps: any; tabIndex?: number }
> = (_props, _ref): React.ReactElement => {
  return <></>;
};

const SelectorInput = React.forwardRef(_SelectorInput);

export { SelectorInput };
