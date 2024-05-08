/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import type { SelectorInputProps } from './types';
import type { BladeElementRef } from '~utils/types';

// noop in react-native
const _SelectorInput: React.ForwardRefRenderFunction<BladeElementRef, SelectorInputProps> = (
  _props,
  _ref,
): React.ReactElement => {
  return <></>;
};

const SelectorInput = React.forwardRef(_SelectorInput);

export { SelectorInput };
