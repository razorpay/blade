import styled, { css, keyframes } from 'styled-components';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { getInputBackgroundAndBorderStyles } from './baseInputStyles';
import type { BaseInputProps } from './BaseInput';
import { BaseInputAnimatedBorder } from './BaseInputAnimatedBorder';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, getPlatformType } from '~utils';
import type { ActionStates } from '~tokens/theme/theme';
import { makeMotionTime } from '~utils/makeMotionTime';
import { useTheme } from '~components/BladeProvider';

type BaseInputWrapperProps = Pick<BaseInputProps, 'isDisabled' | 'validationState'> & {
  isFocused?: boolean;
  isLabelLeftPositioned?: boolean;
  currentInteraction: keyof ActionStates;
  isTextArea?: boolean;
};

// Define the animation keyframes
const expandAnimation = keyframes`
  from {
    max-height: 37px;
  }
  to {
    max-height: 200px;
  }
`;

const collapseAnimation = keyframes`
  from {
    max-height: 200px;
  }
  to {
    max-height: 37px;
  }
`;

// Styled component with animation
const AnimatedContainer = styled(BaseBox)(
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
