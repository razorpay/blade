/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import type { SurfaceLevels } from '~tokens/theme/theme';

export type TableNode<Item> = Item & {
  id: string;
};

export type TableData<Item> = {
  nodes: TableNode<Item>[];
};

export type TableProps<Item> = {
  children: (tableData: TableNode<Item>[]) => React.ReactElement;
  data: TableData<Item>;
  selectionType?: 'single' | 'multiple';
  onSelectionChange?: ({ values }: { values: TableNode<Item>[] }) => void;
  isHeaderSticky?: boolean;
  isFooterSticky?: boolean;
  isFirstColumnSticky?: boolean;
  rowDensity?: 'normal' | 'comfortable';
  onSortChange?: ({
    sortKey,
    isSortReversed,
  }: {
    sortKey: string;
    isSortReversed: boolean;
  }) => void;
  sortFunctions?: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]>;
  toolbar?: React.ReactElement;
  pagination?: React.ReactElement;
  height?: string;
  showStripes?: boolean;
  gridTemplateColumns?: string;
  surfaceLevel?: SurfaceLevels;
  isLoading?: boolean;
  isRefreshing?: boolean;
} & StyledPropsBlade;

const Table = <Item,>(props: TableProps<Item>): React.ReactElement => {
  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

export { Table };
