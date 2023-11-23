/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { Text } from '~components/Typography';
import type { SurfaceLevels } from '~tokens/theme/theme';
import { logger } from '~utils/logger';

export type TableNode<Item> = Item & {
  id: string;
};

export type TableData<Item> = {
  nodes: TableNode<Item>[];
};

export type TableProps<Item> = {
  children: (tableData: TableNode<Item>[]) => React.ReactElement;
  data: TableData<Item>;
  selectionType?: 'none' | 'single' | 'multiple';
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
  showStripedRows?: boolean;
  gridTemplateColumns?: string;
  surfaceLevel?: SurfaceLevels;
  isLoading?: boolean;
  isRefreshing?: boolean;
} & StyledPropsBlade;

const Table = <Item,>(props: TableProps<Item>): React.ReactElement => {
  if (__DEV__) {
    logger({
      type: 'warn',
      moduleName: 'Table',
      message: 'Table Component is not available for Native mobile apps.',
    });
  }

  return <Text>Table Component is not available for Native mobile apps.</Text>;
};

export { Table };
