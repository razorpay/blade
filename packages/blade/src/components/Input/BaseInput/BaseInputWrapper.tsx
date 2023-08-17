import styled, { css, FlattenSimpleInterpolation, keyframes } from 'styled-components';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import type { BaseInputProps } from './BaseInput';
import { BaseInputAnimatedBorder } from './BaseInputAnimatedBorder';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, getPlatformType, makeSize } from '~utils';
import type { ActionStates } from '~tokens/theme/theme';
import { makeMotionTime } from '~utils/makeMotionTime';
import { useTheme } from '~components/BladeProvider';
import { size } from '~tokens/global';

type BaseInputWrapperProps = Pick<BaseInputProps, 'isDisabled' | 'validationState'> & {
  isFocused?: boolean;
  isLabelLeftPositioned?: boolean;
  currentInteraction: keyof ActionStates;
  isTextArea?: boolean;
  showAllTags?: boolean;
  setShowAllTagsWithAnimation?: (showAllTagsWithAnimation: boolean) => void;
};

const BASEINPUT_MIN_HEIGHT = size['36'];
const BASEINPUT_BOTTOM_LINE_HEIGHT = size['1'];
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

// Styled component with animation
const AnimatedContainer = styled(BaseBox)<{ transition?: FlattenSimpleInterpolation }>(
  (props) => css`
    ${props.transition};
  `,
);

const StyledBaseInputWrapper = styled(AnimatedContainer)<BaseInputWrapperProps>((props) => ({
  ...getInputBackgroundAndBorderStyles({
    theme: props.theme,
    isFocused: props.currentInteraction === 'active',
    isDisabled: props.isDisabled,
    validationState: props.validationState,
  }),
  '&:hover':
    getPlatformType() === 'react-native'
      ? undefined
      : {
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
  ':focus-within':
    getPlatformType() === 'react-native'
      ? undefined
      : {
          ...getInputBackgroundAndBorderStyles({
            theme: props.theme,
            isFocused: props.currentInteraction === 'active',
            isDisabled: props.isDisabled,
            validationState: props.validationState,
          }),
        },
}));

const _BaseInputWrapper: React.ForwardRefRenderFunction<
  HTMLDivElement,
  BaseInputWrapperProps & {
    children: ReactNode;
  }
> = (
  {
    children,
    validationState,
    currentInteraction,
    isLabelLeftPositioned,
    isTextArea,
    showAllTags,
    setShowAllTagsWithAnimation,
    ...props
  },
  ref,
): ReactElement => {
  const { theme } = useTheme();

  const expandTransition = css`
    animation: ${expandAnimation} ${makeMotionTime(theme.motion.duration.quick)}
      ${String(theme.motion.easing.entrance.effective)};
  `;

  const collapseTransition = css`
    animation: ${collapseAnimation} ${makeMotionTime(theme.motion.duration.quick)}
      ${String(theme.motion.easing.exit.effective)};
  `;

  return (
    <StyledBaseInputWrapper
      ref={ref}
      display="flex"
      flexDirection="row"
      width="100%"
      alignItems={isTextArea ? 'flex-start' : undefined}
      validationState={validationState}
      currentInteraction={currentInteraction}
      position="relative"
      transition={showAllTags ? expandTransition : collapseTransition}
      onAnimationEnd={(e) => {
        if (!showAllTags && e.animationName === collapseAnimation.getName()) {
          setShowAllTagsWithAnimation?.(false);
        }
      }}
      {...props}
    >
      {children}
      <BaseInputAnimatedBorder
        currentInteraction={currentInteraction}
        validationState={validationState}
      />
    </StyledBaseInputWrapper>
  );
};

export const BaseInputWrapper = React.forwardRef(_BaseInputWrapper);
