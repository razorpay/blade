import { default as React } from 'react';
import { TableProps } from './types';
declare const Table: <Item>({ children, data, multiSelectTrigger, selectionType, onSelectionChange, isHeaderSticky, isFooterSticky, isFirstColumnSticky, rowDensity, onSortChange, sortFunctions, toolbar, pagination, height, showStripedRows, gridTemplateColumns, isLoading, isRefreshing, showBorderedCells, defaultSelectedIds, backgroundColor, isGrouped, ...rest }: TableProps<Item>) => React.ReactElement;
export { Table };
