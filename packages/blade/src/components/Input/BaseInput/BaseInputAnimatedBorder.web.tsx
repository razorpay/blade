import type { FlattenSimpleInterpolation } from 'styled-components';
import type { ReactElement } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Box from '~components/Box';
import { makeBorderSize, makeMotionTime } from '~utils';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import type { ActionStates } from '~tokens/theme/theme';

const scaleBorder = keyframes`
from {
  transform: scaleX(0);
  transform-origin: left;
  opacity: 0;
}
to {
  transform: scaleX(1);
  transform-origin: left;
  opacity: 1;
}
`;

const fadeOutBorder = keyframes`
from {
  opacity: 1
}
to {
  opacity: 0
}
`;

const BaseInputStyledAnimatedBorder = styled(Box)(
  ({ theme, animation }: { theme: Theme; animation: FlattenSimpleInterpolation | null }) => css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    background-color: ${theme.colors.brand.primary[500]};
    border-width: ${makeBorderSize(theme.border.width.thin)};
    height: ${makeBorderSize(theme.border.width.thin)};
    ${animation}
  `,
);

export const BaseInputAnimatedBorder = ({
  currentInteraction,
}: {
  currentInteraction: keyof ActionStates;
}): ReactElement => {
  const { theme } = useTheme();

  const borderAnimationOnFocus = css`
    animation: ${scaleBorder} ${makeMotionTime(theme.motion.duration.moderate)}
      ${theme.motion.easing.standard.effective as string} forwards;
  `;

  const borderAnimationOnBlur = css`
    animation: ${fadeOutBorder} ${makeMotionTime(theme.motion.duration.xquick)}
      ${theme.motion.easing.standard.effective as string} forwards;
  `;

  let borderAnimation = null;
  if (currentInteraction === 'focus') {
    borderAnimation = borderAnimationOnFocus;
  } else {
    borderAnimation = borderAnimationOnBlur;
  }

  return <BaseInputStyledAnimatedBorder animation={borderAnimation} />;
};
