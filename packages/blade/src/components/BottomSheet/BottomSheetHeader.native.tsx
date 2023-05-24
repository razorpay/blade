/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BottomSheetHeaderProps } from './types';
import { useBottomSheetHeaderTrailingRestriction } from './utils';
import { BottomSheetEmptyHeader } from './BottomSheetCommon';
import BaseBox from '~components/Box/BaseBox';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BottomSheetHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  titleSuffix,
  showBackButton = false,
  onBackButtonClick,
}: BottomSheetHeaderProps): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useBottomSheetContext();
  const validatedTrailingComponent = useBottomSheetHeaderTrailingRestriction(trailing);
  const isHeaderEmpty = !(title || subtitle || leading || trailing || showBackButton);

  return (
    <BaseBox backgroundColor="white" overflow="visible" flexShrink={0}>
      {isHeaderEmpty ? (
        <BottomSheetEmptyHeader ref={defaultInitialFocusRef} />
      ) : (
        <BaseHeader
          title={title}
          subtitle={subtitle}
          leading={leading}
          trailing={validatedTrailingComponent}
          titleSuffix={titleSuffix}
          // back button
          closeButtonRef={defaultInitialFocusRef}
          showBackButton={showBackButton}
          onBackButtonClick={onBackButtonClick}
          // close button
          showCloseButton={true}
          onCloseButtonClick={close}
        />
      )}
    </BaseBox>
  );
};

const BottomSheetHeader = assignWithoutSideEffects(_BottomSheetHeader, {
  componentId: ComponentIds.BottomSheetHeader,
});

export { BottomSheetHeader, BottomSheetHeaderProps };
