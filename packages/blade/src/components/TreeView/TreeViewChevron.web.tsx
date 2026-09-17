import React from 'react';
import styled from 'styled-components';
import { treeViewTokens } from './treeViewTokens';
import { useTreeViewContext } from './useTreeView';
import BaseBox from '~components/Box/BaseBox';
import { ChevronRightIcon } from '~components/Icons';
import { Spinner } from '~components/Spinner';
import { castWebType, makeSize } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { makeMotionTime } from '~utils/makeMotionTime';

type TreeViewChevronState = 'collapsed' | 'expanded' | 'loading' | 'leaf';

type TreeViewChevronProps = {
  state: TreeViewChevronState;
  isDisabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

const StyledChevronRotator = styled(BaseBox)<{ isExpanded: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: props.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
  transition: `transform ${makeMotionTime(props.theme.motion.duration.quick)} ${castWebType(
    props.theme.motion.easing.standard,
  )}`,
}));

/**
 * Internal chevron slot of TreeViewItem: a 20px slot with a 16px chevron on `medium`
 * and a 16px slot with a 12px chevron on `small` (or a Spinner while loading).
 * Every row reserves the slot - on leaves it stays empty (B9) so a leaf's content
 * lines up with the content of its branch siblings
 */
const TreeViewChevron = ({
  state,
  isDisabled,
  onClick,
}: TreeViewChevronProps): React.ReactElement => {
  const { size } = useTreeViewContext();
  const { chevronSlotSize, chevronIconSize } = treeViewTokens[size];
  const isExpandable = state === 'collapsed' || state === 'expanded';

  return (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={makeSize(chevronSlotSize)}
      height={makeSize(chevronSlotSize)}
      flexShrink={0}
      onClick={isExpandable && !isDisabled ? castWebType(onClick) : undefined}
      // treeitem's aria-expanded carries the expansion semantics; the chevron is decorative
      {...makeAccessible({ hidden: true })}
    >
      {state === 'loading' ? <Spinner accessibilityLabel="Loading" size="medium" /> : null}
      {isExpandable ? (
        <StyledChevronRotator isExpanded={state === 'expanded'}>
          <ChevronRightIcon
            size={chevronIconSize}
            color={isDisabled ? 'interactive.icon.gray.disabled' : 'interactive.icon.gray.muted'}
          />
        </StyledChevronRotator>
      ) : null}
    </BaseBox>
  );
};

export { TreeViewChevron };
export type { TreeViewChevronState };
