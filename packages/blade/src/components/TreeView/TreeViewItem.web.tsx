import React from 'react';
import { componentIds } from './componentIds';
import type { TreeViewItemProps } from './types';
import { TreeViewParentContext, useTreeViewContext } from './useTreeView';
import { TreeViewChevron } from './TreeViewChevron.web';
import type { TreeViewChevronState } from './TreeViewChevron.web';
import { StyledTreeViewRow } from './StyledTreeViewRow.web';
import { TreeViewGroupAnimator, TreeViewRowMountAnimator } from './TreeViewAnimator.web';
import { getBranchSelectionState } from './treeViewUtils';
import type { TreeViewSize } from './treeViewTokens';
import { getItemFirstRowHeight, treeViewTokens } from './treeViewTokens';
import BaseBox from '~components/Box/BaseBox';
import { BaseMenuItem } from '~components/BaseMenu';
import { Checkbox } from '~components/Checkbox';
import { useTheme } from '~components/BladeProvider';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { getTextProps, Text } from '~components/Typography';
import { BaseText } from '~components/Typography/BaseText';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTruncationTitle } from '~utils/useTruncationTitle';
import { Tooltip } from '~components/Tooltip';
import { Popover } from '~components/Popover';
import { logger } from '~utils/logger';

const TreeViewItemCheckbox = ({
  isChecked,
  isIndeterminate,
  isDisabled,
  size,
}: {
  isChecked: boolean;
  isIndeterminate: boolean;
  isDisabled: boolean;
  size: TreeViewSize;
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
        size={treeViewTokens[size].checkboxSize}
        tabIndex={-1}
      >
        {null}
      </Checkbox>
    </BaseBox>
  );
};

/**
 * Wraps the treeitem row in a Tooltip, so it opens on hover and on keyboard focus and its
 * content is linked to the row through `aria-describedby`
 */
const TreeViewItemTooltip = ({
  tooltip,
  children,
}: Pick<TreeViewItemProps, 'tooltip'> & {
  children: React.ReactElement;
}): React.ReactElement => {
  if (!tooltip) {
    return children;
  }

  return (
    <Tooltip placement="right" {...tooltip}>
      {children}
    </Tooltip>
  );
};

/**
 * Hover Popover of an item.
 *
 * Popover writes `aria-expanded` / `aria-haspopup` / `aria-controls` on its trigger, so the
 * treeitem row cannot be the trigger: it would overwrite the row's own expanded state (and
 * make leaves announce as collapsed branches), and a wrapper around the row is not an allowed
 * child of `role="tree"`. Instead the Popover is anchored on an aria-hidden, non-interactive box
 * laid over the row content, and opened (controlled) from the row's own hover handlers
 */
const TreeViewItemPopover = ({
  popover,
  isOpen,
  onOpenChange,
}: {
  popover: NonNullable<TreeViewItemProps['popover']>;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}): React.ReactElement => {
  return (
    <Popover
      placement="right"
      {...popover}
      // 'hover' keeps focus on the row when the popover opens
      openInteraction="hover"
      isOpen={isOpen}
      onOpenChange={({ isOpen }) => onOpenChange(isOpen)}
    >
      <BaseBox
        position="absolute"
        top="0px"
        right="0px"
        bottom="0px"
        left="0px"
        pointerEvents="none"
        {...makeAccessible({ hidden: true })}
      />
    </Popover>
  );
};

const _TreeViewItem = (props: TreeViewItemProps): React.ReactElement | null => {
  const {
    selectionType,
    size,
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
  const { theme } = useTheme();
  const { containerRef, textRef } = useTruncationTitle({ content: props.title });
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  // mirrors isPopoverOpen for the delayed close, which runs after the render it was scheduled in
  const isPopoverOpenRef = React.useRef(false);
  const popoverCloseTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const itemFirstRowHeight = getItemFirstRowHeight(theme, size);

  // distinguishes a children group mounting on the row's very first render (initial tree
  // mount with defaultIsExpanded -> render statically) from one mounting later
  // (async children arriving on an expanded branch -> animate open)
  const isRowFirstRenderRef = React.useRef(true);
  React.useEffect(() => {
    isRowFirstRenderRef.current = false;
  }, []);

  const hasTooltip = Boolean(props.tooltip);
  const hasPopover = Boolean(props.popover);
  React.useEffect(() => {
    if (__DEV__ && hasTooltip && hasPopover) {
      logger({
        type: 'warn',
        moduleName: 'TreeViewItem',
        message:
          'Pass either `tooltip` or `popover` to TreeViewItem, not both. `tooltip` is ignored',
      });
    }
  }, [hasTooltip, hasPopover]);
  const tooltip = props.popover ? undefined : props.tooltip;

  const cancelPopoverClose = (): void => {
    clearTimeout(popoverCloseTimeoutRef.current);
    popoverCloseTimeoutRef.current = undefined;
  };
  React.useEffect(() => cancelPopoverClose, []);

  const handlePopoverOpenChange = (isOpen: boolean): void => {
    cancelPopoverClose();
    if (isOpen === isPopoverOpenRef.current) {
      return;
    }
    isPopoverOpenRef.current = isOpen;
    setIsPopoverOpen(isOpen);
    props.popover?.onOpenChange?.({ isOpen });
  };

  // The popover content is rendered in a portal, but it is still a React child of this row, so
  // React fires the row's pointerenter / pointerleave for it too: the pointer can travel from the
  // row onto the popover without closing it. The delay bridges the gap between the two
  const schedulePopoverClose = (): void => {
    cancelPopoverClose();
    popoverCloseTimeoutRef.current = setTimeout(
      () => handlePopoverOpenChange(false),
      theme.motion.delay.xquick,
    );
  };

  // Events from the popover content bubble through the React tree into this row (see above).
  // A click, focus or mousedown inside the popover must not select or focus the row
  const isEventFromRow = (event: React.SyntheticEvent): boolean =>
    event.currentTarget.contains(event.target as Node);

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
    if (node.isDisabled || !isEventFromRow(event)) {
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

  // Figma layout: [chevron slot] -4px- [checkbox] -8px- [leading] -8px- [title]
  // The chevron slot (20px on medium, 16px on small) is reserved on every row
  // (empty on leaves), so rows of the same level line up whether or not they have children
  const rowContent = (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      gap="spacing.2"
      width="100%"
      position={props.popover ? 'relative' : undefined}
    >
      {props.popover ? (
        <TreeViewItemPopover
          popover={props.popover}
          isOpen={isPopoverOpen}
          onOpenChange={handlePopoverOpenChange}
        />
      ) : null}
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
              size={size}
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
                // `variant` is required for `size` to be applied at all - getTextProps only
                // maps size to font tokens inside its `body` branch
                variant: 'body',
                size: treeViewTokens[size].titleTextSize,
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
        treeViewSize={size}
        {...metaAttribute({ name: MetaConstants.TreeViewItem, testID: props.testID })}
      >
        <TreeViewItemTooltip tooltip={tooltip}>
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
            onFocus={(event: React.FocusEvent) => {
              if (!isInsideDropdown && isEventFromRow(event)) {
                setFocusedValue(props.value);
              }
            }}
            onMouseDown={(event: React.MouseEvent) => {
              if (isInsideDropdown && isEventFromRow(event)) {
                // keep focus on Dropdown's trigger while the row is being clicked (same as ActionListItem)
                setShouldIgnoreBlurAnimation(true);
              }
            }}
            onMouseUp={(event: React.MouseEvent) => {
              if (isInsideDropdown && isEventFromRow(event)) {
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
            {...(props.popover
              ? {
                  // mouse only: on touch screens a tap would open the popover and select the
                  // row at once, and the popover would cover the rows below. Pointer events
                  // (not mouse events) are used because browsers also fire emulated mouse
                  // events after a tap, which carry no pointer type
                  onPointerEnter: (event: React.PointerEvent) => {
                    if (event.pointerType === 'mouse') {
                      handlePopoverOpenChange(true);
                    }
                  },
                  onPointerLeave: schedulePopoverClose,
                }
              : {})}
            {...(tooltip
              ? {
                  // Tooltip labels its trigger with the tooltip content by default (meant for
                  // icon-only triggers). A row already has a visible title, so keep that as the
                  // name - Tooltip still links its content through aria-describedby while open
                  'aria-label': undefined,
                }
              : {})}
          >
            {rowContent}
          </BaseMenuItem>
        </TreeViewItemTooltip>
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
