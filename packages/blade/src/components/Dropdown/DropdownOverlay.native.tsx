import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { componentIds } from './dropdownUtils';
import type { DropdownOverlayProps } from './DropdownOverlay.web';
import { useDropdown } from './useDropdown';
import Box from '~components/Box';
import { makeSize, metaAttribute, MetaConstants } from '~utils';
import type { WithComponentId } from '~utils';

const StyledDropdownOverlay = styled(Box)<{ testID: 'dropdown-overlay' }>((props) => ({
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
const DropdownOverlay: WithComponentId<DropdownOverlayProps> = ({ children }): JSX.Element => {
  const { isOpen, setIsOpen } = useDropdown();

  return (
    <Box position="relative">
      <StyledCloseableArea
        display={isOpen ? 'flex' : 'none'}
        onPress={() => {
          setIsOpen(false);
        }}
        testID="closeable-area"
      >
        <StyledDropdownOverlay
          display={isOpen ? 'flex' : 'none'}
          position="absolute"
          width="100%"
          testID="dropdown-overlay"
          {...metaAttribute(MetaConstants.Component, MetaConstants.DropdownOverlay)}
        >
          {children}
        </StyledDropdownOverlay>
      </StyledCloseableArea>
    </Box>
  );
};

DropdownOverlay.componentId = componentIds.DropdownOverlay;

export { DropdownOverlay, DropdownOverlayProps };
