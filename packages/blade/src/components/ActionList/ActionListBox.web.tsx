/* eslint-disable react/display-name */
import React from 'react';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import type { SectionData } from './actionListUtils';
import { makeAccessible } from '~utils';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import { useBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';

type ActionListBoxProps = {
  childrenWithId?: React.ReactNode[] | null;
  sectionData: SectionData;
  actionListItemWrapperRole: 'listbox' | 'menu' | undefined;
  isMultiSelectable: boolean;
  isInBottomSheet?: boolean;
};

const _ActionListBox = React.forwardRef<HTMLDivElement, ActionListBoxProps>(
  ({ childrenWithId, actionListItemWrapperRole, isMultiSelectable }, ref) => {
    const { isInBottomSheet } = useBottomSheetContext();

    return (
      <StyledListBoxWrapper
        isInBottomSheet={Boolean(isInBottomSheet)}
        ref={ref}
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
      >
        {childrenWithId}
      </StyledListBoxWrapper>
    );
  },
);

const ActionListBox = assignWithoutSideEffects(_ActionListBox, { displayName: 'ActionListBox' });

export { ActionListBox };
