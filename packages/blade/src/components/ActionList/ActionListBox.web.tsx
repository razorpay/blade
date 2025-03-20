/* eslint-disable react/display-name */
import React from 'react';
import { VariableSizeList as VirtualizedList } from 'react-window';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import type { SectionData } from './actionListUtils';
import { actionListMaxHeight, getActionListPadding } from './styles/getBaseListBoxWrapperStyles';
import { componentIds } from './componentIds';
import { ActionListSectionTitle } from './ActionListItem';
import { useBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useIsMobile } from '~utils/useIsMobile';
import {
  actionListSectionTitleHeight,
  getItemHeight,
} from '~components/BaseMenu/BaseMenuItem/tokens';
import { useTheme } from '~utils';
import type { Theme } from '~components/BladeProvider';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Divider } from '~components/Divider';
import { BaseBox } from '~components/Box/BaseBox';
import { metaAttribute } from '~utils/metaAttribute';

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

    const filteredItems = childrenArray
      .map((item, index) => {
        if (getComponentId(item) === componentIds.ActionListSection) {
          const itemsToRender = [];
          // add ActionListSectionTitle the items to render
          itemsToRender.push(
            <ActionListSectionTitle
              key={index}
              // @ts-expect-error: props does exist
              title={item?.props.title}
              isInsideVirtualizedList
            />,
          );
          // @ts-expect-error: props does exist
          itemsToRender.push(item?.props.children);
          if (index !== childrenArray.length - 1) {
            itemsToRender.push(
              <BaseBox {...metaAttribute({ name: 'DividerContainer' })} key={`divider-${index}`}>
                <Divider marginX="spacing.3" marginY="spacing.1" />
              </BaseBox>,
            );
          }
          return itemsToRender;
        }
        return item;
      })
      .flat(Infinity)
      .filter(
        (item) =>
          filteredValues.includes(item.props.value) ||
          getComponentId(item) === componentIds.ActionListSectionTitle ||
          item.props['data-blade-component'] === 'DividerContainer',
      );
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
        // in case of virtualized list, we only render visible items. so css will hide divider for every last item visible. instead of hiding the last divider of the list.
        hideLastDivider={false}
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
            itemSize={(index) => {
              if (getComponentId(itemData[index]) === componentIds.ActionListItem) {
                return itemHeight;
              }

              if (getComponentId(itemData[index]) === componentIds.ActionListSectionTitle) {
                return actionListSectionTitleHeight;
              }

              return 1;
            }}
            itemCount={itemCount}
            itemData={itemData}
            itemKey={(index) =>
              // @ts-expect-error: props does exist
              itemData[index]?.props.value ||
              // @ts-expect-error: props does exist
              itemData[index]?.props.title ||
              // @ts-expect-error: props does exist
              itemData[index]?.props.key
            }
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
