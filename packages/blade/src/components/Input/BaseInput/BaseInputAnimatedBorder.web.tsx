import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import type { ReactElement } from 'react';
import styled, { css, keyframes } from 'styled-components';
import type { BaseInputProps } from './BaseInput';
import BaseBox from '~components/Box/BaseBox';
import { makeMotionTime } from '~utils/makeMotionTime';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';
import type { ActionStates } from '~tokens/theme/theme';
import { makeBorderSize } from '~utils/makeBorderSize';

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

const BaseInputStyledAnimatedBorder = styled(BaseBox)(
  ({ theme, animation }: { theme: Theme; animation?: FlattenSimpleInterpolation }) => css`
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
  validationState,
}: {
  currentInteraction: keyof ActionStates;
  validationState: BaseInputProps['validationState'];
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
  // need ref because we don't have `blur` as an interaction which means the exit animation would run on default as well as blur event
  const borderAnimation = React.useRef<FlattenSimpleInterpolation>();
  if (
    currentInteraction === 'active' &&
    validationState !== 'error' &&
    validationState !== 'success'
  ) {
    borderAnimation.current = borderAnimationOnFocus;
  } else if (borderAnimation.current && currentInteraction === 'default') {
    borderAnimation.current = borderAnimationOnBlur;
  }

  return <BaseInputStyledAnimatedBorder animation={borderAnimation.current} />;
};
