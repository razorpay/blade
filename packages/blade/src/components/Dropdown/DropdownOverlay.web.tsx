import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { componentIds } from './dropdownUtils';
import { useDropdown } from './useDropdown';
import Box from '~components/Box';
import { makeMotionTime, makeSize } from '~utils';
import type { WithComponentId } from '~utils';
import { useTheme } from '~components/BladeProvider';
// Reading directly because its not possible to get theme object on top level to be used in keyframes
import spacing from '~tokens/global/spacing';

const dropdownFadeIn = keyframes`
from {
  transform: translateY(${makeSize(spacing[0])});
  opacity: 0;
}

to {
  transform: translateY(${makeSize(spacing[3])});
  opacity: 1;
}
`;

const dropdownFadeOut = keyframes`
from {
  transform: translateY(${makeSize(spacing[3])});
  opacity: 1;
}

to {
  transform: translateY(${makeSize(spacing[0])});
  opacity: 0;
}
`;

const StyledDropdownOverlay = styled(Box)<{
  transition: FlattenSimpleInterpolation;
  onAnimationEnd: () => void;
}>(
  (props) =>
    css`
      ${props.transition}
      transform: translateY(${makeSize(props.theme.spacing[3])});
      opacity: 0;
    `,
);

type DropdownOverlayProps = { children: React.ReactNode };

/**
 * Overlay for dropdown.
 *
 * Wrap your ActionList with this this component
 */
const DropdownOverlay: WithComponentId<DropdownOverlayProps> = ({ children }): JSX.Element => {
  const { isOpen } = useDropdown();
  const { theme } = useTheme();
  const [display, setDisplay] = React.useState<'none' | 'block'>('none');

  const fadeIn = css`
    animation: ${dropdownFadeIn} ${makeMotionTime(theme.motion.duration.quick)}
      ${String(theme.motion.easing.entrance.revealing)};
  `;

  const fadeOut = css`
    animation: ${dropdownFadeOut} ${makeMotionTime(theme.motion.duration.quick)}
      ${String(theme.motion.easing.entrance.revealing)};
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
          } else {
            setDisplay('none');
          }
        }}
        width="100%"
      >
        {children}
      </StyledDropdownOverlay>
    </Box>
  );
};

DropdownOverlay.componentId = componentIds.DropdownOverlay;

export { DropdownOverlay, DropdownOverlayProps };
