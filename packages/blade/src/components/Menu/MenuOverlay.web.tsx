import React from 'react';
import styled from 'styled-components';
import type { MenuOverlayProps } from './types';
import { MENU_MIN_WIDTH, overlayPaddingX, overlayPaddingTop, overlayPaddingBottom } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { componentZIndices } from '~utils/componentZIndices';
import type { BladeElementRef } from '~utils/types';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getPopupBoxShadowString, isReactNative, useTheme } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';

const UnfocussableOverlay = styled(BaseBox)((_props) => {
  return {
    '&:focus-visible': {
      outline: 'none',
    },
  };
});

const StyledMenuOverlayContent = styled(BaseBox)<{ colorScheme: ColorSchemeNames }>(
  ({ theme, colorScheme }) => {
    return {
      backdropFilter: `blur(${theme.backdropBlur.medium}px)`,
      boxShadow: isReactNative() ? undefined : getPopupBoxShadowString(theme, colorScheme),
    };
  },
);

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
  const { colorScheme } = useTheme();

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
        colorScheme={colorScheme}
        backgroundColor="popup.background.gray.moderate"
        paddingX={overlayPaddingX}
        paddingTop={overlayPaddingTop}
        paddingBottom={overlayPaddingBottom}
        borderWidth="none"
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
