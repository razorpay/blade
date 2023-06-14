/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import React from 'react';
import { BaseFooter } from '../BaseHeaderFooter/BaseFooter';
import { BaseHeader } from '../BaseHeaderFooter/BaseHeader';
import type { BaseHeaderProps } from '../BaseHeaderFooter/BaseHeader';
import type { BaseFooterProps } from '../BaseHeaderFooter/BaseFooter';
import { useDropdown } from './useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects, isReactNative, makeAccessible, MetaConstants } from '~utils';
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
  testID,
}: DropdownHeaderProps): React.ReactElement => {
  return (
    <BaseBox
      overflow={'auto' as never}
      flexShrink={0}
      {...(isReactNative()
        ? {}
        : {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onMouseDown: (e: any) => {
              // we don't want focus to ever move on header because its static element
              e.preventDefault();
            },
          })}
    >
      <BaseHeader
        title={title}
        subtitle={subtitle}
        leading={leading}
        trailing={trailing}
        titleSuffix={titleSuffix}
        metaComponentName={MetaConstants.DropdownHeader}
        testID={testID}
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

const _DropdownFooter = ({ children, testID }: DropdownFooter): React.ReactElement => {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={footerRef as any}
      {...(isReactNative()
        ? {}
        : {
            onMouseDown: () => {
              setShouldIgnoreBlur(true);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onKeyDown: (e: any) => {
              const nativeEvent = e.nativeEvent;
              const shouldIgnoreDropdownKeydown =
                (nativeEvent.key === ' ' || nativeEvent.key === 'Enter') && activeIndex < 0;

              if (!shouldIgnoreDropdownKeydown) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onTriggerKeydown?.({ event: e.nativeEvent } as any);
              }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onBlur: (e: any) => {
              const nextItem = e.relatedTarget;
              if (
                !dropdownOverlayRef.current?.contains(nextItem) &&
                !bottomSheetAndDropdownGlue?.dropdownHasBottomSheet
              ) {
                close();
              }
            },
          })}
      {...makeAccessible({
        role: 'group',
      })}
    >
      <BaseFooter metaComponentName={MetaConstants.DropdownFooter} testID={testID}>
        {children}
      </BaseFooter>
    </BaseBox>
  );
};

const DropdownFooter = assignWithoutSideEffects(_DropdownFooter, {
  componentId: 'DropdownFooter',
});

export { DropdownHeader, DropdownFooter };
