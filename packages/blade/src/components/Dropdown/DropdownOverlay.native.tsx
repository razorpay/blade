import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { componentIds } from './dropdownUtils';
import type { DropdownOverlayProps } from './DropdownOverlay.web';
import { useDropdown } from './useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils/makeSize';

const StyledDropdownOverlay = styled(BaseBox)<{ testID: 'dropdown-overlay' }>((props) => ({
  transform: `translateY(${makeSize(props.theme.spacing[3])})`,
}));

const StyledCloseableArea = styled(Pressable)<{ display: 'flex' | 'none' }>((props) => ({
  position: 'static',
  height: '100%',
  width: '100%',
  display: props.display,
}));

/**
 * Overlay of dropdown
 *
 * Wrap your ActionList within this component
 */
const _DropdownOverlay = ({ children, testID }: DropdownOverlayProps): JSX.Element => {
  const { isOpen, close } = useDropdown();

  return (
    <BaseBox position="relative">
      <StyledCloseableArea
        display={isOpen ? 'flex' : 'none'}
        onPress={() => {
          close();
        }}
        testID="closeable-area"
      >
        <StyledDropdownOverlay
          display={isOpen ? 'flex' : 'none'}
          position="absolute"
          width="100%"
          testID="dropdown-overlay"
          {...metaAttribute({ name: MetaConstants.DropdownOverlay, testID })}
        >
          {children}
        </StyledDropdownOverlay>
      </StyledCloseableArea>
    </BaseBox>
  );
};

const DropdownOverlay = assignWithoutSideEffects(_DropdownOverlay, {
  componentId: componentIds.DropdownOverlay,
});

export { DropdownOverlay, DropdownOverlayProps };
