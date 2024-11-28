/* eslint-disable react/display-name */
import React from 'react';
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

const ActionListBox = assignWithoutSideEffects(_ActionListBox, { displayName: 'ActionListBox' });

export { ActionListBox };
