import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import type { BaseInputProps } from './BaseInput';
import { BaseInputAnimatedBorder } from './BaseInputAnimatedBorder';
import { AnimatedBaseInputWrapper } from './AnimatedBaseInputWrapper';
import type { ActionStates } from '~tokens/theme/theme';
import type { ContainerElementType } from '~utils/types';

type BaseInputWrapperProps = Pick<
  BaseInputProps,
  | 'isDisabled'
  | 'validationState'
  | 'showAllTags'
  | 'maxTagRows'
  | 'setInputWrapperRef'
  | 'isDropdownTrigger'
> & {
  isFocused?: boolean;
  isLabelLeftPositioned?: boolean;
  currentInteraction: keyof ActionStates;
  isTextArea?: boolean;
  setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  children: React.ReactNode;
};

const _BaseInputWrapper: React.ForwardRefRenderFunction<
  ContainerElementType,
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
    maxTagRows,
    ...props
  },
  ref,
): ReactElement => {
  return (
    <AnimatedBaseInputWrapper
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-assertion
      ref={ref as any}
      isTextArea={isTextArea}
      validationState={validationState}
      currentInteraction={currentInteraction}
      showAllTags={showAllTags}
      maxTagRows={maxTagRows}
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
