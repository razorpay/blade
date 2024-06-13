import React from 'react';
import styled from 'styled-components';
import type { MenuOverlayProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize } from '~utils';
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
  { children, zIndex = componentZIndices.dropdownOverlay, ...props },
  ref,
): React.ReactElement => {
  return (
    <UnfocussableOverlay
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      {...props}
      backgroundColor="popup.background.subtle"
      paddingX="spacing.3"
      paddingY="spacing.4"
      minWidth={makeSize(size['240'])}
      elevation="midRaised"
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
      zIndex={zIndex}
    >
      {children}
    </UnfocussableOverlay>
  );
};

const MenuOverlay = React.forwardRef(_MenuOverlay);

export { MenuOverlay };
