/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BottomSheetHeaderProps } from './types';
import { useBottomSheetHeaderTrailingRestriction } from './utils';
import { BottomSheetEmptyHeader } from './BottomSheetCommon';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute } from '~utils';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BottomSheetHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
  showBackButton = false,
  onBackButtonClick,
}: BottomSheetHeaderProps): React.ReactElement => {
  const { setHeaderHeight, isOpen, close, bind, defaultInitialFocusRef } = useBottomSheetContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const validatedTrailingComponent = useBottomSheetHeaderTrailingRestriction(trailing);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    setHeaderHeight(ref.current.getBoundingClientRect().height);
  }, [ref, isOpen]);

  const isHeaderEmpty = !(title || subtitle || leading || trailing || showBackButton);

  return (
    <BaseBox
      ref={ref}
      overflow={isHeaderEmpty ? 'visible' : 'auto'}
      flexShrink={0}
      {...metaAttribute({ name: ComponentIds.BottomSheetHeader })}
    >
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
          {...bind?.()}
        />
      )}
    </BaseBox>
  );
};

const BottomSheetHeader = assignWithoutSideEffects(_BottomSheetHeader, {
  componentId: ComponentIds.BottomSheetHeader,
});

export { BottomSheetHeader };
