import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { AnimatedBaseInputWrapper } from './AnimatedBaseInputWrapper';
import type { BaseInputWrapperProps } from './types';
import type { ContainerElementType } from '~utils/types';

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
    numberOfLines,
    isTableInputCell,
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
      numberOfLines={numberOfLines}
      isTableInputCell={isTableInputCell}
      {...props}
    >
      {children}
    </AnimatedBaseInputWrapper>
  );
};

export const BaseInputWrapper = React.forwardRef(_BaseInputWrapper);
