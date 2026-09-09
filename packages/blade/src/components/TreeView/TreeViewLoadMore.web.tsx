import React from 'react';
import { componentIds } from './componentIds';
import type { TreeViewLoadMoreProps } from './types';
import { TreeViewParentContext, useTreeViewContext } from './useTreeView';
import { StyledTreeViewRow } from './StyledTreeViewRow.web';
import { TreeViewRowMountAnimator } from './TreeViewAnimator.web';
import { DEFAULT_LOAD_MORE_LABEL } from './treeViewUtils';
import BaseBox from '~components/Box/BaseBox';
import { BaseMenuItem } from '~components/BaseMenu';
import { itemFirstRowHeight } from '~components/BaseMenu/BaseMenuItem/tokens';
import { Spinner } from '~components/Spinner';
import { Text } from '~components/Typography';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

const _TreeViewLoadMore = (props: TreeViewLoadMoreProps): React.ReactElement | null => {
  const {
    isInsideDropdown,
    nodeMap,
    tabbableValue,
    onDropdownNodeClick,
    registerRowRef,
    setFocusedValue,
  } = useTreeViewContext();
  const {
    dropdownBaseId,
    activeIndex,
    isKeydownPressed,
    setShouldIgnoreBlurAnimation,
  } = useDropdown();
  const parentValue = React.useContext(TreeViewParentContext);

  // loadMore rows have no consumer-facing value, so we find our synthetic node
  // in the registry by parent (TreeView dev-warns on more than one per branch)
  const node = Object.values(nodeMap).find(
    (registryNode) => registryNode.kind === 'loadMore' && registryNode.parentValue === parentValue,
  );

  if (!node) {
    return null;
  }

  const handleRowClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (node.isDisabled) {
      return;
    }
    if (isInsideDropdown) {
      onDropdownNodeClick(event, node.value);
      return;
    }
    if (!props.isLoading) {
      props.onClick();
    }
  };

  return (
    <TreeViewRowMountAnimator>
      <StyledTreeViewRow level={node.level}>
        <BaseMenuItem
          ref={(element) => registerRowRef(node.value, element as HTMLElement | null)}
          // div row, same as TreeViewItem (treeitem role is not permitted on button)
          id={
            isInsideDropdown && node.optionIndex >= 0
              ? `${dropdownBaseId}-${node.optionIndex}`
              : undefined
          }
          tabIndex={!isInsideDropdown && tabbableValue === node.value ? 0 : -1}
          isDisabled={node.isDisabled}
          className={
            isInsideDropdown && node.optionIndex >= 0 && activeIndex === node.optionIndex
              ? 'active-focus'
              : ''
          }
          isKeydownPressed={isInsideDropdown ? isKeydownPressed : undefined}
          onClick={handleRowClick}
          onFocus={() => {
            if (!isInsideDropdown) {
              setFocusedValue(node.value);
            }
          }}
          onMouseDown={() => {
            if (isInsideDropdown) {
              setShouldIgnoreBlurAnimation(true);
            }
          }}
          onMouseUp={() => {
            if (isInsideDropdown) {
              setShouldIgnoreBlurAnimation(false);
            }
          }}
          data-value={node.value}
          data-tree-node-value={node.value}
          {...makeAccessible({
            role: 'treeitem',
            level: node.level,
            posInSet: node.posInSet,
            setSize: node.setSize,
            busy: props.isLoading ? true : undefined,
          })}
          {...metaAttribute({ name: MetaConstants.TreeViewLoadMore, testID: props.testID })}
          {...makeAnalyticsAttribute(props)}
        >
          {/* B7: no chevron and no checkbox of its own - the label is offset by one
            chevron slot (20px + the 4px gap after it) so it lines up with the content
            of sibling rows (Figma: TreeViewItem/LoadMore) */}
          {props.isLoading ? (
            <BaseBox
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap="spacing.3"
              paddingLeft="spacing.7"
              height={makeSize(itemFirstRowHeight)}
            >
              {/* the row itself is aria-busy and the "Loading..." text is the announcement; the spinner is decorative */}
              <BaseBox display="flex" alignItems="center" {...makeAccessible({ hidden: true })}>
                <Spinner accessibilityLabel="Loading" size="medium" color="neutral" />
              </BaseBox>
              <Text size="medium" color="interactive.text.gray.muted">
                Loading...
              </Text>
            </BaseBox>
          ) : (
            <BaseBox
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingLeft="spacing.7"
              height={makeSize(itemFirstRowHeight)}
            >
              <Text
                size="medium"
                weight="medium"
                color={
                  node.isDisabled
                    ? 'interactive.text.gray.disabled'
                    : 'interactive.text.primary.normal'
                }
              >
                {props.children ?? DEFAULT_LOAD_MORE_LABEL}
              </Text>
            </BaseBox>
          )}
        </BaseMenuItem>
      </StyledTreeViewRow>
    </TreeViewRowMountAnimator>
  );
};

/**
 * ### TreeViewLoadMore
 *
 * Non-selectable action row inside `TreeView` for loading more items on demand.
 * Can be placed at any depth including the root, as the last child of its branch.
 *
 * #### Usage
 *
 * ```jsx
 * <TreeViewItem title="Karnataka" value="karnataka">
 *   <TreeViewItem title="Bengaluru" value="bengaluru" />
 *   <TreeViewLoadMore onClick={loadMoreCities} isLoading={isLoadingCities} />
 * </TreeViewItem>
 * ```
 */
const TreeViewLoadMore = assignWithoutSideEffects(_TreeViewLoadMore, {
  componentId: componentIds.TreeViewLoadMore,
  displayName: componentIds.TreeViewLoadMore,
});

export { TreeViewLoadMore };
