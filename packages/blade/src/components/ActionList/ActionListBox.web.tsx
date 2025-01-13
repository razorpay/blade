/* eslint-disable react/display-name */
import React from 'react';
import { FixedSizeList as VirtualizedList } from 'react-window';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import type { SectionData } from './actionListUtils';
import { useBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type ActionListBoxProps = {
  childrenWithId?: React.ReactNode[] | null;
  sectionData: SectionData;
  actionListItemWrapperRole: 'listbox' | 'menu' | undefined;
  isMultiSelectable: boolean;
  isInBottomSheet: boolean;
} & DataAnalyticsAttribute;

const _ActionListBox = React.forwardRef<HTMLDivElement, ActionListBoxProps>(
  ({ childrenWithId, actionListItemWrapperRole, isMultiSelectable, ...rest }, ref) => {
    const items = React.Children.toArray(childrenWithId); // Convert children to an array
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
        {/* {childrenWithId} */}
        <VirtualizedList height={284} width="100%" itemSize={40} itemCount={items.length}>
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

const ActionListBox = assignWithoutSideEffects(React.memo(_ActionListBox), {
  displayName: 'ActionListBox',
});

export { ActionListBox };
