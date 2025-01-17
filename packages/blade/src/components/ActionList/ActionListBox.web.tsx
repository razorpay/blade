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
import { useDropdown } from '~components/Dropdown/useDropdown';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';

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

/**
 * Returns the height of item and height of container based on theme and device
 */
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

/**
 * Takes the children (ActionListItem) and returns the filtered items based on `filteredValues` state
 */
const useFilteredItems = (
  children: React.ReactNode[],
): {
  itemData: React.ReactNode[];
  itemCount: number;
} => {
  const childrenArray = React.Children.toArray(children); // Convert children to an array

  const { filteredValues, hasAutoCompleteInBottomSheetHeader, dropdownTriggerer } = useDropdown();

  const items = React.useMemo(() => {
    const hasAutoComplete =
      hasAutoCompleteInBottomSheetHeader ||
      dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete;

    if (!hasAutoComplete) {
      return childrenArray;
    }

    // @ts-expect-error: props does exist
    const filteredItems = childrenArray.filter((item) => filteredValues.includes(item.props.value));
    return filteredItems;
  }, [filteredValues, hasAutoCompleteInBottomSheetHeader, dropdownTriggerer, childrenArray]);

  return {
    itemData: items,
    itemCount: items.length,
  };
};

const VirtualListItem = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: React.ReactNode[];
}): React.ReactElement => {
  return <div style={style}>{data[index]}</div>;
};

const _ActionListVirtualizedBox = React.forwardRef<HTMLDivElement, ActionListBoxProps>(
  ({ childrenWithId, actionListItemWrapperRole, isMultiSelectable, ...rest }, ref) => {
    const items = React.Children.toArray(childrenWithId); // Convert children to an array
    const { isInBottomSheet } = useBottomSheetContext();
    const { itemData, itemCount } = useFilteredItems(items);

    const isMobile = useIsMobile();
    const { theme } = useTheme();
    const { itemHeight, actionListBoxHeight } = React.useMemo(
      () => getVirtualItemParams({ theme, isMobile }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [theme.name, isMobile],
    );

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
        {itemCount < 10 ? (
          childrenWithId
        ) : (
          <VirtualizedList
            height={actionListBoxHeight}
            width="100%"
            itemSize={itemHeight}
            itemCount={itemCount}
            itemData={itemData}
            // @ts-expect-error: props does exist
            itemKey={(index) => itemData[index]?.props.value}
          >
            {VirtualListItem}
          </VirtualizedList>
        )}
      </StyledListBoxWrapper>
    );
  },
);

const ActionListVirtualizedBox = assignWithoutSideEffects(React.memo(_ActionListVirtualizedBox), {
  displayName: 'ActionListVirtualizedBox',
});

export { ActionListBox, ActionListVirtualizedBox };
