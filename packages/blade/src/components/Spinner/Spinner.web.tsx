import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { SpinnerProps } from './Spinner.d';
import { dimensions } from './spinnerTokens';
import SpinnerIcon from './SpinnerIcon';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import { getIn, makeMotionTime, makeSize } from '~utils';
import Box from '~components/Box';

const getColor = ({
  contrast,
  intent,
  theme,
}: {
  contrast: NonNullable<SpinnerProps['contrast']>;
  intent: SpinnerProps['intent'];
  theme: Theme;
}): string => {
  if (intent) {
    return getIn(
      theme.colors,
      `feedback.${intent}.action.icon.primary.disabled.${contrast}Contrast`,
    );
  } else if (contrast == 'low') {
    return getIn(theme.colors, 'brand.gray.700');
  } else {
    return getIn(theme.colors, 'brand.gray.400');
  }
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;
const AnimatedSpinner = styled(Box)(({ theme }) => {
  return css`
    width: max-content;
    animation: ${rotate} ${makeMotionTime(theme.motion.duration['2xgentle'])}
      ${theme.motion.easing.exit.attentive as string} infinite;
  `;
});

const Spinner = ({
  // accessibilityLabel,
  contrast = 'low',
  intent,
  size = 'medium',
}: SpinnerProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <AnimatedSpinner display="flex">
      <SpinnerIcon
        dimensions={makeSize(dimensions[size])}
        color={getColor({ contrast, intent, theme })}
      />
    </AnimatedSpinner>
  );
};

export { Spinner };
