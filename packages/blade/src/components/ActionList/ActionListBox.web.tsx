/* eslint-disable react/display-name */
import React from 'react';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import type { SectionData } from './actionListUtils';
import { makeAccessible } from '~utils';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

type ActionListBoxProps = {
  childrenWithId?: React.ReactNode[] | null;
  sectionData: SectionData;
  actionListItemWrapperRole: 'listbox' | 'menu' | undefined;
  isMultiSelectable: boolean;
};

const _ActionListBox = React.forwardRef<HTMLDivElement, ActionListBoxProps>(
  ({ childrenWithId, actionListItemWrapperRole, isMultiSelectable }, ref) => {
    return (
      <StyledListBoxWrapper
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
