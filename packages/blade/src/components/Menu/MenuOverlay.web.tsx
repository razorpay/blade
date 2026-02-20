import React from 'react';
import styled from 'styled-components';
import type { MenuOverlayProps } from './types';
import { MENU_MIN_WIDTH, overlayPaddingX, overlayPaddingY } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { componentZIndices } from '~utils/componentZIndices';
import type { BladeElementRef } from '~utils/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { castWebType } from '~utils';

const UnfocussableOverlay = styled(BaseBox)((_props) => {
  return {
    '&:focus-visible': {
      outline: 'none',
    },
  };
});

const StyledMenuOverlayContent = styled(BaseBox)(({ theme }) => {
  const dropshadow = castWebType(theme.elevation.midRaised);
  const innerShadow = `inset 0px -1.5px 0px 1px ${theme.colors.surface.background.gray.intense}`;

  return {
    backdropFilter: `blur(${theme.backdropBlur.medium}px)`,
    boxShadow: `${dropshadow}, ${innerShadow}`,
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
      <StyledMenuOverlayContent
        backgroundColor="popup.background.gray.moderate"
        paddingX={overlayPaddingX}
        paddingY={overlayPaddingY}
        borderWidth="none"
        borderTopWidth="thin"
        borderColor="popup.border.gray.moderate"
        borderRadius="medium"
        style={_transitionStyle}
      >
        {children}
      </StyledMenuOverlayContent>
    </UnfocussableOverlay>
  );
};

const MenuOverlay = React.forwardRef(_MenuOverlay);

export { MenuOverlay };
