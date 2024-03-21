import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type { BaseInputWrapperProps } from './types';
import {
  getAnimatedBaseInputWrapperMaxHeight,
  getInputBackgroundAndBorderStyles,
} from './baseInputStyles';
import { baseInputWrapperMaxHeight, baseInputWrapperMinHeight } from './baseInputTokens';
import BaseBox from '~components/Box/BaseBox';
import { motion } from '~tokens/global';
import { castWebType, makeMotionTime, makeSize } from '~utils';
import type { BladeElementRef } from '~utils/types';

const StyledBaseInputWrapper = styled(BaseBox)<
  Pick<
    BaseInputWrapperProps,
    'currentInteraction' | 'isDisabled' | 'validationState' | 'isTextArea' | 'isDropdownTrigger'
  >
>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.currentInteraction === 'focus',
    isDisabled: props.isDisabled,
    validationState: props.validationState,
    isTextArea: props.isTextArea,
    isDropdownTrigger: props.isDropdownTrigger,
  }),
  '&:hover': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isHovered: true,
      isFocused: props.currentInteraction === 'focus',
      isDisabled: props.isDisabled,
      validationState: props.validationState,
      isDropdownTrigger: props.isDropdownTrigger,
    }),
    transitionProperty: 'background-color',
    transitionDuration: castWebType(makeMotionTime(props.theme.motion.duration.xquick)),
    transitionTimingFunction: castWebType(props.theme.motion.easing.standard.effective),
  },
  ':focus-within': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isFocused: props.currentInteraction === 'focus',
      isDisabled: props.isDisabled,
      validationState: props.validationState,
      isDropdownTrigger: props.isDropdownTrigger,
    }),
  },
}));

// Styled component with animation
const StyledAnimatedBaseInputWrapper = styled(StyledBaseInputWrapper)<{
  transition?: FlattenSimpleInterpolation;
  maxTagRows: BaseInputWrapperProps['maxTagRows'];
  showAllTags: BaseInputWrapperProps['showAllTags'];
  isDropdownTrigger: BaseInputWrapperProps['isDropdownTrigger'];
  size: NonNullable<BaseInputWrapperProps['size']>;
}>((props) =>
  props.isDropdownTrigger
    ? css`
        ${props.transition};
        max-height: ${makeSize(
          getAnimatedBaseInputWrapperMaxHeight({
            maxTagRows: props.maxTagRows,
            showAllTags: props.showAllTags,
            size: props.size,
          }),
        )};
      `
    : undefined,
);

const _AnimatedBaseInputWrapper: React.ForwardRefRenderFunction<
  BladeElementRef,
  BaseInputWrapperProps & {
    showAllTags?: boolean;
  }
> = (
  { showAllTags, setShowAllTagsWithAnimation, maxTagRows, isDropdownTrigger, ...rest },
  ref,
): React.ReactElement => {
  // Define the animation keyframes
  const expandAnimation = keyframes`
from {
  max-height: ${makeSize(baseInputWrapperMinHeight[rest.size])};
}
to {
  max-height: ${makeSize(baseInputWrapperMaxHeight[rest.size])};
}
`;

  const collapseAnimation = keyframes`
from {
  max-height: ${makeSize(baseInputWrapperMaxHeight[rest.size])};
}
to {
  max-height: ${makeSize(baseInputWrapperMinHeight[rest.size])};
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

  const noTransition = css`
    animation: none;
  `;
  return (
    <StyledAnimatedBaseInputWrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      {...rest}
      transition={
        maxTagRows !== 'expandable'
          ? noTransition
          : showAllTags
          ? expandTransition
          : collapseTransition
      }
      isDropdownTrigger={isDropdownTrigger}
      showAllTags={showAllTags}
      maxTagRows={maxTagRows}
      onAnimationEnd={(e) => {
        if (!showAllTags && e.animationName === collapseAnimation.getName()) {
          // Triggered for the collapse animation
          setShowAllTagsWithAnimation?.(false);
        }
      }}
    />
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper };
