import React from 'react';
import styled from 'styled-components';
import { componentIds } from './componentIds';
import type { TreeViewProps, TreeViewNodeType } from './types';
import { TreeViewContext } from './useTreeView';
import type { TreeViewContextType } from './useTreeView';
import {
  getDisplayOverride,
  getBranchSelectionState,
  getSelectedGroups,
  getSelectedLeafValues,
  getSelectionAfterLoad,
  getSelectionOnNodeToggle,
  getTreeViewProperties,
  getVisibleOptionIndices,
  getVisibleValues,
} from './treeViewUtils';
import { TreeViewMountScopeContext, useTreeViewMountScopeRef } from './TreeViewAnimator.web';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { useBottomSheetContext } from '~components/BottomSheet/BottomSheetContext';
import { getBaseListBoxWrapperStyles } from '~components/ActionList/styles/getBaseListBoxWrapperStyles';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { logger, throwBladeError } from '~utils/logger';
import { useId } from '~utils/useId';

const StyledTreeViewListBoxWrapper = styled(BaseBox)((props) => ({
  overflowY: 'auto',
  ...getBaseListBoxWrapperStyles({ theme: props.theme, isInBottomSheet: false }),
}));

const _TreeView = ({
  children,
  selectionType,
  value,
  defaultValue,
  onChange,
  name,
  testID,
  ...rest
}: TreeViewProps): React.ReactElement => {
  const dropdown = useDropdown();
  const { isInBottomSheet } = useBottomSheetContext();
  const isInsideDropdown = dropdown.dropdownBaseId !== '';
  const baseId = useId('treeview');

  if (__DEV__ && isInBottomSheet) {
    // §6.9: BottomSheet is explicitly out of scope for TreeView v1
    throwBladeError({
      message: 'TreeView is not supported inside BottomSheet',
      moduleName: 'TreeView',
    });
  }

  React.useEffect(() => {
    if (__DEV__ && isInsideDropdown) {
      if (value !== undefined || defaultValue !== undefined || onChange !== undefined) {
        logger({
          type: 'warn',
          moduleName: 'TreeView',
          message:
            'value, defaultValue, and onChange props of TreeView are ignored inside Dropdown. Use them on the Dropdown trigger (SelectInput / FilterChipSelectInput) instead',
        });
      }
      if (
        selectionType !== undefined &&
        dropdown.selectionType !== undefined &&
        selectionType !== dropdown.selectionType
      ) {
        logger({
          type: 'warn',
          moduleName: 'TreeView',
          message: `selectionType="${selectionType}" on TreeView conflicts with selectionType="${dropdown.selectionType}" on Dropdown. Dropdown's selectionType wins`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInsideDropdown]);

  // §2.1 dual-mode rule: inside Dropdown, selection is owned by Dropdown state and its trigger
  const effectiveSelectionType = isInsideDropdown
    ? dropdown.selectionType ?? 'single'
    : selectionType ?? 'single';

  const properties = React.useMemo(() => getTreeViewProperties(children), [children]);
  const { orderedNodes, nodeMap, rootValues, options } = properties;

  // ---------------- expansion ----------------
  const [uncontrolledExpandedValues, setUncontrolledExpandedValues] = React.useState<Set<string>>(
    () =>
      new Set(
        properties.orderedNodes
          .filter((node) => node.kind === 'item' && node.isBranch && node.defaultIsExpanded)
          .map((node) => node.value),
      ),
  );

  const expandedValues = React.useMemo(() => {
    const merged = new Set<string>();
    for (const node of orderedNodes) {
      if (!node.isBranch) {
        continue;
      }
      const isExpanded = node.controlledIsExpanded ?? uncontrolledExpandedValues.has(node.value);
      if (isExpanded) {
        merged.add(node.value);
      }
    }
    return merged;
  }, [orderedNodes, uncontrolledExpandedValues]);

  const onNodeExpandToggle = (nodeValue: string): void => {
    const node = nodeMap[nodeValue];
    if (!node?.isBranch || node.isDisabled) {
      return;
    }
    const isExpanded = expandedValues.has(nodeValue);
    if (node.controlledIsExpanded === undefined) {
      setUncontrolledExpandedValues((previous) => {
        const next = new Set(previous);
        if (isExpanded) {
          next.delete(nodeValue);
        } else {
          next.add(nodeValue);
        }
        return next;
      });
    }
    node.onExpandChange?.({ isExpanded: !isExpanded });
  };

  // ---------------- selection (standalone: B11 - a Set of selected leaf values) ----------------
  const isControlledSelection = !isInsideDropdown && value !== undefined;
  const [uncontrolledSelectedValues, setUncontrolledSelectedValues] = React.useState<Set<string>>(
    () => new Set(defaultValue ?? []),
  );
  const standaloneSelectedValues = React.useMemo(
    () => (isControlledSelection ? new Set(value) : uncontrolledSelectedValues),
    [isControlledSelection, value, uncontrolledSelectedValues],
  );

  // dropdown mode: B11 - no TreeView-owned selection state, everything derives from Dropdown's indices
  const dropdownSelectedValues = React.useMemo(() => {
    const selected = new Set<string>();
    if (!isInsideDropdown) {
      return selected;
    }
    for (const selectedIndex of dropdown.selectedIndices) {
      const optionValue = dropdown.options[selectedIndex]?.value;
      if (optionValue !== undefined) {
        selected.add(optionValue);
      }
    }
    return selected;
  }, [isInsideDropdown, dropdown.selectedIndices, dropdown.options]);

  const selectedValuesSet = isInsideDropdown ? dropdownSelectedValues : standaloneSelectedValues;

  const emitStandaloneChange = (next: Set<string>): void => {
    if (effectiveSelectionType === 'single') {
      onChange?.({ name, values: [...next], selectedGroups: [] });
      return;
    }
    onChange?.({
      name,
      values: getSelectedLeafValues(orderedNodes, next),
      selectedGroups: getSelectedGroups({ rootValues, nodeMap, selectedValues: next }),
    });
  };

  const onNodeSelect = (nodeValue: string): void => {
    const node = nodeMap[nodeValue];
    if (!node || node.isDisabled || node.kind === 'loadMore') {
      return;
    }

    // a branch that opted out of selection toggles expansion instead (row click / Enter / Space)
    if (node.isBranch && !node.isSelectable) {
      onNodeExpandToggle(nodeValue);
      return;
    }

    let next: Set<string>;
    if (effectiveSelectionType === 'single') {
      // radio semantics (B1) - reselecting the current selection is a no-op
      if (standaloneSelectedValues.has(nodeValue) && standaloneSelectedValues.size === 1) {
        return;
      }
      next = new Set([nodeValue]);
    } else {
      if (node.isBranch && node.selectableLeafValues.length === 0) {
        return;
      }
      next = getSelectionOnNodeToggle({ node, selectedValues: standaloneSelectedValues });
    }

    if (!isControlledSelection) {
      setUncontrolledSelectedValues(next);
    }
    emitStandaloneChange(next);
  };

  // ---------------- dropdown mode: selection routing (§6.2) ----------------
  const toggleBranchInDropdown = (node: TreeViewNodeType): void => {
    // multiple mode invariant: branch indices never enter selectedIndices
    const leafIndices = node.selectableLeafValues
      .map((leafValue) => nodeMap[leafValue]?.optionIndex ?? -1)
      .filter((optionIndex) => optionIndex >= 0);
    if (leafIndices.length === 0) {
      return;
    }
    const areAllSelected = leafIndices.every((optionIndex) =>
      dropdown.selectedIndices.includes(optionIndex),
    );
    dropdown.selectOptionsBatch(leafIndices, areAllSelected ? 'deselect' : 'select');
  };

  const onDropdownNodeClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    clickedValue: string,
  ): void => {
    const node = nodeMap[clickedValue];
    if (!node || node.isDisabled || node.optionIndex < 0) {
      return;
    }

    if (node.kind === 'loadMore') {
      options[node.optionIndex].onClickTrigger?.(true);
      dropdown.setActiveIndex(node.optionIndex);
      dropdown.triggererRef.current?.focus();
      return;
    }

    // non-selectable branch: toggle expansion, keep the overlay open, never enter selectedIndices
    if (node.isBranch && !node.isSelectable) {
      onNodeExpandToggle(node.value);
      dropdown.setActiveIndex(node.optionIndex);
      dropdown.triggererRef.current?.focus();
      return;
    }

    if (effectiveSelectionType === 'multiple' && node.isBranch) {
      toggleBranchInDropdown(node);
      dropdown.setActiveIndex(node.optionIndex);
      dropdown.triggererRef.current?.focus();
      return;
    }

    // leaf click (and branch click in single mode) goes through the standard path
    dropdown.onOptionClick(event, node.optionIndex);
  };

  // ---------------- registration (§6.1) + uncontrolled remap + B6 inheritance ----------------
  const previousPropertiesRef = React.useRef(properties);
  React.useEffect(() => {
    const previousProperties = previousPropertiesRef.current;
    previousPropertiesRef.current = properties;

    if (isInsideDropdown) {
      dropdown.setOptions(options);

      if (previousProperties !== properties && !dropdown.isControlled) {
        // indices are positional: when the registered list changes (async children, loadMore),
        // remap uncontrolled selection by value and apply B6 inheritance.
        // Controlled mode re-syncs through useControlledDropdownInput on [value, options] - not duplicated here
        const previousSelectedValues = new Set(
          dropdown.selectedIndices
            .map((selectedIndex) => previousProperties.options[selectedIndex]?.value)
            .filter((optionValue): optionValue is string => optionValue !== undefined),
        );
        const inherited = getSelectionAfterLoad({
          previousNodeMap: previousProperties.nodeMap,
          nodeMap,
          orderedNodes,
          selectedValues: previousSelectedValues,
        });
        const nextIndices = [...inherited]
          .map((selectedValue) => options.findIndex((option) => option.value === selectedValue))
          .filter((optionIndex) => optionIndex >= 0);
        const hasChanged =
          nextIndices.length !== dropdown.selectedIndices.length ||
          nextIndices.some((optionIndex, i) => optionIndex !== dropdown.selectedIndices[i]);

        if (hasChanged) {
          dropdown.setSelectedIndices(nextIndices);
          if (inherited.size !== previousSelectedValues.size) {
            // selection actually grew through inheritance - let the trigger fire onChange
            dropdown.setChangeCallbackTriggerer(dropdown.changeCallbackTriggerer + 1);
          }
        }
      }
      return;
    }

    // standalone B6 inheritance (uncontrolled multiple selection only;
    // in controlled mode the consumer owns `value` and can react to loads themselves)
    if (
      previousProperties !== properties &&
      !isControlledSelection &&
      effectiveSelectionType === 'multiple'
    ) {
      const inherited = getSelectionAfterLoad({
        previousNodeMap: previousProperties.nodeMap,
        nodeMap,
        orderedNodes,
        selectedValues: uncontrolledSelectedValues,
      });
      if (inherited.size !== uncontrolledSelectedValues.size) {
        setUncontrolledSelectedValues(inherited);
        emitStandaloneChange(inherited);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  // ---------------- dropdown keyboard controller (§6.4) ----------------
  const getNodeAtIndex = (optionIndex: number): TreeViewNodeType | undefined => {
    const optionValue = options[optionIndex]?.value;
    return optionValue === undefined ? undefined : nodeMap[optionValue];
  };

  if (isInsideDropdown && dropdown.treeViewControllerRef) {
    // Published during render (not in an effect): the trigger's effects
    // (e.g. useControlledDropdownInput's onChange effect reading getSelectedGroups) run
    // before this component's effects would re-assign the controller, so an effect-based
    // assignment with a cleanup leaves a null window on every commit
    dropdown.treeViewControllerRef.current = {
      getVisibleOptionIndices: () =>
        getVisibleOptionIndices({ orderedNodes, nodeMap, expandedValues }),
      onArrowRightKeydown: (currentActiveIndex) => {
        const node = getNodeAtIndex(currentActiveIndex);
        if (!node?.isBranch) {
          return;
        }
        if (!expandedValues.has(node.value)) {
          onNodeExpandToggle(node.value);
          return;
        }
        // already expanded: move to the first traversable child
        const firstChildIndex = node.childValues
          .map((childValue) => nodeMap[childValue])
          .filter((childNode) => childNode && !childNode.isDisabled)
          .map((childNode) => childNode.optionIndex)
          .find((optionIndex) => optionIndex >= 0);
        if (firstChildIndex !== undefined) {
          dropdown.setActiveIndex(firstChildIndex);
        }
      },
      onArrowLeftKeydown: (currentActiveIndex) => {
        const node = getNodeAtIndex(currentActiveIndex);
        if (!node) {
          return;
        }
        if (node.isBranch && expandedValues.has(node.value)) {
          onNodeExpandToggle(node.value);
          return;
        }
        if (node.parentValue !== null) {
          const parentIndex = nodeMap[node.parentValue]?.optionIndex ?? -1;
          if (parentIndex >= 0) {
            dropdown.setActiveIndex(parentIndex);
          }
        }
      },
      handleOptionSelect: (optionIndex, { key } = {}) => {
        const node = getNodeAtIndex(optionIndex);
        if (!node) {
          return false;
        }
        if (node.kind === 'loadMore') {
          // B7: Enter activates, Space is a no-op
          if (key !== ' ') {
            options[optionIndex].onClickTrigger?.(true);
          }
          return true;
        }
        if (node.isBranch && !node.isSelectable) {
          // non-selectable branch: Enter/Space toggle expansion, never select
          onNodeExpandToggle(node.value);
          options[optionIndex].onClickTrigger?.(false);
          return true;
        }
        if (effectiveSelectionType === 'multiple' && node.isBranch) {
          // §6.2: branch toggle routes through the batch setter - exactly one onChange
          const branchSelected = getBranchSelectionState(node, selectedValuesSet) === 'all';
          toggleBranchInDropdown(node);
          options[optionIndex].onClickTrigger?.(!branchSelected);
          return true;
        }
        // leaf (and branch in single mode): default selectOption path
        return false;
      },
      getSelectedGroups: (selectedIndices) => {
        const selected = new Set(
          selectedIndices
            .map((selectedIndex) => options[selectedIndex]?.value)
            .filter((optionValue): optionValue is string => optionValue !== undefined),
        );
        return getSelectedGroups({ rootValues, nodeMap, selectedValues: selected });
      },
      getDisplayOverride: (selectedIndices) => {
        const selected = new Set(
          selectedIndices
            .map((selectedIndex) => options[selectedIndex]?.value)
            .filter((optionValue): optionValue is string => optionValue !== undefined),
        );
        return getDisplayOverride({ orderedNodes, rootValues, nodeMap, selectedValues: selected });
      },
    };
  }

  const treeViewControllerRef = dropdown.treeViewControllerRef;
  React.useEffect(() => {
    return () => {
      if (treeViewControllerRef) {
        treeViewControllerRef.current = null;
      }
    };
  }, [treeViewControllerRef]);

  // ---------------- focus management ----------------
  const rowRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const registerRowRef = (nodeValue: string, element: HTMLElement | null): void => {
    rowRefs.current[nodeValue] = element;
  };

  const [focusedValue, setFocusedValue] = React.useState<string | null>(null);
  const visibleValues = React.useMemo(
    () => getVisibleValues({ orderedNodes, nodeMap, expandedValues }),
    [orderedNodes, nodeMap, expandedValues],
  );
  // roving tabindex (standalone): the focused row is tabbable, falling back to the first visible row
  const tabbableValue = isInsideDropdown
    ? null
    : focusedValue && visibleValues.includes(focusedValue)
    ? focusedValue
    : visibleValues[0] ?? null;

  // dropdown mode: keep the active row scrolled into view (focus stays on the trigger)
  React.useEffect(() => {
    if (!isInsideDropdown || dropdown.activeIndex < 0) {
      return;
    }
    const activeValue = options[dropdown.activeIndex]?.value;
    if (activeValue !== undefined) {
      rowRefs.current[activeValue]?.scrollIntoView?.({ block: 'nearest' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdown.activeIndex]);

  // ---------------- standalone keyboard map (§5) ----------------
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (isInsideDropdown) {
      return;
    }
    const rowElement = (event.target as HTMLElement).closest?.('[data-tree-node-value]');
    const currentValue = rowElement?.getAttribute('data-tree-node-value');
    if (!currentValue) {
      return;
    }
    const node = nodeMap[currentValue];
    if (!node) {
      return;
    }

    const currentVisibleIndex = visibleValues.indexOf(currentValue);
    const focusRow = (nodeValue: string | undefined): void => {
      if (nodeValue !== undefined) {
        rowRefs.current[nodeValue]?.focus();
        setFocusedValue(nodeValue);
      }
    };

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusRow(visibleValues[currentVisibleIndex + 1]);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusRow(visibleValues[currentVisibleIndex - 1]);
        break;
      case 'Home':
        event.preventDefault();
        focusRow(visibleValues[0]);
        break;
      case 'End':
        event.preventDefault();
        focusRow(visibleValues[visibleValues.length - 1]);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (!node.isBranch) {
          break;
        }
        if (!expandedValues.has(currentValue)) {
          onNodeExpandToggle(currentValue);
        } else {
          focusRow(node.childValues.find((childValue) => visibleValues.includes(childValue)));
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (node.isBranch && expandedValues.has(currentValue)) {
          onNodeExpandToggle(currentValue);
        } else if (node.parentValue !== null) {
          focusRow(node.parentValue);
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (node.kind === 'loadMore') {
          if (node.optionIndex >= 0) {
            options[node.optionIndex].onClickTrigger?.(true);
          }
          break;
        }
        {
          const isNodeSelected =
            node.isSelectable &&
            (effectiveSelectionType === 'multiple'
              ? node.isBranch
                ? getBranchSelectionState(node, selectedValuesSet) === 'all'
                : selectedValuesSet.has(currentValue)
              : selectedValuesSet.has(currentValue));
          onNodeSelect(currentValue);
          if (node.optionIndex >= 0) {
            options[node.optionIndex].onClickTrigger?.(isNodeSelected);
          }
        }
        break;
      case ' ':
        event.preventDefault();
        // B7: Space is a no-op on LoadMore
        if (node.kind === 'loadMore') {
          break;
        }
        {
          const isNodeSelected =
            node.isSelectable &&
            (effectiveSelectionType === 'multiple'
              ? node.isBranch
                ? getBranchSelectionState(node, selectedValuesSet) === 'all'
                : selectedValuesSet.has(currentValue)
              : selectedValuesSet.has(currentValue));
          onNodeSelect(currentValue);
          if (node.optionIndex >= 0) {
            options[node.optionIndex].onClickTrigger?.(isNodeSelected);
          }
        }
        break;
      default:
        break;
    }
  };

  // ---------------- context ----------------
  const contextValue = React.useMemo<TreeViewContextType>(
    () => ({
      selectionType: effectiveSelectionType,
      isInsideDropdown,
      baseId,
      nodeMap,
      selectedValuesSet,
      expandedValues,
      tabbableValue,
      onNodeSelect,
      onNodeExpandToggle,
      onDropdownNodeClick,
      registerRowRef,
      setFocusedValue,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      effectiveSelectionType,
      isInsideDropdown,
      baseId,
      nodeMap,
      selectedValuesSet,
      expandedValues,
      tabbableValue,
      dropdown.selectedIndices,
      dropdown.activeIndex,
      dropdown.isKeydownPressed,
    ],
  );

  // root mount scope: rows appended at the root after the initial mount
  // (e.g. through a root-level TreeViewLoadMore) animate their own mount
  const isTreeFirstRenderRef = useTreeViewMountScopeRef();

  const treeContent = (
    <div
      id={isInsideDropdown ? `${dropdown.dropdownBaseId}-actionlist` : undefined}
      onKeyDown={handleKeyDown}
      {...makeAccessible({
        role: 'tree',
        multiSelectable: effectiveSelectionType === 'multiple' ? true : undefined,
        labelledBy: isInsideDropdown ? `${dropdown.dropdownBaseId}-label` : undefined,
      })}
    >
      <TreeViewMountScopeContext.Provider value={isTreeFirstRenderRef}>
        {children}
      </TreeViewMountScopeContext.Provider>
    </div>
  );

  return (
    <TreeViewContext.Provider value={contextValue}>
      <BaseBox
        {...metaAttribute({ name: MetaConstants.TreeView, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        {isInsideDropdown ? (
          <StyledTreeViewListBoxWrapper>{treeContent}</StyledTreeViewListBoxWrapper>
        ) : (
          treeContent
        )}
      </BaseBox>
    </TreeViewContext.Provider>
  );
};

/**
 * ### TreeView
 *
 * Hierarchical list of expandable, selectable items. Works standalone on a page,
 * or inside `Dropdown` (in place of `ActionList`) where selection is controlled
 * through the trigger's `value` / `onChange` (SelectInput, FilterChipSelectInput).
 *
 * #### Usage
 *
 * ```jsx
 * <TreeView selectionType="multiple" onChange={({ values, selectedGroups }) => {}}>
 *   <TreeViewItem title="India" value="india">
 *     <TreeViewItem title="Karnataka" value="karnataka">
 *       <TreeViewItem title="Bengaluru" value="bengaluru" />
 *       <TreeViewItem title="Mysuru" value="mysuru" />
 *     </TreeViewItem>
 *     <TreeViewItem title="Goa" value="goa" />
 *   </TreeViewItem>
 * </TreeView>
 * ```
 */
const TreeView = assignWithoutSideEffects(_TreeView, {
  componentId: componentIds.TreeView,
  displayName: componentIds.TreeView,
});

export { TreeView };
