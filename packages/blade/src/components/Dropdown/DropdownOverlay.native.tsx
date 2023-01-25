import React from 'react';
import styled from 'styled-components/native';
import { componentIds } from './dropdownUtils';
import { useDropdown } from './useDropdown';
import Box from '~components/Box';
import { makeSize } from '~utils';

const StyledDropdownOverlay = styled(Box)((props) => ({
  transform: `translateY(${makeSize(props.theme.spacing[3])})`,
}));

/**
 * Overlay for dropdown.
 *
 * Wrap your ActionList with this this component
 */
function DropdownOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  const { isOpen } = useDropdown();

  return (
    <Box position="relative">
      <StyledDropdownOverlay display={isOpen ? 'flex' : 'none'} position="absolute" width="100%">
        {children}
      </StyledDropdownOverlay>
    </Box>
  );
}

DropdownOverlay.componentId = componentIds.DropdownOverlay;

export { DropdownOverlay };
