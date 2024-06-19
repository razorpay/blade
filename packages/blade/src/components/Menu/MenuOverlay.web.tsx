import React from 'react';
import styled from 'styled-components';
import type { MenuOverlayProps } from './types';
import { MENU_MIN_WIDTH, overlayPaddingX, overlayPaddingY } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { componentZIndices } from '~utils/componentZIndices';
import type { BladeElementRef } from '~utils/types';

const UnfocussableOverlay = styled(BaseBox)((_props) => {
  return {
    '&:focus-visible': {
      outline: 'none',
    },
  };
});

const _MenuOverlay: React.ForwardRefRenderFunction<BladeElementRef, MenuOverlayProps> = (
  { children, zIndex = componentZIndices.dropdownOverlay, _transitionStyle, ...props },
  ref,
): React.ReactElement => {
  return (
    <UnfocussableOverlay
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      {...props}
      minWidth={MENU_MIN_WIDTH}
      zIndex={zIndex}
    >
      {/* 
        Requires another nested div since floatingStyles clash with floatingTransitionStyles 

        https://floating-ui.com/docs/usetransition#usetransitionstyles
      */}
      <BaseBox
        backgroundColor="popup.background.subtle"
        paddingX={overlayPaddingX}
        paddingY={overlayPaddingY}
        elevation="midRaised"
        borderWidth="thin"
        borderColor="surface.border.gray.muted"
        borderRadius="medium"
        style={_transitionStyle}
      >
        {children}
      </BaseBox>
    </UnfocussableOverlay>
  );
};

const MenuOverlay = React.forwardRef(_MenuOverlay);

export { MenuOverlay };
