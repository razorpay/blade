import type { ReactElement } from 'react';
import React, { useCallback, useMemo, useState } from 'react';
import { TreeViewContext } from './TreeViewContext';
import type { TreeViewProps } from './types';
import { BaseBox } from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { componentIds } from './componentIds';


/**
 * # TreeView
 *
 * A tree view component for displaying hierarchical data with support for expand/collapse and selection.
 *
 * ## Usage
 *
 * ```jsx
 * <TreeView selectionType="single" onSelectionChange={({ selectedIds }) => console.log(selectedIds)}>
 *   <TreeViewItem id="fruits" label="Fruits" icon={FolderOpenIcon}>
 *     <TreeViewItem id="apple" label="Apple" icon={FileIcon} />
 *     <TreeViewItem id="banana" label="Banana" icon={FileIcon} />
 *   </TreeViewItem>
 *   <TreeViewItem id="vegetables" label="Vegetables" icon={FolderOpenIcon}>
 *     <TreeViewItem id="carrot" label="Carrot" icon={FileIcon} />
 *   </TreeViewItem>
 * </TreeView>
 * ```
 *
 * Checkout https://blade.razorpay.com/?path=/docs/components-treeview--docs
 */
const _TreeView = ({
  children,
  selectionType = 'none',
  selectedIds: controlledSelectedIds,
  defaultSelectedIds,
  onSelectionChange,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  onExpandChange,
  testID,
  ...rest
}: TreeViewProps): ReactElement => {
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState<string[]>(
    defaultSelectedIds ?? [],
  );
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState<string[]>(
    defaultExpandedIds ?? [],
  );

  const selectedIds =
    controlledSelectedIds !== undefined ? controlledSelectedIds : uncontrolledSelectedIds;

  const expandedIds = controlledExpandedIds !== undefined ? controlledExpandedIds : uncontrolledExpandedIds;

  const onNodeSelect = useCallback(
    (id: string) => {
      if (selectionType === 'none') return;

      let nextIds: string[];
      if (selectionType === 'single') {
        nextIds = selectedIds.includes(id) ? [] : [id];
      } else {
        nextIds = selectedIds.includes(id)
          ? selectedIds.filter((s) => s !== id)
          : [...selectedIds, id];
      }

      if (controlledSelectedIds === undefined) {
        setUncontrolledSelectedIds(nextIds);
      }
      onSelectionChange?.({ selectedIds: nextIds });
    },
    [selectionType, selectedIds, controlledSelectedIds, onSelectionChange],
  );

  const onNodeToggle = useCallback(
    (id: string) => {
      const isExpanded = expandedIds.includes(id);
      const nextIds = isExpanded ? expandedIds.filter((e) => e !== id) : [...expandedIds, id];

      if (controlledExpandedIds === undefined) {
        setUncontrolledExpandedIds(nextIds);
      }
      onExpandChange?.({ expandedIds: nextIds, nodeId: id, isExpanded: !isExpanded });
    },
    [expandedIds, controlledExpandedIds, onExpandChange],
  );

  const contextValue = useMemo(
    () => ({ selectionType, selectedIds, expandedIds, onNodeSelect, onNodeToggle }),
    [selectionType, selectedIds, expandedIds, onNodeSelect, onNodeToggle],
  );

  return (
    <TreeViewContext.Provider value={contextValue}>
      <BaseBox
        {...makeAccessible({ role: 'tree' })}
        {...metaAttribute({ name: MetaConstants.TreeView, testID })}
        {...getStyledProps(rest)}
      >
        {children}
      </BaseBox>
    </TreeViewContext.Provider>
  );
};

const TreeView = assignWithoutSideEffects(_TreeView, {
  componentId: componentIds.TreeView,
});

export { TreeView };
