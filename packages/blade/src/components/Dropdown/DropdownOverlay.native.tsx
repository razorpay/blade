import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { componentIds } from './dropdownUtils';
import type { DropdownOverlayProps } from './DropdownOverlay.web';
import { useDropdown } from './useDropdown';
import Box from '~components/Box';
import { makeSize, metaAttribute, MetaConstants } from '~utils';
import type { WithComponentId } from '~utils';

const StyledDropdownOverlay = styled(Box)((props) => ({
  transform: `translateY(${makeSize(props.theme.spacing[3])})`,
}));

const StyledClosableArea = styled(Pressable)<{ display: 'flex' | 'none' }>((props) => ({
  position: 'static',
  height: '100%',
  width: '100%',
  display: props.display,
}));

/**
 * Overlay for dropdown.
 *
 * Wrap your ActionList with this this component
 */
const DropdownOverlay: WithComponentId<DropdownOverlayProps> = ({ children }): JSX.Element => {
  const { isOpen, setIsOpen } = useDropdown();

  return (
    <Box position="relative">
      <StyledClosableArea
        display={isOpen ? 'flex' : 'none'}
        onPress={() => {
          setIsOpen(false);
        }}
      >
        <StyledDropdownOverlay
          display={isOpen ? 'flex' : 'none'}
          position="absolute"
          width="100%"
          {...metaAttribute(MetaConstants.Component, MetaConstants.DropdownOverlay)}
        >
          {children}
        </StyledDropdownOverlay>
      </StyledClosableArea>
    </Box>
  );
};

DropdownOverlay.componentId = componentIds.DropdownOverlay;

export { DropdownOverlay, DropdownOverlayProps };
