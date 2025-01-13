/* eslint-disable react/display-name */
import React from 'react';
import { FixedSizeList as VirtualizedList } from 'react-window';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import type { SectionData } from './actionListUtils';
import { actionListMaxHeight, getActionListPadding } from './styles/getBaseListBoxWrapperStyles';
import { useBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useIsMobile } from '~utils/useIsMobile';
import { getItemHeight } from '~components/BaseMenu/BaseMenuItem/tokens';
import { useTheme } from '~utils';
import type { Theme } from '~components/BladeProvider';

type ActionListBoxProps = {
  childrenWithId?: React.ReactNode[] | null;
  sectionData: SectionData;
  actionListItemWrapperRole: 'listbox' | 'menu' | undefined;
  isMultiSelectable: boolean;
  isInBottomSheet: boolean;
} & DataAnalyticsAttribute;

const _ActionListBox = React.forwardRef<HTMLDivElement, ActionListBoxProps>(
  ({ childrenWithId, actionListItemWrapperRole, isMultiSelectable, ...rest }, ref) => {
    const { isInBottomSheet } = useBottomSheetContext();

    return (
      <StyledListBoxWrapper
        isInBottomSheet={isInBottomSheet}
        ref={ref}
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
        {...makeAnalyticsAttribute(rest)}
      >
        {childrenWithId}
      </StyledListBoxWrapper>
    );
  },
);

const ActionListBox = assignWithoutSideEffects(React.memo(_ActionListBox), {
  displayName: 'ActionListBox',
});

const getVirtualItemParams = ({
  theme,
  isMobile,
}: {
  theme: Theme;
  isMobile: boolean;
}): {
  itemHeight: number;
  actionListBoxHeight: number;
} => {
  const itemHeightResponsive = getItemHeight(theme);
  const actionListPadding = getActionListPadding(theme);
  const actionListBoxHeight = actionListMaxHeight - actionListPadding * 2;

  return {
    itemHeight: isMobile
      ? itemHeightResponsive.itemHeightMobile
      : itemHeightResponsive.itemHeightDesktop,
    actionListBoxHeight,
  };
};

const _ActionListVirtualizedBox = React.forwardRef<HTMLDivElement, ActionListBoxProps>(
  ({ childrenWithId, actionListItemWrapperRole, isMultiSelectable, ...rest }, ref) => {
    const items = React.Children.toArray(childrenWithId); // Convert children to an array
    const { isInBottomSheet } = useBottomSheetContext();
    const isMobile = useIsMobile();
    const { theme } = useTheme();
    const { itemHeight, actionListBoxHeight } = React.useMemo(
      () => getVirtualItemParams({ theme, isMobile }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [theme.name, isMobile],
    );

    console.log({ itemHeight, actionListBoxHeight });

    return (
      <StyledListBoxWrapper
        isInBottomSheet={isInBottomSheet}
        ref={ref}
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
        {...makeAnalyticsAttribute(rest)}
      >
        <VirtualizedList
          height={actionListBoxHeight}
          width="100%"
          itemSize={itemHeight}
          itemCount={items.length}
        >
          {({ index, style }) => (
            <div style={style} key={`virtual-item-${index}`}>
              {items[index]}
            </div>
          )}
        </VirtualizedList>
      </StyledListBoxWrapper>
    );
  },
);

const ActionListVirtualizedBox = assignWithoutSideEffects(React.memo(_ActionListVirtualizedBox), {
  displayName: 'ActionListVirtualizedBox',
});

export { ActionListBox, ActionListVirtualizedBox };
