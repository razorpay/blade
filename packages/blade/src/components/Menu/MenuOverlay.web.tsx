import React from 'react';
import styled from 'styled-components';
import type { MenuOverlayProps } from './types';
import { MENU_MIN_WIDTH, overlayPaddingX, overlayPaddingY } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { componentZIndices } from '~utils/componentZIndices';
import type { BladeElementRef } from '~utils/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const UnfocussableOverlay = styled(BaseBox)((_props) => {
  return {
    '&:focus-visible': {
      outline: 'none',
    },
  };
});

const _MenuOverlay: React.ForwardRefRenderFunction<BladeElementRef, MenuOverlayProps> = (
  {
    children,
    zIndex = componentZIndices.dropdownOverlay,
    _transitionStyle,
    minWidth,
    maxWidth,
    width,
    testID,
    ...props
  },
  ref,
): React.ReactElement => {
  return (
    <UnfocussableOverlay
      ref={ref as never}
      {...props}
      zIndex={zIndex}
      {...metaAttribute({ name: MetaConstants.Menu, testID })}
      minWidth={minWidth ?? MENU_MIN_WIDTH}
      width={width}
      maxWidth={maxWidth}
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
