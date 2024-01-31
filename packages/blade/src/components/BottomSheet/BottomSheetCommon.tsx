/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import type { BladeElementRef } from '~utils/types';
import { isReactNative } from '~utils';
import { size } from '~tokens/global';
import { makeSpace } from '~utils/makeSpace';
import { makeSize } from '~utils/makeSize';

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
    const { close, isHeaderFloating } = useBottomSheetContext();
    const webOnlyEventHandlers: Record<string, any> = isReactNative()
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

    let topOffset: 'spacing.5' | 'spacing.0' | undefined = isHeaderFloating
      ? 'spacing.5'
      : undefined;
    if (isReactNative()) {
      topOffset = 'spacing.0';
    }

    return (
      <BaseBox
        position={isHeaderFloating ? 'absolute' : 'relative'}
        // bottomsheet empty header suppose to be 28px in height
        // the grab handle height is 20px & here we are adding 8px
        // total = 28px
        height={makeSize(size[8])}
        touchAction="none"
        top={topOffset}
        right="spacing.0"
        {...webOnlyEventHandlers}
      >
        <BaseBox
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          // the bottomsheet handle has a height of 16px + 4px padding
          // we need to make put the close button at 16px from top so adjusting the 4px
          // cannot use position=fixed because RN won't support it
          top={isHeaderFloating ? 'spacing.0' : makeSpace(-size[4])}
          right="spacing.5"
          width={makeSize(size[28])}
          height={makeSize(size[28])}
          flexShrink={0}
          backgroundColor="popup.background.subtle"
          borderRadius="max"
          zIndex={100}
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
