import React from 'react';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { ChevronRightIcon } from '~components/Icons';
import { Spinner } from '~components/Spinner';
import { size } from '~tokens/global';
import { castWebType, makeSize } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { makeMotionTime } from '~utils/makeMotionTime';

const CHEVRON_GUTTER_SIZE = size[20];

type TreeViewChevronState = 'collapsed' | 'expanded' | 'loading';

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
 * Internal chevron slot of branch TreeViewItems: a 20px slot with a 16px chevron
 * (or Spinner while loading). Together with the 4px gap after it, the slot spans
 * exactly one indentation step, so a branch's content starts at the child column (B9).
 * Leaf rows don't render this slot at all - their content sits flush at the indentation
 */
const TreeViewChevron = ({
  state,
  isDisabled,
  onClick,
}: TreeViewChevronProps): React.ReactElement => {
  const isExpandable = state === 'collapsed' || state === 'expanded';

  return (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      width={makeSize(CHEVRON_GUTTER_SIZE)}
      height={makeSize(CHEVRON_GUTTER_SIZE)}
      flexShrink={0}
      onClick={isExpandable && !isDisabled ? castWebType(onClick) : undefined}
      // treeitem's aria-expanded carries the expansion semantics; the chevron is decorative
      {...makeAccessible({ hidden: true })}
    >
      {state === 'loading' ? <Spinner accessibilityLabel="Loading" size="medium" /> : null}
      {isExpandable ? (
        <StyledChevronRotator isExpanded={state === 'expanded'}>
          <ChevronRightIcon
            size="medium"
            color={isDisabled ? 'interactive.icon.gray.disabled' : 'interactive.icon.gray.muted'}
          />
        </StyledChevronRotator>
      ) : null}
    </BaseBox>
  );
};

export { TreeViewChevron, CHEVRON_GUTTER_SIZE };
export type { TreeViewChevronState };
