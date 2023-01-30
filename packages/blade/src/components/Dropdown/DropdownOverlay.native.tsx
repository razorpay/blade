import React from 'react';
import styled from 'styled-components/native';
import { componentIds } from './dropdownUtils';
import type { DropdownOverlayProps } from './DropdownOverlay.web';
import { useDropdown } from './useDropdown';
import Box from '~components/Box';
import { makeSize } from '~utils';
import type { WithComponentId } from '~utils';

const StyledDropdownOverlay = styled(Box)((props) => ({
  transform: `translateY(${makeSize(props.theme.spacing[3])})`,
}));

/**
 * Overlay for dropdown.
 *
 * Wrap your ActionList with this this component
 */
const DropdownOverlay: WithComponentId<DropdownOverlayProps> = ({ children }): JSX.Element => {
  const { isOpen } = useDropdown();

  return (
    <Box position="relative">
      <StyledDropdownOverlay display={isOpen ? 'flex' : 'none'} position="absolute" width="100%">
        {children}
      </StyledDropdownOverlay>
    </Box>
  );
};

DropdownOverlay.componentId = componentIds.DropdownOverlay;

export { DropdownOverlay, DropdownOverlayProps };
