/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import type { SectionList } from 'react-native';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import { ActionListItem, ActionListSection, ActionListSectionDivider } from './ActionListItem';
import type { SectionData } from './actionListUtils';
import { makeAccessible } from '~utils';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

type ActionListBoxProps = {
  childrenWithId: React.ReactNode[] | null;
  sectionData: SectionData;
  actionListItemWrapperRole: 'listbox' | 'menu' | undefined;
  isMultiSelectable: boolean;
};

const _ActionListBox = React.forwardRef<SectionList, ActionListBoxProps>(
  ({ sectionData, actionListItemWrapperRole, isMultiSelectable }, ref) => {
    const renderActionListItem = React.useCallback(({ item }) => {
      return <ActionListItem {...item} />;
    }, []);

    const renderActionListSectionHeader = React.useCallback(({ section: { title } }) => {
      if (!title) return null;
      return <ActionListSection title={title} _hideDivider={true} children={undefined} />;
    }, []);

    const renderActionListSectionDivider = React.useCallback(
      ({ section: { title, hideDivider } }) => {
        if (!title) return null;
        if (hideDivider) return null;
        return <ActionListSectionDivider />;
      },
      [],
    );

    return (
      <StyledListBoxWrapper
        sections={sectionData}
        windowSize={5}
        initialNumToRender={5}
        bouncesZoom={false}
        bounces={false}
        keyExtractor={(item: any) => {
          return item.value;
        }}
        renderSectionHeader={renderActionListSectionHeader}
        renderSectionFooter={renderActionListSectionDivider}
        renderItem={renderActionListItem}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
      />
    );
  },
);

const ActionListBox = assignWithoutSideEffects(_ActionListBox, { displayName: 'ActionListBox' });

export { ActionListBox };
