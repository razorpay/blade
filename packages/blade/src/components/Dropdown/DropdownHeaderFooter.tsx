/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { useDropdown } from './useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects, makeAccessible } from '~utils';
import type { BaseHeaderProps } from '~components/BaseHeaderFooter/BaseHeader';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '~components/BaseHeaderFooter/BaseFooter';
import { BaseFooter } from '~components/BaseHeaderFooter/BaseFooter';
import { useBottomSheetAndDropdownGlue } from '~components/BottomSheet/BottomSheetContext';

type DropdownHeaderProps = Pick<
  BaseHeaderProps,
  'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix' | 'testID'
>;

const _DropdownHeader = ({
  title,
  subtitle,
  leading,
  titleSuffix,
  trailing,
}: DropdownHeaderProps): React.ReactElement => {
  return (
    <BaseBox
      overflow={'auto' as never}
      flexShrink={0}
      onMouseDown={(e) => {
        // we don't want focus to ever move on header because its static element
        e.preventDefault();
      }}
    >
      <BaseHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        trailing={trailing}
        titleSuffix={titleSuffix}
        metaComponentName="DropdownHeader"
        // back button
        showBackButton={false}
        // close button
        showCloseButton={false}
      />
    </BaseBox>
  );
};

const DropdownHeader = assignWithoutSideEffects(_DropdownHeader, {
  componentId: 'DropdownHeader',
});

type DropdownFooter = Pick<BaseFooterProps, 'children' | 'testID'>;

const _DropdownFooter = ({ children }: DropdownFooter): React.ReactElement => {
  const {
    setHasFooterAction,
    setShouldIgnoreBlur,
    activeIndex,
    onTriggerKeydown,
    close,
    dropdownOverlayRef,
  } = useDropdown();
  const bottomSheetAndDropdownGlue = useBottomSheetAndDropdownGlue();
  const footerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setHasFooterAction(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseBox
      ref={footerRef}
      onMouseDown={() => {
        setShouldIgnoreBlur(true);
      }}
      onKeyDown={(e) => {
        const nativeEvent = e.nativeEvent;
        const shouldIgnoreDropdownKeydown =
          (nativeEvent.key === ' ' || nativeEvent.key === 'Enter') && activeIndex < 0;

        if (!shouldIgnoreDropdownKeydown) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onTriggerKeydown?.({ event: e.nativeEvent } as any);
        }
      }}
      onBlur={(e) => {
        const nextItem = e.relatedTarget;
        if (
          !dropdownOverlayRef.current?.contains(nextItem) &&
          !bottomSheetAndDropdownGlue?.dropdownHasBottomSheet
        ) {
          close();
        }
      }}
      {...makeAccessible({
        role: 'group',
      })}
    >
      <BaseFooter>{children}</BaseFooter>
    </BaseBox>
  );
};

const DropdownFooter = assignWithoutSideEffects(_DropdownFooter, {
  componentId: 'DropdownFooter',
});

export { DropdownHeader, DropdownFooter };
