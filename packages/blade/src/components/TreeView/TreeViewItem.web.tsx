import React from 'react';
import { componentIds } from './componentIds';
import type { TreeViewItemProps } from './types';
import { TreeViewParentContext, useTreeViewContext } from './useTreeView';
import { TreeViewChevron } from './TreeViewChevron.web';
import type { TreeViewChevronState } from './TreeViewChevron.web';
import { StyledTreeViewRow } from './StyledTreeViewRow.web';
import { TreeViewGroupAnimator, TreeViewRowMountAnimator } from './TreeViewAnimator.web';
import { getBranchSelectionState } from './treeViewUtils';
import BaseBox from '~components/Box/BaseBox';
import { BaseMenuItem } from '~components/BaseMenu';
import { itemFirstRowHeight } from '~components/BaseMenu/BaseMenuItem/tokens';
import { Checkbox } from '~components/Checkbox';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { getTextProps, Text } from '~components/Typography';
import { BaseText } from '~components/Typography/BaseText';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTruncationTitle } from '~utils/useTruncationTitle';

const TreeViewItemCheckbox = ({
  isChecked,
  isIndeterminate,
  isDisabled,
}: {
  isChecked: boolean;
  isIndeterminate: boolean;
  isDisabled: boolean;
}): React.ReactElement => {
  return (
    <BaseBox
      pointerEvents="none"
      // the treeitem row itself announces the checked state (aria-checked), the visual checkbox is decorative
      {...makeAccessible({ hidden: true })}
    >
      <Checkbox
        isChecked={isChecked}
        isIndeterminate={isIndeterminate}
        isDisabled={isDisabled}
        tabIndex={-1}
      >
        {null}
      </Checkbox>
    </BaseBox>
  );
};

const _TreeViewItem = (props: TreeViewItemProps): React.ReactElement | null => {
  const {
    selectionType,
    isInsideDropdown,
    nodeMap,
    selectedValuesSet,
    expandedValues,
    tabbableValue,
    onNodeSelect,
    onNodeExpandToggle,
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
  const { containerRef, textRef } = useTruncationTitle({ content: props.title });

  // distinguishes a children group mounting on the row's very first render (initial tree
  // mount with defaultIsExpanded -> render statically) from one mounting later
  // (async children arriving on an expanded branch -> animate open)
  const isRowFirstRenderRef = React.useRef(true);
  React.useEffect(() => {
    isRowFirstRenderRef.current = false;
  }, []);

  const node = nodeMap[props.value];

  if (!node) {
    // can only happen with invalid usage (e.g. duplicate values in production builds)
    return null;
  }

  const isExpanded = expandedValues.has(props.value);
  const chevronState: TreeViewChevronState = !node.isBranch
    ? 'leaf'
    : node.isLoading
    ? 'loading'
    : isExpanded
    ? 'expanded'
    : 'collapsed';

  const branchSelectionState =
    selectionType === 'multiple' && node.isBranch
      ? getBranchSelectionState(node, selectedValuesSet)
      : undefined;

  const isSelected =
    node.isSelectable &&
    (selectionType === 'multiple'
      ? node.isBranch
        ? branchSelectionState === 'all'
        : selectedValuesSet.has(props.value)
      : selectedValuesSet.has(props.value));

  const handleChevronClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    // chevron click toggles expansion, never selects (B5)
    event.stopPropagation();
    onNodeExpandToggle(props.value);
  };

  const handleRowClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    if (node.isDisabled) {
      return;
    }
    if (isInsideDropdown) {
      onDropdownNodeClick(event, props.value);
      props.onClick?.({ name: props.value, value: isSelected, event });
    } else {
      onNodeSelect(props.value);
      props.onClick?.({ name: props.value, value: isSelected, event });
    }
  };

  // Figma layout: [20px chevron slot] -4px- [checkbox] -8px- [leading] -8px- [title]
  // The chevron slot is reserved on every row (empty on leaves), so rows of the
  // same level line up whether or not they have children
  const rowContent = (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      gap="spacing.2"
      width="100%"
    >
      <TreeViewChevron
        state={chevronState}
        isDisabled={node.isDisabled}
        onClick={handleChevronClick}
      />
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        gap="spacing.3"
        flexGrow={1}
        minWidth="0px"
      >
        {selectionType === 'multiple' && node.isSelectable ? (
          <BaseBox
            display="flex"
            alignItems="center"
            height={makeSize(itemFirstRowHeight)}
            flexShrink={0}
          >
            <TreeViewItemCheckbox
              isChecked={isSelected}
              isIndeterminate={branchSelectionState === 'some'}
              isDisabled={node.isDisabled}
            />
          </BaseBox>
        ) : null}
        {props.leading ? (
          <BaseBox
            display="flex"
            alignItems="center"
            height={makeSize(itemFirstRowHeight)}
            flexShrink={0}
          >
            {props.leading}
          </BaseBox>
        ) : null}
        <BaseBox display="flex" flexDirection="column" flexGrow={1} minWidth="0px">
          <BaseBox
            display="flex"
            alignItems="center"
            height={makeSize(itemFirstRowHeight)}
            ref={containerRef as never}
          >
            <BaseText
              as="p"
              ref={textRef as never}
              truncateAfterLines={1}
              wordBreak="break-all"
              {...getTextProps({
                size: 'medium',
                color: node.isDisabled
                  ? 'interactive.text.gray.disabled'
                  : 'interactive.text.gray.normal',
                weight: 'regular',
              })}
            >
              {props.title}
            </BaseText>
          </BaseBox>
          {props.description ? (
            <Text
              size="small"
              color={
                node.isDisabled ? 'interactive.text.gray.disabled' : 'interactive.text.gray.muted'
              }
            >
              {props.description}
            </Text>
          ) : null}
        </BaseBox>
        {props.trailing ? (
          <BaseBox
            display="flex"
            alignItems="center"
            height={makeSize(itemFirstRowHeight)}
            flexShrink={0}
            marginLeft="auto"
          >
            {props.trailing}
          </BaseBox>
        ) : null}
      </BaseBox>
    </BaseBox>
  );

  return (
    // animates the row's own mount when it was appended into an existing tree
    // (e.g. through TreeViewLoadMore); no-op on initial mounts
    <TreeViewRowMountAnimator>
      <StyledTreeViewRow
        level={node.level}
        {...metaAttribute({ name: MetaConstants.TreeViewItem, testID: props.testID })}
      >
        <BaseMenuItem
          ref={(element) => registerRowRef(props.value, element as HTMLElement | null)}
          // rows render as div (not button): role=treeitem is not a permitted role on button
          // (axe aria-allowed-role); disabled behaviour is handled in the click/keyboard guards
          id={
            isInsideDropdown && node.optionIndex >= 0
              ? `${dropdownBaseId}-${node.optionIndex}`
              : undefined
          }
          tabIndex={!isInsideDropdown && tabbableValue === props.value ? 0 : -1}
          isSelected={
            selectionType === 'single' && !node.isDisabled && node.isSelectable
              ? isSelected
              : undefined
          }
          isDisabled={node.isDisabled}
          selectionType={selectionType}
          className={
            isInsideDropdown && node.optionIndex >= 0 && activeIndex === node.optionIndex
              ? 'active-focus'
              : ''
          }
          isKeydownPressed={isInsideDropdown ? isKeydownPressed : undefined}
          onClick={handleRowClick}
          onFocus={() => {
            if (!isInsideDropdown) {
              setFocusedValue(props.value);
            }
          }}
          onMouseDown={() => {
            if (isInsideDropdown) {
              // keep focus on Dropdown's trigger while the row is being clicked (same as ActionListItem)
              setShouldIgnoreBlurAnimation(true);
            }
          }}
          onMouseUp={() => {
            if (isInsideDropdown) {
              setShouldIgnoreBlurAnimation(false);
            }
          }}
          data-value={props.value}
          data-tree-node-value={props.value}
          {...makeAccessible({
            role: 'treeitem',
            expanded: node.isBranch ? isExpanded : undefined,
            level: node.level,
            posInSet: node.posInSet,
            setSize: node.setSize,
            // a non-selectable branch carries no selection semantics at all
            selected:
              selectionType === 'single' && !node.isDisabled && node.isSelectable
                ? isSelected
                : undefined,
            checked:
              selectionType === 'multiple' && !node.isDisabled && node.isSelectable
                ? node.isBranch
                  ? branchSelectionState === 'some'
                    ? 'mixed'
                    : branchSelectionState === 'all'
                  : selectedValuesSet.has(props.value)
                : undefined,
            disabled: node.isDisabled ? true : undefined,
          })}
          {...makeAnalyticsAttribute(props)}
        >
          {rowContent}
        </BaseMenuItem>
        {node.hasRenderedChildren ? (
          <TreeViewGroupAnimator
            isExpanded={isExpanded}
            shouldAnimateMount={!isRowFirstRenderRef.current}
          >
            {/* B8: indentation is applied on each row's own padding-left (StyledTreeViewRow),
                not on this group, so row backgrounds stay full-bleed */}
            <BaseBox {...makeAccessible({ role: 'group' })}>
              <TreeViewParentContext.Provider value={props.value}>
                {props.children}
              </TreeViewParentContext.Provider>
            </BaseBox>
          </TreeViewGroupAnimator>
        ) : null}
      </StyledTreeViewRow>
    </TreeViewRowMountAnimator>
  );
};

/**
 * ### TreeViewItem
 *
 * Creates a row inside `TreeView`. Nest `TreeViewItem` inside another `TreeViewItem`
 * to create a hierarchy - nesting defines depth.
 *
 * #### Usage
 *
 * ```jsx
 * <TreeView selectionType="multiple">
 *   <TreeViewItem title="India" value="india">
 *     <TreeViewItem title="Karnataka" value="karnataka">
 *       <TreeViewItem title="Bengaluru" value="bengaluru" />
 *     </TreeViewItem>
 *   </TreeViewItem>
 * </TreeView>
 * ```
 */
const TreeViewItem = assignWithoutSideEffects(_TreeViewItem, {
  componentId: componentIds.TreeViewItem,
  displayName: componentIds.TreeViewItem,
});

export { TreeViewItem };
