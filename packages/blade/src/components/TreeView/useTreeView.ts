import React from 'react';
import type { TreeViewNodeType } from './types';
import { throwBladeError } from '~utils/logger';

type TreeViewContextType = {
  /**
   * Effective selection type. Inside Dropdown, inherited from Dropdown's selectionType
   */
  selectionType: 'single' | 'multiple';
  /**
   * true when TreeView is rendered inside a Dropdown (detected via dropdownBaseId)
   */
  isInsideDropdown: boolean;
  /**
   * Base id for row DOM ids in standalone mode
   */
  baseId: string;
  nodeMap: Record<string, TreeViewNodeType>;
  /**
   * Source of truth for selection state, unified across modes:
   * - standalone: TreeView-owned Set of selected values
   * - Dropdown: derived from Dropdown's selectedIndices
   */
  selectedValuesSet: Set<string>;
  /**
   * Values of currently expanded branches (uncontrolled state merged with controlled `isExpanded` props)
   */
  expandedValues: Set<string>;
  /**
   * The row that currently holds tabIndex=0 in standalone mode (roving tabindex)
   */
  tabbableValue: string | null;
  /**
   * Standalone row selection (single select / multiple cascade toggle)
   */
  onNodeSelect: (value: string) => void;
  /**
   * Toggles expansion of a branch (both modes)
   */
  onNodeExpandToggle: (value: string) => void;
  /**
   * Dropdown-mode row click routing (leaf -> selectOption, branch multiple -> batch toggle, loadMore -> onClick)
   */
  onDropdownNodeClick: (event: React.MouseEvent<HTMLButtonElement>, value: string) => void;
  /**
   * Rows register their DOM node for focus management and scroll-into-view
   */
  registerRowRef: (value: string, element: HTMLElement | null) => void;
  /**
   * Standalone: updates the roving tabindex target when a row receives focus
   */
  setFocusedValue: (value: string) => void;
};

const TreeViewContext = React.createContext<TreeViewContextType | null>(null);

const useTreeViewContext = (): TreeViewContextType => {
  const context = React.useContext(TreeViewContext);
  if (!context) {
    throwBladeError({
      message: 'TreeViewItem and TreeViewLoadMore must be used within TreeView',
      moduleName: 'TreeView',
    });
  }
  return context!;
};

/**
 * Provides the parent TreeViewItem's value to nested rows.
 * null at the root level. Used by TreeViewLoadMore to find its own node in the registry
 */
const TreeViewParentContext = React.createContext<string | null>(null);

export { TreeViewContext, TreeViewParentContext, useTreeViewContext };
export type { TreeViewContextType };
