import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import type { BaseInputProps } from './BaseInput';
import { BaseInputAnimatedBorder } from './BaseInputAnimatedBorder';
import { AnimatedBaseInputWrapper } from './AnimatedBaseInputWrapper';
import type { ActionStates } from '~tokens/theme/theme';

type BaseInputWrapperProps = Pick<
  BaseInputProps,
  'isDisabled' | 'validationState' | 'showAllTags'
> & {
  isFocused?: boolean;
  isLabelLeftPositioned?: boolean;
  currentInteraction: keyof ActionStates;
  isTextArea?: boolean;
  setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  children: React.ReactNode;
};

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
  return (
    <AnimatedBaseInputWrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      isTextArea={isTextArea}
      validationState={validationState}
      currentInteraction={currentInteraction}
      showAllTags={showAllTags}
      setShowAllTagsWithAnimation={setShowAllTagsWithAnimation}
      {...props}
    >
      {children}
      <BaseInputAnimatedBorder
        currentInteraction={currentInteraction}
        validationState={validationState}
      />
    </AnimatedBaseInputWrapper>
  );
};

export const BaseInputWrapper = React.forwardRef(_BaseInputWrapper);
