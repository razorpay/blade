import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import type { BaseInputProps } from './BaseInput';
import { AnimatedBaseInputWrapper } from './AnimatedBaseInputWrapper';
import type { ContainerElementType } from '~utils/types';
import type { ActionStates } from '~utils/useInteraction';

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
  currentInteraction: ActionStates;
  isTextArea?: boolean;
  setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  children: React.ReactNode;
  size: NonNullable<BaseInputProps['size']>;
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
    </AnimatedBaseInputWrapper>
  );
};

export const BaseInputWrapper = React.forwardRef(_BaseInputWrapper);
