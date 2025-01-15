/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
import React from 'react';
import { BottomSheetSectionList as GorhomBottomSheetSectionList } from '@gorhom/bottom-sheet';
import { SectionList } from 'react-native';
import { StyledListBoxWrapper } from './styles/StyledListBoxWrapper';
import { ActionListItem, ActionListSection } from './ActionListItem';
import type { SectionData } from './actionListUtils';
import { useBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { Divider } from '~components/Divider';

type ActionListBoxProps = {
  childrenWithId?: React.ReactNode[] | null;
  sectionData: SectionData;
  actionListItemWrapperRole: 'listbox' | 'menu' | undefined;
  isMultiSelectable: boolean;
  isInBottomSheet: boolean;
};

const _ActionListBox = React.forwardRef<SectionList, ActionListBoxProps>(
  ({ sectionData, actionListItemWrapperRole, isMultiSelectable, isInBottomSheet }, ref) => {
    const { footerHeight, setContentHeight } = useBottomSheetContext();

    const renderActionListItem = React.useCallback(({ item }: any) => {
      return <ActionListItem {...item} />;
    }, []);

    const renderActionListSectionHeader = React.useCallback(({ section: { title } }: any) => {
      if (!title) return null;
      return <ActionListSection title={title} _hideDivider={true} children={undefined} />;
    }, []);

    const renderActionListSectionDivider = React.useCallback(
      ({ section: { title, hideDivider } }: any) => {
        if (!title) return null;
        if (hideDivider) return null;
        return <Divider />;
      },
      [],
    );

    return (
      <StyledListBoxWrapper
        // Render either the Gorhom or RN Section list depending on where we are
        // We can't simply use RNSectionList because GorhomSectionList handles extra bottomsheet specific logic internally
        as={isInBottomSheet ? GorhomBottomSheetSectionList : SectionList}
        isInBottomSheet={Boolean(isInBottomSheet)}
        // Setting footerHeight as bottom margin for ActionListBox
        // otherwise the footer hides few list items under it, this will offset it
        marginBottom={footerHeight}
        sections={sectionData}
        windowSize={5}
        keyExtractor={(item: any) => {
          return item.value;
        }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={renderActionListSectionHeader}
        renderSectionFooter={renderActionListSectionDivider}
        renderItem={renderActionListItem}
        ref={ref as any}
        onContentSizeChange={(_width, height) => {
          setContentHeight(height);
        }}
        {...makeAccessible({
          role: actionListItemWrapperRole,
          multiSelectable: actionListItemWrapperRole === 'listbox' ? isMultiSelectable : undefined,
        })}
      />
    );
  },
);

const ActionListBox = assignWithoutSideEffects(_ActionListBox, { displayName: 'ActionListBox' });

export { ActionListBox, ActionListBox as ActionListVirtualizedBox };
