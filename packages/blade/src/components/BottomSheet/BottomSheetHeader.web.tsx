/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { BaseHeader } from '../BaseHeaderFooter/BaseHeader';
import { ComponentIds } from './componentIds';
import { useBottomSheetContext } from './BottomSheetContext';
import type { BottomSheetHeaderProps } from './types';
import { BottomSheetEmptyHeader } from './BottomSheetCommon';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
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
  const {
    setHeaderHeight,
    isOpen,
    close,
    bind,
    setIsHeaderEmpty,
    defaultInitialFocusRef,
  } = useBottomSheetContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    setHeaderHeight(ref.current.getBoundingClientRect().height);
  }, [ref, isOpen]);

  const isHeaderEmpty = !(title || subtitle || leading || trailing || showBackButton);

  React.useEffect(() => {
    setIsHeaderEmpty(isHeaderEmpty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHeaderEmpty]);

  return (
    <BaseBox
      ref={ref}
      overflow={isHeaderEmpty ? 'visible' : 'auto'}
      flexShrink={0}
      {...metaAttribute({ name: MetaConstants.BottomSheetHeader })}
    >
      {isHeaderEmpty ? (
        <BottomSheetEmptyHeader ref={defaultInitialFocusRef} />
      ) : (
        <BaseHeader
          title={title}
          subtitle={subtitle}
          leading={leading}
          trailing={trailing}
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
