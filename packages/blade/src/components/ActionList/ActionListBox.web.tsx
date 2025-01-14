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
    const { filteredValues, hasAutoCompleteInBottomSheetHeader, dropdownTriggerer } = useDropdown();
    const hasAutoComplete =
      hasAutoCompleteInBottomSheetHeader ||
      dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete;

    const isMobile = useIsMobile();
    const { theme } = useTheme();
    const { itemHeight, actionListBoxHeight } = React.useMemo(
      () => getVirtualItemParams({ theme, isMobile }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [theme.name, isMobile],
    );

    const isVisible = (itemValue) =>
      hasAutoComplete && filteredValues ? filteredValues.includes(itemValue) : true;

    // const filteredItems = filteredValues.map((value) => items.find((item) => item.props.value === value));
    const filteredItems = items.filter((item) => isVisible(item.props.value));

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
          itemCount={hasAutoComplete ? filteredItems.length : items.length}
          itemData={hasAutoComplete ? filteredItems : items}
        >
          {({ index, style, data }) =>
            React.cloneElement(data[index], { _style: style, key: `virtual-item-${index}` })
          }
        </VirtualizedList>
      </StyledListBoxWrapper>
    );
  },
);

const ActionListVirtualizedBox = assignWithoutSideEffects(React.memo(_ActionListVirtualizedBox), {
  displayName: 'ActionListVirtualizedBox',
});

export { ActionListBox, ActionListVirtualizedBox };
