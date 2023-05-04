import React from 'react';
import { ComponentIds } from './componentIds';
import { BottomSheetGrabHandle } from './BottomSheetGrabHandle';
import { useBottomSheetContext } from './BottomSheetContext';
import { BottomSheetHeaderProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';

const _BottomSheetHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  titleSuffix,
  hideDivider = false,
  showBackButton = false,
  onBackButtonClick,
}: BottomSheetHeaderProps): React.ReactElement => {
  const { close, defaultInitialFocusRef } = useBottomSheetContext();
  return (
    <BaseBox backgroundColor="white" overflow="visible" flexShrink={0}>
      <BaseHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        trailing={trailing}
        titleSuffix={titleSuffix}
        hideDivider={hideDivider}
        // back button
        closeButtonRef={defaultInitialFocusRef}
        showBackButton={showBackButton}
        onBackButtonClick={onBackButtonClick}
        // close button
        showCloseButton={true}
        onCloseButtonClick={close}
      />
    </BaseBox>
  );
};

const BottomSheetHeader = assignWithoutSideEffects(_BottomSheetHeader, {
  componentId: ComponentIds.BottomSheetHeader,
});

export { BottomSheetGrabHandle, BottomSheetHeader, BottomSheetHeaderProps };
