/* eslint-disable react/display-name */
import React, { useCallback } from 'react';
import type { VariableSizeList } from 'react-window';
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
  actionListDividerHeight,
  getActionListItemHeight,
} from '~components/BaseMenu/BaseMenuItem/tokens';
import { useTheme } from '~utils';
import type { Theme } from '~components/BladeProvider';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { Divider } from '~components/Divider';
import type { ActionListItemProps } from '~components/ActionList';

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
 *  get the height of the item based on the componentId
 */
const getItemHeight = ({
  index,
  itemData,
  actionListItemHeight,
}: {
  index: number;
  itemData: React.ReactNode[];
  actionListItemHeight: number;
}): number => {
  if (getComponentId(itemData[index]) === componentIds.ActionListItem) {
    return actionListItemHeight;
  }

  if (getComponentId(itemData[index]) === componentIds.ActionListSectionTitle) {
    return actionListSectionTitleHeight;
  }
  // @ts-expect-error: key does exist
  if (itemData[index]?.key.includes('divider')) {
    return actionListDividerHeight;
  }
  return 0;
};

/**
 * Returns the height of item and height of container based on theme and device
 */
const getVirtualItemParams = ({
  theme,
  isMobile,
  itemCount,
  itemData,
}: {
  theme: Theme;
  isMobile: boolean;
  itemCount: number;
  itemData: React.ReactNode[];
}): {
  actionListItemHeight: number;
  actionListBoxHeight: number;
} => {
  const itemHeightResponsive = getActionListItemHeight(theme);
  const actionListPadding = getActionListPadding(theme);
  const actionListItemHeight = isMobile
    ? itemHeightResponsive.itemHeightMobile
    : itemHeightResponsive.itemHeightDesktop;
  const shouldCalculateMinimumHeight = itemCount <= 10;
  const actionListBoxHeight = actionListMaxHeight - actionListPadding * 2;
  const actionListBoxMinHeight = shouldCalculateMinimumHeight
    ? itemData.reduce<number>((acc, _, index) => {
        const itemHeight = getItemHeight({ index, itemData, actionListItemHeight });
        return acc + itemHeight;
      }, 0)
    : actionListBoxHeight;
  
  // Ensure minimum usable height for better visibility, especially when few items are present
  const minimumUsableHeight = actionListItemHeight * 3; // Show at least 3 items worth of height
  const finalActionListBoxHeight = Math.min(
    actionListBoxHeight, 
    Math.max(actionListBoxMinHeight, minimumUsableHeight)
  );

  return {
    actionListItemHeight,
    actionListBoxHeight: finalActionListBoxHeight,
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

  const { filteredValues, hasAutoCompleteInHeader, dropdownTriggerer } = useDropdown();

  const items = React.useMemo(() => {
    const hasAutoComplete =
      hasAutoCompleteInHeader || dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete;

    if (!hasAutoComplete) {
      return childrenArray;
    }

    const filteredItems = childrenArray.reduce<React.ReactNode[]>((acc, item, index) => {
      if (getComponentId(item) === componentIds.ActionListSection) {
        const sectionTitle = (
          <ActionListSectionTitle
            key={index}
            // @ts-expect-error: props does exist
            title={item?.props.title}
            isInsideVirtualizedList
          />
        );
        // @ts-expect-error: props does exist
        const sectionChildren = item?.props.children;

        const divider =
          index !== childrenArray.length - 1 ? (
            <Divider marginX="spacing.3" marginY="spacing.1" key={`divider-${index}`} />
          ) : null;
        const filteredSectionChildren = sectionChildren.filter(
          (item: { props: { value: string } }) => filteredValues.includes(item.props.value),
        );
        if (filteredSectionChildren.length !== 0) {
          acc.push(sectionTitle, ...filteredSectionChildren, divider);
        }
      } else {
        // @ts-expect-error: props does exist
        const value = item?.props.value;
        if (filteredValues.includes(value)) {
          acc.push(item);
        }
      }
      return acc;
    }, []);

    return filteredItems;
  }, [filteredValues, hasAutoCompleteInHeader, dropdownTriggerer, childrenArray]);

  return {
    itemData: items,
    itemCount: items.length,
  };
};

const VirtualListItem = React.memo(
  ({
    index,
    style,
    data,
    onVirtualizedFocus,
  }: {
    index: number;
    style: React.CSSProperties;
    data: React.ReactNode[];
    onVirtualizedFocus: (index: number) => void;
  }): React.ReactElement | null => {
    const currentItem = data[index];

    if (
      React.isValidElement(currentItem) &&
      getComponentId(currentItem) === componentIds.ActionListItem
    ) {
      // Clone the element passed via `data` and add the `_virtualizedIndex` prop
      const elementWithIndex = React.cloneElement(
        currentItem as React.ReactElement<ActionListItemProps>,
        {
          _virtualizedIndex: index,
          _onVirtualizedFocus: onVirtualizedFocus,
        },
      );

      return <div style={style}>{elementWithIndex}</div>;
    }

    return <div style={style}>{data[index]}</div>;
  },
  (prevProps, nextProps) => {
    // Custom comparison function to determine if component should update
    return (
      prevProps.index === nextProps.index &&
      prevProps.style === nextProps.style &&
      prevProps.data[prevProps.index] === nextProps.data[nextProps.index]
    );
  },
);

const _ActionListVirtualizedBox = React.forwardRef<HTMLDivElement, ActionListBoxProps>(
  ({ childrenWithId, actionListItemWrapperRole, isMultiSelectable, ...rest }, ref) => {
    const virtualizedListRef = React.useRef<VariableSizeList>(null);
    const [visibleStartIndex, setVisibleStartIndex] = React.useState(0);
    const [visibleStopIndex, setVisibleStopIndex] = React.useState(0);
    const items = React.Children.toArray(childrenWithId); // Convert children to an array
    const { isInBottomSheet } = useBottomSheetContext();
    const { itemData, itemCount } = useFilteredItems(items);

    const isMobile = useIsMobile();
    const { theme } = useTheme();
    const { actionListItemHeight, actionListBoxHeight } = React.useMemo(
      () => getVirtualItemParams({ theme, isMobile, itemCount, itemData }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [theme.name, isMobile, itemCount, itemData],
    );
    React.useEffect(() => {
      virtualizedListRef?.current?.resetAfterIndex(0);
      virtualizedListRef?.current?.scrollToItem(0);
    }, [itemCount]);

    return (
      <StyledListBoxWrapper
        isInBottomSheet={isInBottomSheet}
        // in case of virtualized list, we only render visible items. so css will hide divider for every last item visible. instead of hiding the last divider of the list.
        ref={ref}
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
        {...makeAnalyticsAttribute(rest)}
      >
        <VirtualizedList<React.ReactNode[]>
          ref={virtualizedListRef}
          height={actionListBoxHeight}
          width="100%"
          itemSize={(index) => getItemHeight({ index, itemData, actionListItemHeight })}
          itemCount={itemCount}
          itemData={itemData}
          itemKey={(index) =>
            // @ts-expect-error: props does exist
            itemData[index]?.props.value ??
            // @ts-expect-error: props does exist
            itemData[index]?.props.title ??
            // @ts-expect-error: props does exist
            itemData[index]?.props.key
          }
          onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
            setVisibleStartIndex(visibleStartIndex);
            setVisibleStopIndex(visibleStopIndex);
          }}
        >
          {useCallback(
            ({ index, style, data }) => {
              return (
                <VirtualListItem
                  index={index}
                  style={style}
                  data={data}
                  onVirtualizedFocus={(index) => {
                    // We need scroll Direction to determine the index to focus
                    const scrollDirection =
                      Math.round((visibleStartIndex + visibleStopIndex) / 2) > index
                        ? 'top'
                        : 'bottom';
                    virtualizedListRef?.current?.resetAfterIndex(0);
                    /**
                     * we are scrolling to the item which is 3 items away from the current item.
                     * since we can have 2 item sectoin header and divider which are not focusable.
                     */
                    virtualizedListRef?.current?.scrollToItem(
                      index + (scrollDirection === 'top' ? -3 : 3),
                      'smart',
                    );
                  }}
                />
              );
            },
            [visibleStartIndex, visibleStopIndex],
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
