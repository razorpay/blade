import React from 'react';
import type { FlattenSimpleInterpolation } from 'styled-components';
import styled, { css, keyframes } from 'styled-components';
import type { BaseInputWrapperProps } from './types';
import {
  getAnimatedBaseInputWrapperMaxHeight,
  getInputBackgroundAndBorderStyles,
} from './baseInputStyles';
import { baseInputHeight, baseInputWrapperMaxHeight } from './baseInputTokens';
import BaseBox from '~components/Box/BaseBox';
import { motion } from '~tokens/global';
import { castWebType, makeMotionTime, makeSize, makeSpace } from '~utils';
import type { BladeElementRef } from '~utils/types';

const StyledBaseInputWrapper = styled(BaseBox)<
  Pick<
    BaseInputWrapperProps,
    | 'currentInteraction'
    | 'isDisabled'
    | 'validationState'
    | 'isTextArea'
    | 'isDropdownTrigger'
    | 'maxTagRows'
    | 'isTableInputCell'
  >
>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.currentInteraction === 'focus',
    isDisabled: props.isDisabled,
    validationState: props.validationState,
    isTextArea: props.isTextArea,
    isDropdownTrigger: props.isDropdownTrigger,
    isTableInputCell: props.isTableInputCell,
  }),
  '&:hover': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isHovered: true,
      isFocused: props.currentInteraction === 'focus',
      isDisabled: props.isDisabled,
      validationState: props.validationState,
      isDropdownTrigger: props.isDropdownTrigger,
      isTextArea: props.isTextArea,
      isTableInputCell: props.isTableInputCell,
    }),
    transitionProperty: 'background-color',
    transitionDuration: castWebType(makeMotionTime(props.theme.motion.duration.xquick)),
    transitionTimingFunction: castWebType(props.theme.motion.easing.standard),
  },
  ':focus-within': {
    ...getInputBackgroundAndBorderStyles({
      theme: props.theme,
      isFocused: props.currentInteraction === 'focus',
      isDisabled: props.isDisabled,
      validationState: props.validationState,
      isDropdownTrigger: props.isDropdownTrigger,
      isTextArea: props.isTextArea,
      isTableInputCell: props.isTableInputCell,
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
  props.isDropdownTrigger && !props.isTableInputCell
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
  max-height: ${makeSize(baseInputHeight[rest.size])};
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
  max-height: ${makeSize(baseInputHeight[rest.size])};
}
`;

  const expandTransition = css`
    animation: ${expandAnimation} ${makeMotionTime(motion.duration.quick)}
      ${String(motion.easing.entrance)};
  `;

  const collapseTransition = css`
    animation: ${collapseAnimation} ${makeMotionTime(motion.duration.quick)}
      ${String(motion.easing.exit)};
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
      height={
        rest.isTextArea && isDropdownTrigger
          ? makeSpace((rest.numberOfLines ?? 0) * baseInputHeight[rest.size])
          : undefined
      }
      cursor={rest.isTextArea && isDropdownTrigger ? 'text' : undefined}
      isDropdownTrigger={isDropdownTrigger}
      showAllTags={showAllTags}
      maxTagRows={maxTagRows}
      onAnimationEnd={(e) => {
        if (!showAllTags && e.animationName === collapseAnimation.getName()) {
          // Triggered for the collapse animation
          setShowAllTagsWithAnimation?.(false);
        }
      }}
      isTableInputCell={rest.isTableInputCell}
    />
  );
};

const AnimatedBaseInputWrapper = React.forwardRef(_AnimatedBaseInputWrapper);

export { AnimatedBaseInputWrapper };
