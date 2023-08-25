import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type { BaseInputWrapperProps } from './types';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import BaseBox from '~components/Box/BaseBox';
import { motion, size } from '~tokens/global';
import { castWebType, makeMotionTime, makeSize } from '~utils';
import type { BladeElementRef } from '~utils/types';

const BASEINPUT_MIN_HEIGHT: number = size['36'];
const BASEINPUT_BOTTOM_LINE_HEIGHT: number = size['1'];
const MAX_ROWS = 4;
const BASEINPUT_MAX_HEIGHT = size['36'] * MAX_ROWS; // we don't want exact number but rough number to be able to animate correctly in height.

// Define the animation keyframes
const expandAnimation = keyframes`
  from {
    max-height: ${makeSize(BASEINPUT_MIN_HEIGHT + BASEINPUT_BOTTOM_LINE_HEIGHT)};
  }
  to {
    max-height: ${makeSize(BASEINPUT_MAX_HEIGHT + BASEINPUT_BOTTOM_LINE_HEIGHT)};
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: ${makeSize(BASEINPUT_MAX_HEIGHT + BASEINPUT_BOTTOM_LINE_HEIGHT)};
  }
  to {
    max-height: ${makeSize(BASEINPUT_MIN_HEIGHT + BASEINPUT_BOTTOM_LINE_HEIGHT)};
  }
`;

const expandTransition = css`
  animation: ${expandAnimation} ${makeMotionTime(motion.duration.quick)}
    ${String(motion.easing.entrance.effective)};
`;

const collapseTransition = css`
  animation: ${collapseAnimation} ${makeMotionTime(motion.duration.quick)}
    ${String(motion.easing.exit.effective)};
`;

const StyledBaseInputWrapper = styled(BaseBox)<
  Pick<
    BaseInputWrapperProps,
    'currentInteraction' | 'isDisabled' | 'validationState' | 'isTextArea'
  >
>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.currentInteraction === 'active',
    isDisabled: props.isDisabled,
    validationState: props.validationState,
    isTextArea: props.isTextArea,
  }),
  '&:hover': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isHovered: true,
      isFocused: props.currentInteraction === 'active',
      isDisabled: props.isDisabled,
      validationState: props.validationState,
    }),
    transitionProperty: 'background-color',
    transitionDuration: castWebType(makeMotionTime(props.theme.motion.duration.xquick)),
    transitionTimingFunction: castWebType(props.theme.motion.easing.standard.effective),
  },
  ':focus-within': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isFocused: props.currentInteraction === 'active',
      isDisabled: props.isDisabled,
      validationState: props.validationState,
    }),
  },
}));

// Styled component with animation
const StyledAnimatedBaseInputWrapper = styled(StyledBaseInputWrapper)<{
  transition?: FlattenSimpleInterpolation;
}>(
  (props) => css`
    ${props.transition};
  `,
);

const _AnimatedBaseInputWrapper: React.ForwardRefRenderFunction<
  BladeElementRef,
  BaseInputWrapperProps & {
    showAllTags?: boolean;
  }
> = ({ showAllTags, setShowAllTagsWithAnimation, ...rest }, ref): React.ReactElement => {
  return (
    <StyledAnimatedBaseInputWrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      {...rest}
      transition={showAllTags ? expandTransition : collapseTransition}
      onAnimationEnd={(e) => {
        if (!showAllTags && e.animationName === collapseAnimation.getName()) {
          setShowAllTagsWithAnimation?.(false);
        }
      }}
    />
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper, expandAnimation, collapseAnimation };
