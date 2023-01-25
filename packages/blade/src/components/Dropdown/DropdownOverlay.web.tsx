import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { componentIds } from './dropdownUtils';
import { useDropdown } from './useDropdown';
import Box from '~components/Box';
import { makeMotionTime } from '~utils';
import { useTheme } from '~components/BladeProvider';

const dropdownFadeIn = keyframes`
from {
  transform: translateY(0px);
  opacity: 0;
}

to {
  transform: translateY(8px);
  opacity: 1;
}
`;

const dropdownFadeOut = keyframes`
from {
  transform: translateY(8px);
  opacity: 1;
}

to {
  transform: translateY(0px);
  opacity: 0;
}
`;

const StyledDropdownOverlay = styled(Box)<{
  transition: FlattenSimpleInterpolation;
}>(
  (props) =>
    css`
      ${props.transition}
      transform: translateY(8px);
      opacity: 0;
    `,
);

/**
 * Overlay for dropdown.
 *
 * Wrap your ActionList with this this component
 */
function DropdownOverlay({ children }: { children: React.ReactNode }): JSX.Element {
  const { isOpen } = useDropdown();
  const { theme } = useTheme();
  const [display, setDisplay] = React.useState<'none' | 'block'>('none');

  const fadeIn = css`
    animation: ${dropdownFadeIn} ${makeMotionTime(theme.motion.duration.quick)}
      ${theme.motion.easing.entrance.revealing as string};
  `;

  const fadeOut = css`
    animation: ${dropdownFadeOut} ${makeMotionTime(theme.motion.duration.quick)}
      ${theme.motion.easing.entrance.revealing as string};
  `;

  React.useEffect(() => {
    if (isOpen) {
      setDisplay('block');
    }
  }, [isOpen]);

  return (
    <Box position="relative">
      <StyledDropdownOverlay
        style={{ opacity: isOpen ? 1 : 0 }}
        display={display}
        position="absolute"
        transition={isOpen ? fadeIn : fadeOut}
        onAnimationEnd={() => {
          if (isOpen) {
            setDisplay('block');
          }

          if (!isOpen) {
            setDisplay('none');
          }
        }}
        width="100%"
      >
        {children}
      </StyledDropdownOverlay>
    </Box>
  );
}

DropdownOverlay.componentId = componentIds.DropdownOverlay;

export { DropdownOverlay };
