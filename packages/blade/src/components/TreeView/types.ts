import type { ReactNode } from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { IconComponent } from '~components/Icons';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type TreeViewSelectionType = 'single' | 'multiple' | 'none';

type TreeViewProps = {
  /**
   * Tree nodes — accepts `TreeViewItem` children
   */
  children: ReactNode;

  /**
   * Controls selection behavior
   *
   * @default 'none'
   */
  selectionType?: TreeViewSelectionType;

  /**
   * Selected node id(s) (controlled).
   */
  selectedIds?: string[];

  /**
   * Default selected node id(s) (uncontrolled).
   */
  defaultSelectedIds?: string[];

  /**
   * Callback when selection changes
   */
  onSelectionChange?: (params: { selectedIds: string[] }) => void;

  /**
   * Default expanded node ids. Nodes with matching ids will be expanded on initial render.
   */
  defaultExpandedIds?: string[];

  /**
   * Controlled expanded node ids
   */
  expandedIds?: string[];

  /**
   * Callback when a node is expanded or collapsed
   */
  onExpandChange?: (params: { nodeId: string; isExpanded: boolean }) => void;

  /**
   * Callback when the set of expanded node ids changes
   */
  onExpandedIdsChange?: (params: { expandedIds: string[] }) => void;
} & TestID &
  StyledPropsBlade;

type TreeViewItemProps = {
  /**
   * Unique identifier for the node (required for selection and expand callbacks)
   */
  id: string;

  /**
   * Label text displayed for the node
   */
  label: string;

  /**
   * Optional icon rendered before the label
   */
  icon?: IconComponent;

  /**
   * Optional trailing content (e.g. badge, count)
   */
  trailing?: ReactNode;

  /**
   * Whether the item is disabled
   *
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Nested `TreeViewItem` children
   */
  children?: ReactNode;
} & TestID &
  DataAnalyticsAttribute;

type TreeViewContextType = {
  selectionType: TreeViewSelectionType;
  selectedIds: string[];
  expandedIds: string[];
  depth: number;
  onNodeSelect: (id: string) => void;
  onNodeToggle: (id: string) => void;
};

export type { TreeViewProps, TreeViewItemProps, TreeViewContextType, TreeViewSelectionType };
