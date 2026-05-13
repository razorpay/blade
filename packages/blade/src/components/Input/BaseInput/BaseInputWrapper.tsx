import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { AnimatedBaseInputWrapper } from './AnimatedBaseInputWrapper';
import type { BaseInputWrapperProps } from './types';
import type { ContainerElementType } from '~utils/types';
import BaseBox from '~components/Box/BaseBox';

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
    topContent,
    bottomContent,
    inputRowOverlay,
    ...props
  },
  ref,
): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const hasExtraContent = Boolean(topContent || bottomContent || inputRowOverlay);

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
      {hasExtraContent ? (
        <BaseBox display="flex" flexDirection="column" width="100%">
          {topContent}
          <BaseBox
            display="flex"
            flexDirection="row"
            width="100%"
            alignItems={isTextArea ? 'flex-start' : 'center'}
            position={inputRowOverlay ? 'relative' : undefined}
          >
            {children}
            {inputRowOverlay}
          </BaseBox>
          {bottomContent}
        </BaseBox>
      ) : (
        children
      )}
    </AnimatedBaseInputWrapper>
  );
};

export const BaseInputWrapper = React.forwardRef(_BaseInputWrapper);
