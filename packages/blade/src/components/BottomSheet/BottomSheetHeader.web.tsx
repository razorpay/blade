/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { ComponentIds } from './componentIds';
import { useBottomSheetAndDropdownGlue, useBottomSheetContext } from './BottomSheetContext';
import type { BottomSheetHeaderProps } from './types';
import { BottomSheetEmptyHeader } from './BottomSheetCommon';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _BottomSheetHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
  showBackButton = false,
  onBackButtonClick,
  children,
  ...dataAnalyticsProps
}: BottomSheetHeaderProps): React.ReactElement => {
  const {
    setHeaderHeight,
    isOpen,
    close,
    bind,
    setIsHeaderEmpty,
    defaultInitialFocusRef,
  } = useBottomSheetContext();
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();
  const ref = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    setHeaderHeight(ref.current.getBoundingClientRect().height);
  }, [ref, isOpen]);

  const isHeaderEmpty = !(title || subtitle || leading || trailing || showBackButton || children);

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
      {...makeAnalyticsAttribute(dataAnalyticsProps)}
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
          // we don't set focus on close button when it has AutoComplete inside.
          // We set focus on AutoComplete instead inside AutoComplete component
          closeButtonRef={
            bottomSheetAndDropdownGlue?.hasAutoCompleteInBottomSheetHeader
              ? undefined
              : defaultInitialFocusRef
          }
          // back button
          showBackButton={showBackButton}
          onBackButtonClick={onBackButtonClick}
          // close button
          showCloseButton={true}
          onCloseButtonClick={close}
          {...bind?.()}
        >
          {children}
        </BaseHeader>
      )}
    </BaseBox>
  );
};

const BottomSheetHeader = assignWithoutSideEffects(_BottomSheetHeader, {
  componentId: ComponentIds.BottomSheetHeader,
});

export { BottomSheetHeader };
