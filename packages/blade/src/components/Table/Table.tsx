import React, { useCallback, useEffect, useMemo } from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import filter from 'lodash/filter';
import type { MiddlewareFunction } from '@table-library/react-table-library/types/common';
import type { Identifier } from '@table-library/react-table-library/table';
import { useSort } from '@table-library/react-table-library/sort';
import { usePagination } from '@table-library/react-table-library/pagination';
import { SelectTypes, useRowSelect } from '@table-library/react-table-library/select';
import styled from 'styled-components';
import type { TableContextType } from './TableContext';
import { TableProvider } from './TableContext';
import { ComponentIds } from './componentIds';
import { tablePagination } from './tokens';
import type { TableHeaderCellProps } from './TableHeader';
import { makeBorderSize, useTheme } from '~utils';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import type { BoxProps } from '~components/Box';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';
import type { SurfaceLevels } from '~tokens/theme/theme';

export type TableNode<Item> = Item & {
  id: Identifier;
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
    sortKey: TableHeaderCellProps['headerKey'];
    isSortReversed: boolean;
  }) => void;
  sortFunctions?: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]>;
  toolbar?: React.ReactElement;
  pagination?: React.ReactElement;
  height?: BoxProps['height'];
  showStripes?: boolean;
  gridTemplateColumns?: string;
  surfaceLevel?: SurfaceLevels;
};

const rowSelectType: Record<NonNullable<TableProps<unknown>['selectionType']>, SelectTypes> = {
  single: SelectTypes.SingleSelect,
  multiple: SelectTypes.MultiSelect,
};

// Get the number of TableHeaderCell components.
// This is very complicated but the only way to iterate through the structure and get number of header cells.
// Assuming number of header cells is the same as number of columns
const getTableHeaderCellCount = (children: (data: []) => React.ReactElement): number => {
  const tableRootComponent = children([]);
  if (tableRootComponent && React.isValidElement(tableRootComponent)) {
    const tableComponentArray = React.Children.toArray(tableRootComponent);
    if (React.isValidElement(tableComponentArray[0])) {
      const tableComponentArrayChildren = React.Children.toArray(
        tableComponentArray[0].props.children,
      );
      const tableHeader = tableComponentArrayChildren.find(
        (child) => getComponentId(child) === ComponentIds.TableHeader,
      );
      const tableHeaderChildrenArray = React.isValidElement(tableHeader)
        ? React.Children.toArray(tableHeader.props.children)
        : null;
      const tableHeaderRow = tableHeaderChildrenArray?.find(
        (child) => getComponentId(child) === ComponentIds.TableHeaderRow,
      );
      const tableHeaderRowChildrenArray = React.isValidElement(tableHeaderRow)
        ? React.Children.toArray(tableHeaderRow.props.children)
        : null;
      const tableHeaderCells = tableHeaderRowChildrenArray
        ? tableHeaderRowChildrenArray.filter(
            (child) => getComponentId(child) === ComponentIds.TableHeaderCell,
          )
        : null;
      return tableHeaderCells?.length ?? 0;
    }
  }
  return 0;
};

const StyledReactTable = styled(ReactTable)<{ styledProps?: { height?: BoxProps['height'] } }>(
  ({ styledProps }) => {
    const { theme } = useTheme();
    const styledPropsCSSObject = getBaseBoxStyles({
      theme,
      height: styledProps?.height,
    });

    return {
      '&&&': {
        ...styledPropsCSSObject,
      },
    };
  },
);

const Table = <Item,>({
  children,
  data,
  selectionType,
  onSelectionChange,
  isHeaderSticky,
  isFooterSticky,
  isFirstColumnSticky,
  rowDensity = 'normal',
  onSortChange,
  sortFunctions,
  toolbar,
  pagination,
  height,
  showStripes,
  gridTemplateColumns,
  surfaceLevel = 2,
}: TableProps<Item>): React.ReactElement => {
  const { theme } = useTheme();
  const [selectedRows, setSelectedRows] = React.useState<TableNode<unknown>['id'][]>([]);
  const [disabledRows, setDisabledRows] = React.useState<TableNode<unknown>['id'][]>([]);
  const [totalItems, setTotalItems] = React.useState(data.nodes.length || 0);

  // Table Theme
  const columnCount = getTableHeaderCellCount(children);
  const tableTheme = useTableTheme({
    Table: `
    height:${isFooterSticky ? `100%` : undefined};
    border: ${makeBorderSize(theme.border.width.thin)} solid ${
      theme.colors.surface.border.normal.lowContrast
    };
    --data-table-library_grid-template-columns: ${
      gridTemplateColumns ??
      ` ${
        selectionType === 'multiple' ? 'min-content' : ''
      } repeat(${columnCount},minmax(100px, 1fr)) !important;`
    } !important;
    background-color: ${theme.colors.surface.background[`level${surfaceLevel}`].lowContrast};
    `,
    Footer: `
    .tr-footer > div {
      position: ${isFooterSticky ? 'sticky' : 'relative'};
      bottom: ${isFooterSticky ? '0' : undefined};
    };
    `,
    Header: `
    .tr-header > div {
      position: ${isHeaderSticky ? 'sticky' : 'relative'};
      top: ${isHeaderSticky ? '0' : undefined};
    };`,
    HeaderCell: isFirstColumnSticky
      ? `
    &:nth-of-type(1) {
      left: 0 !important;
      position: sticky !important;
      z-index: 2 !important;;
    }
    ${
      selectionType === 'multiple' &&
      `&:nth-of-type(2) {
      left: 44px !important;
      position: sticky !important;
      z-index: 2 !important;;
    }
    `
    }`
      : undefined,
    Cell: isFirstColumnSticky
      ? `
    &:nth-of-type(1) {
      left: 0 !important;
      position: sticky !important;
      z-index: 2 !important;;
    }
    ${
      selectionType === 'multiple' &&
      `&:nth-of-type(2) {
      left: 44px !important;
      position: sticky !important;
      z-index: 2 !important;;
    }
    `
    }`
      : undefined,
    FooterCell: isFirstColumnSticky
      ? `
    &:nth-of-type(1) {
      left: 0 !important;
      position: sticky !important;
      z-index: 2 !important;;
    }
    ${
      selectionType === 'multiple' &&
      `&:nth-of-type(2) {
      left: 44px !important;
      position: sticky !important;
      z-index: 2 !important;;
    }
    `
    }`
      : undefined,
  });

  useEffect(() => {
    // Get the total number of items
    setTotalItems(data.nodes.length);
  }, [data.nodes]);

  // Selection Logic
  const onSelectChange: MiddlewareFunction = (action, state): void => {
    const selectedIDs: Identifier[] = state.id ? [state.id] : state.ids ?? [];
    setSelectedRows(selectedIDs);
    onSelectionChange?.({
      values: filter(data.nodes, (node) => selectedIDs.includes(node.id)),
    });
  };

  const rowSelectConfig = useRowSelect(
    data,
    {
      onChange: onSelectChange,
    },
    {
      rowSelect: selectionType ? rowSelectType[selectionType] : undefined,
    },
  );

  const toggleRowSelectionById = useMemo(
    () => (id: Identifier): void => {
      rowSelectConfig.fns.onToggleById(id);
    },
    [rowSelectConfig.fns],
  );

  const deselectAllRows = useMemo(
    () => (): void => {
      rowSelectConfig.fns.onRemoveAll();
    },
    [rowSelectConfig.fns],
  );

  const toggleAllRowsSelection = useMemo(
    () => (): void => {
      if (selectedRows.length > 0) {
        rowSelectConfig.fns.onRemoveAll();
      } else {
        const ids = data.nodes
          .map((item: TableNode<Item>) => (disabledRows.includes(item.id) ? null : item.id))
          .filter(Boolean) as Identifier[];

        rowSelectConfig.fns.onAddAll(ids);
      }
    },
    [rowSelectConfig.fns, data.nodes, selectedRows, disabledRows],
  );

  // Sort Logic
  const handleSortChange: MiddlewareFunction = (action, state) => {
    onSortChange?.({
      sortKey: state.sortKey,
      isSortReversed: state.reverse,
    });
  };

  const sort = useSort(
    data,
    {
      onChange: handleSortChange,
    },
    {
      // @ts-expect-error ignore this, if sortFunctions is undefined, it will be ignored
      sortFns: sortFunctions,
    },
  );

  const currentSortedState: TableContextType['currentSortedState'] = useMemo(() => {
    return {
      sortKey: sort.state.sortKey,
      isSortReversed: sort.state.reverse,
      sortableColumns: Object.keys(sortFunctions ?? {}),
    };
  }, [sort.state, sortFunctions]);

  const toggleSort = useCallback(
    (sortKey: string): void => {
      sort.fns.onToggleSort({
        sortKey,
      });
    },
    [sort.fns],
  );

  // Pagination

  const hasPagination = Boolean(pagination);

  const paginationConfig = usePagination(data, {
    state: {
      page: 0,
      size: tablePagination.defaultPageSize,
    },
  });

  const currentPaginationState = useMemo(() => {
    return hasPagination
      ? {
          page: paginationConfig.state.page,
          size: paginationConfig.state.size,
        }
      : undefined;
  }, [paginationConfig.state, hasPagination]);

  const setPaginationPage = useCallback(
    (page: number): void => {
      paginationConfig.fns.onSetPage(page);
    },
    [paginationConfig.fns],
  );

  const setPaginationRowSize = useCallback(
    (size: number): void => {
      paginationConfig.fns.onSetSize(size);
    },
    [paginationConfig.fns],
  );

  // Toolbar Component
  if (__DEV__) {
    if (toolbar && !isValidAllowedChildren(toolbar, ComponentIds.TableToolbar)) {
      throwBladeError({
        message: 'Only TableToolbar component is allowed in the `toolbar` prop',
        moduleName: 'Table',
      });
    }
  }

  // Table Context
  const tableContext: TableContextType = useMemo(
    () => ({
      selectionType,
      selectedRows,
      totalItems,
      toggleRowSelectionById,
      toggleAllRowsSelection,
      deselectAllRows,
      rowDensity,
      toggleSort,
      currentSortedState,
      setPaginationPage,
      setPaginationRowSize,
      currentPaginationState,
      showStripes,
      surfaceLevel,
      disabledRows,
      setDisabledRows,
    }),
    [
      selectionType,
      selectedRows,
      totalItems,
      toggleRowSelectionById,
      toggleAllRowsSelection,
      deselectAllRows,
      rowDensity,
      toggleSort,
      currentSortedState,
      setPaginationPage,
      setPaginationRowSize,
      currentPaginationState,
      showStripes,
      surfaceLevel,
      disabledRows,
      setDisabledRows,
    ],
  );

  return (
    <TableProvider value={tableContext}>
      <>
        {toolbar}
        <StyledReactTable
          layout={{ fixedHeader: isHeaderSticky, horizontalScroll: true }}
          data={data}
          // @ts-expect-error ignore this, theme clashes with styled-component's theme. We're using useTheme from blade to get actual theme
          theme={tableTheme}
          select={selectionType ? rowSelectConfig : null}
          sort={sortFunctions ? sort : null}
          styledProps={{
            height,
          }}
          pagination={hasPagination ? paginationConfig : null}
        >
          {children}
        </StyledReactTable>
        {pagination}
      </>
    </TableProvider>
  );
};

export { Table };
