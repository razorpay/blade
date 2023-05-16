/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import type { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { useBottomSheetContext } from './BottomSheetContext';
import BaseBox from '~components/Box/BaseBox';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { isReactNative, makeSize, makeSpace } from '~utils';
import size from '~tokens/global/size';
import { useTheme } from '~components/BladeProvider';

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
    const { theme } = useTheme();
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
        // bottomsheet empty header suppose to be 28px in height
        // the grab handle height is 20px & here we are adding 8px
        // total = 28px
        height={makeSize(size[8])}
        touchAction="none"
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
          top={makeSpace(-size[4])}
          right="spacing.5"
          width={makeSize(size[28])}
          height={makeSize(size[28])}
          flexShrink={0}
          backgroundColor={theme.colors.surface.background.level2.lowContrast}
          borderRadius="max"
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
