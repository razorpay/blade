import React from 'react';
import { componentIds } from './componentIds';
import type {
  BranchSelectionStateType,
  TreeViewDisplayOverrideType,
  TreeViewItemProps,
  TreeViewLoadMoreProps,
  TreeViewNodeType,
} from './types';
import type { OptionsType } from '~components/Dropdown/useDropdown';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { logger, throwBladeError } from '~utils/logger';

const treeViewAllowedChildren = [componentIds.TreeViewItem, componentIds.TreeViewLoadMore];

const TREEVIEW_MAX_RECOMMENDED_LEVEL = 3;
const DEFAULT_LOAD_MORE_LABEL = 'Show more';

/**
 * Internal value assigned to TreeViewLoadMore rows so they can participate
 * in the flat registration list without colliding with consumer values
 */
const makeLoadMoreValue = (parentValue: string | null, posInSet: number): string =>
  `__blade-tree-load-more__${parentValue ?? '$root'}__${posInSet}`;

const isTreeViewLoadMoreValue = (value: string): boolean =>
  value.startsWith('__blade-tree-load-more__');

type TreeViewPropertiesType = {
  /**
   * All rows in document order (including disabled subtrees, which render but are not registered)
   */
  orderedNodes: TreeViewNodeType[];
  nodeMap: Record<string, TreeViewNodeType>;
  /**
   * Values of the root level rows, in document order
   */
  rootValues: string[];
  /**
   * Flat registration list for Dropdown mode. Same shape as ActionList's options.
   * Contains every enabled row (branch, leaf, loadMore) in document order; disabled subtrees excluded
   */
  options: OptionsType;
  maxLevel: number;
};

/**
 * Walks the TreeView children and returns the normalized node registry,
 * the flat Dropdown registration list, and runs dev-time validations (B10)
 */
const getTreeViewProperties = (children: React.ReactNode): TreeViewPropertiesType => {
  const orderedNodes: TreeViewNodeType[] = [];
  const nodeMap: Record<string, TreeViewNodeType> = {};
  const rootValues: string[] = [];
  const options: OptionsType = [];
  let maxLevel = 0;

  const walkLevel = ({
    levelChildren,
    parentValue,
    level,
    isParentDisabled,
  }: {
    levelChildren: React.ReactNode;
    parentValue: string | null;
    level: number;
    isParentDisabled: boolean;
  }): { selectableLeafValues: string[]; childValues: string[] } => {
    const childArray = React.Children.toArray(levelChildren);
    const setSize = childArray.length;
    const selectableLeafValues: string[] = [];
    const childValues: string[] = [];
    let loadMoreCountInLevel = 0;

    if (level > maxLevel) {
      maxLevel = level;
    }

    childArray.forEach((child, childIndex) => {
      const childComponentId = getComponentId(child);
      if (
        !React.isValidElement(child) ||
        !childComponentId ||
        !treeViewAllowedChildren.includes(childComponentId)
      ) {
        throwBladeError({
          message: `Only ${treeViewAllowedChildren.join(', ')} are supported inside TreeView`,
          moduleName: 'TreeView',
        });
        return;
      }

      const posInSet = childIndex + 1;

      if (childComponentId === componentIds.TreeViewLoadMore) {
        const loadMoreProps = child.props as TreeViewLoadMoreProps;
        loadMoreCountInLevel++;
        if (__DEV__) {
          if (loadMoreCountInLevel > 1) {
            logger({
              type: 'warn',
              moduleName: 'TreeViewLoadMore',
              message: 'Only one TreeViewLoadMore is expected per branch',
            });
          }
          if (childIndex !== childArray.length - 1) {
            logger({
              type: 'warn',
              moduleName: 'TreeViewLoadMore',
              message: 'TreeViewLoadMore should be the last child of its branch',
            });
          }
        }

        const loadMoreValue = makeLoadMoreValue(parentValue, posInSet);
        const node: TreeViewNodeType = {
          kind: 'loadMore',
          title: loadMoreProps.children ?? DEFAULT_LOAD_MORE_LABEL,
          value: loadMoreValue,
          parentValue,
          level,
          posInSet,
          setSize,
          isDisabled: isParentDisabled,
          isBranch: false,
          isSelectable: false,
          hasRenderedChildren: false,
          defaultIsExpanded: false,
          isLoading: Boolean(loadMoreProps.isLoading),
          childValues: [],
          selectableLeafValues: [],
          optionIndex: -1,
        };

        if (!isParentDisabled) {
          options.push({
            title: node.title,
            value: loadMoreValue,
            onClickTrigger: () => {
              if (!loadMoreProps.isLoading) {
                loadMoreProps.onClick();
              }
            },
          });
          node.optionIndex = options.length - 1;
        }

        orderedNodes.push(node);
        nodeMap[loadMoreValue] = node;
        childValues.push(loadMoreValue);
        if (parentValue === null) {
          rootValues.push(loadMoreValue);
        }
        return;
      }

      // TreeViewItem
      const itemProps = child.props as TreeViewItemProps;
      const { title, value, isDisabled, hasChildren, onClick } = itemProps;

      if (nodeMap[value]) {
        throwBladeError({
          message: `Duplicate value "${value}" found in TreeViewItem. Values must be unique across the tree`,
          moduleName: 'TreeView',
        });
        return;
      }

      const effectiveDisabled = Boolean(isDisabled) || isParentDisabled;
      const hasRenderedChildren = React.Children.count(itemProps.children) > 0;
      const isBranch = hasRenderedChildren || Boolean(hasChildren);

      if (__DEV__ && itemProps.isSelectable === false && !isBranch) {
        logger({
          type: 'warn',
          moduleName: 'TreeViewItem',
          message: `isSelectable={false} on "${value}" is ignored. It is only supported on branch items - leaf items are always selectable`,
        });
      }

      const node: TreeViewNodeType = {
        kind: 'item',
        title,
        value,
        parentValue,
        level,
        posInSet,
        setSize,
        isDisabled: effectiveDisabled,
        isBranch,
        // leaves are always selectable; only branches can opt out
        isSelectable: !isBranch || itemProps.isSelectable !== false,
        hasRenderedChildren,
        defaultIsExpanded: Boolean(itemProps.defaultIsExpanded),
        controlledIsExpanded: itemProps.isExpanded,
        onExpandChange: itemProps.onExpandChange,
        isLoading: Boolean(itemProps.isLoading),
        childValues: [],
        selectableLeafValues: [],
        optionIndex: -1,
      };

      if (!effectiveDisabled) {
        options.push({
          title,
          value,
          onClickTrigger: (isSelected) => {
            onClick?.({ name: value, value: isSelected });
          },
        });
        node.optionIndex = options.length - 1;
      }

      orderedNodes.push(node);
      nodeMap[value] = node;
      childValues.push(value);
      if (parentValue === null) {
        rootValues.push(value);
      }

      if (hasRenderedChildren) {
        const subtree = walkLevel({
          levelChildren: itemProps.children,
          parentValue: value,
          level: level + 1,
          isParentDisabled: effectiveDisabled,
        });
        node.childValues = subtree.childValues;
        node.selectableLeafValues = subtree.selectableLeafValues;
      }

      if (isBranch) {
        selectableLeafValues.push(...node.selectableLeafValues);
      } else if (!effectiveDisabled) {
        selectableLeafValues.push(value);
      }
    });

    return { selectableLeafValues, childValues };
  };

  walkLevel({ levelChildren: children, parentValue: null, level: 1, isParentDisabled: false });

  if (__DEV__ && maxLevel > TREEVIEW_MAX_RECOMMENDED_LEVEL) {
    logger({
      type: 'warn',
      moduleName: 'TreeView',
      message: `TreeView is nested ${maxLevel} levels deep. Nesting beyond ${TREEVIEW_MAX_RECOMMENDED_LEVEL} levels is not recommended`,
    });
  }

  return { orderedNodes, nodeMap, rootValues, options, maxLevel };
};

/**
 * A selectable leaf is an enabled item without children (loaded or promised)
 */
const isSelectableLeaf = (node: TreeViewNodeType): boolean =>
  node.kind === 'item' && !node.isBranch && !node.isDisabled;

/**
 * Derived branch checkbox state (B2). Never stored.
 *
 * - 'all': every enabled, loaded, selectable leaf descendant is selected (disabled descendants are ignored)
 * - 'none': no selectable leaf descendant is selected (also for branches without loaded leaves)
 * - 'some': anything in between (renders as indeterminate)
 */
const getBranchSelectionState = (
  node: TreeViewNodeType,
  selectedValues: Set<string>,
): BranchSelectionStateType => {
  if (node.selectableLeafValues.length === 0) {
    return 'none';
  }

  let selectedCount = 0;
  for (const leafValue of node.selectableLeafValues) {
    if (selectedValues.has(leafValue)) {
      selectedCount++;
    }
  }

  if (selectedCount === 0) {
    return 'none';
  }

  if (selectedCount === node.selectableLeafValues.length) {
    return 'all';
  }

  return 'some';
};

/**
 * Values of the topmost fully-selected branches (B3).
 * When a branch is fully selected, its descendants branches are not included
 */
const getSelectedGroups = ({
  rootValues,
  nodeMap,
  selectedValues,
}: {
  rootValues: string[];
  nodeMap: Record<string, TreeViewNodeType>;
  selectedValues: Set<string>;
}): string[] => {
  const selectedGroups: string[] = [];

  const visit = (value: string): void => {
    const node = nodeMap[value];
    if (!node || node.kind === 'loadMore' || !node.isBranch || node.isDisabled) {
      return;
    }

    if (getBranchSelectionState(node, selectedValues) === 'all') {
      selectedGroups.push(value);
      return;
    }

    node.childValues.forEach(visit);
  };

  rootValues.forEach(visit);
  return selectedGroups;
};

/**
 * Selected leaf values in document order
 */
const getSelectedLeafValues = (
  orderedNodes: TreeViewNodeType[],
  selectedValues: Set<string>,
): string[] =>
  orderedNodes
    .filter((node) => isSelectableLeaf(node) && selectedValues.has(node.value))
    .map((node) => node.value);

/**
 * Smallest describing set for trigger display (D5):
 * topmost fully-selected branches count as 1 each, remaining selected leaves count individually.
 * Returns undefined when nothing is selected
 */
const getDisplayOverride = ({
  orderedNodes,
  rootValues,
  nodeMap,
  selectedValues,
}: {
  orderedNodes: TreeViewNodeType[];
  rootValues: string[];
  nodeMap: Record<string, TreeViewNodeType>;
  selectedValues: Set<string>;
}): TreeViewDisplayOverrideType | undefined => {
  const selectedGroups = getSelectedGroups({ rootValues, nodeMap, selectedValues });
  const coveredLeafValues = new Set(
    selectedGroups.flatMap((groupValue) => nodeMap[groupValue].selectableLeafValues),
  );

  const entries: TreeViewNodeType[] = [];
  // Walk in document order so groups and leaves stay in a stable, predictable order
  for (const node of orderedNodes) {
    if (selectedGroups.includes(node.value)) {
      entries.push(node);
    } else if (
      isSelectableLeaf(node) &&
      selectedValues.has(node.value) &&
      !coveredLeafValues.has(node.value)
    ) {
      entries.push(node);
    }
  }

  if (entries.length === 0) {
    return undefined;
  }

  return { label: entries[0].title, count: entries.length };
};

/**
 * Values of rows that are currently traversable: enabled and not hidden under a collapsed
 * (or disabled) ancestor. Used by the keyboard maps of both modes. LoadMore rows included
 */
const getVisibleValues = ({
  orderedNodes,
  nodeMap,
  expandedValues,
}: {
  orderedNodes: TreeViewNodeType[];
  nodeMap: Record<string, TreeViewNodeType>;
  expandedValues: Set<string>;
}): string[] => {
  const isVisible = (node: TreeViewNodeType): boolean => {
    if (node.isDisabled) {
      return false;
    }
    let parentValue = node.parentValue;
    while (parentValue !== null) {
      if (!expandedValues.has(parentValue)) {
        return false;
      }
      parentValue = nodeMap[parentValue]?.parentValue ?? null;
    }
    return true;
  };

  return orderedNodes.filter(isVisible).map((node) => node.value);
};

/**
 * Option indices (Dropdown mode) of currently visible rows, used for visibility-aware
 * keyboard traversal (mirrors AutoComplete's filteredValues mechanism)
 */
const getVisibleOptionIndices = ({
  orderedNodes,
  nodeMap,
  expandedValues,
}: {
  orderedNodes: TreeViewNodeType[];
  nodeMap: Record<string, TreeViewNodeType>;
  expandedValues: Set<string>;
}): number[] =>
  getVisibleValues({ orderedNodes, nodeMap, expandedValues })
    .map((value) => nodeMap[value].optionIndex)
    .filter((optionIndex) => optionIndex >= 0);

/**
 * Standalone multiple-selection toggle (B2 cascade).
 * Returns a new Set - toggling a branch toggles all its enabled, loaded leaves
 */
const getSelectionOnNodeToggle = ({
  node,
  selectedValues,
}: {
  node: TreeViewNodeType;
  selectedValues: Set<string>;
}): Set<string> => {
  const next = new Set(selectedValues);

  if (node.isBranch) {
    const shouldDeselect = getBranchSelectionState(node, selectedValues) === 'all';
    for (const leafValue of node.selectableLeafValues) {
      if (shouldDeselect) {
        next.delete(leafValue);
      } else {
        next.add(leafValue);
      }
    }
    return next;
  }

  if (next.has(node.value)) {
    next.delete(node.value);
  } else {
    next.add(node.value);
  }
  return next;
};

/**
 * B6: newly loaded children inherit the parent's selection.
 * A new leaf becomes selected iff its nearest pre-existing ancestor branch
 * was fully selected (with at least one leaf) before the new children arrived
 */
const getSelectionAfterLoad = ({
  previousNodeMap,
  nodeMap,
  orderedNodes,
  selectedValues,
}: {
  previousNodeMap: Record<string, TreeViewNodeType>;
  nodeMap: Record<string, TreeViewNodeType>;
  orderedNodes: TreeViewNodeType[];
  selectedValues: Set<string>;
}): Set<string> => {
  const next = new Set(selectedValues);

  for (const node of orderedNodes) {
    if (!isSelectableLeaf(node) || previousNodeMap[node.value]) {
      continue;
    }

    // find the nearest ancestor that existed before this load
    let ancestorValue = node.parentValue;
    while (ancestorValue !== null && !previousNodeMap[ancestorValue]) {
      ancestorValue = nodeMap[ancestorValue]?.parentValue ?? null;
    }

    if (ancestorValue === null) {
      continue;
    }

    const previousAncestor = previousNodeMap[ancestorValue];
    if (
      previousAncestor.selectableLeafValues.length > 0 &&
      previousAncestor.selectableLeafValues.every((leafValue) => selectedValues.has(leafValue))
    ) {
      next.add(node.value);
    }
  }

  return next;
};

export {
  getTreeViewProperties,
  getBranchSelectionState,
  getSelectedGroups,
  getSelectedLeafValues,
  getDisplayOverride,
  getVisibleValues,
  getVisibleOptionIndices,
  getSelectionOnNodeToggle,
  getSelectionAfterLoad,
  isSelectableLeaf,
  isTreeViewLoadMoreValue,
  makeLoadMoreValue,
  TREEVIEW_MAX_RECOMMENDED_LEVEL,
  DEFAULT_LOAD_MORE_LABEL,
};
export type { TreeViewPropertiesType };
