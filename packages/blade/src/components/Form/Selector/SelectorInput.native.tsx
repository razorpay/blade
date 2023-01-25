/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';

type HoverProps = {
  isChecked?: boolean;
  isDisabled?: boolean;
  hasError?: boolean;
};

// noop in react-native
const _SelectorInput: React.ForwardRefRenderFunction<
  BladeElementRef,
  HoverProps & { inputProps: any }
> = (_props, _ref): React.ReactElement => {
  return <></>;
};

const SelectorInput = React.forwardRef(_SelectorInput);

export { SelectorInput };
