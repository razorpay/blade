/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { isReactNative, makeSize } from '~utils';
import size from '~tokens/global/size';

type BottomSheetEmptyHeaderProps = Pick<
  ReactDOMAttributes,
  | 'onClickCapture'
  | 'onKeyDown'
  | 'onKeyUp'
  | 'onLostPointerCapture'
  | 'onPointerCancel'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
>;

const BottomSheetEmptyHeader = React.forwardRef<BladeElementRef, BottomSheetEmptyHeaderProps>(
  (
    {
      onClickCapture,
      onKeyDown,
      onKeyUp,
      onLostPointerCapture,
      onPointerCancel,
      onPointerDown,
      onPointerMove,
      onPointerUp,
    },
    ref,
  ) => {
    const { close } = useBottomSheetContext();
    const webOnlyEventHandlers = isReactNative()
      ? {}
      : {
          onClickCapture,
          onKeyDown,
          onKeyUp,
          onLostPointerCapture,
          onPointerCancel,
          onPointerDown,
          onPointerMove,
          onPointerUp,
        };

    return (
      <BaseBox
        position="relative"
        // bottomsheet empty header suppose to be 40px in height
        // the grab handle height is 16px & here we are adding 24px
        // total = 40px
        height={makeSize(size[24])}
        touchAction="none"
        {...webOnlyEventHandlers}
      >
        <BaseBox
          position="absolute"
          top={isReactNative() ? 'spacing.0' : 'spacing.5'}
          right="spacing.5"
        >
          <IconButton
            ref={ref}
            size="large"
            icon={CloseIcon}
            accessibilityLabel="Close"
            onClick={close}
          />
        </BaseBox>
      </BaseBox>
    );
  },
);

export { BottomSheetEmptyHeader };
