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
import type { TableHeaderCellProps } from './TableHeader';
import { makeBorderSize, useTheme } from '~utils';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import type { BoxProps } from '~components/Box';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';

type TableNode = {
  id: Identifier;
  nodes?: null;
  [key: string]: unknown;
};

export type TableProps = {
  children: (tableData: TableNode[]) => React.ReactElement;
  data: { nodes: TableNode[] };
  selectionType?: 'single' | 'multiple';
  onSelectionChange?: ({ values }: { values: TableNode[] }) => void;
  isHeaderSticky?: boolean;
  isFooterSticky?: boolean;
  rowDensity?: 'normal' | 'comfortable';
  onSortChange?: ({
    sortKey,
    isSortReversed,
  }: {
    sortKey: TableHeaderCellProps['headerKey'];
    isSortReversed: boolean;
  }) => void;
  sortFunctions?: Record<string, (array: TableNode[]) => TableNode[]>;
  toolbar?: React.ReactElement;
  pagination?: React.ReactElement;
  height?: BoxProps['height'];
};

const rowSelectType: Record<NonNullable<TableProps['selectionType']>, SelectTypes> = {
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

const Table: React.FC<TableProps> = ({
  children,
  data,
  selectionType,
  onSelectionChange,
  isHeaderSticky,
  isFooterSticky,
  rowDensity = 'normal',
  onSortChange,
  sortFunctions,
  toolbar,
  pagination,
  height,
}) => {
  const { theme } = useTheme();
  const [selectedRows, setSelectedRows] = React.useState<TableNode['id'][]>([]);
  const [totalItems, setTotalItems] = React.useState(data.nodes.length || 0);

  // Table Theme
  const columnCount = getTableHeaderCellCount(children);
  const tableTheme = useTableTheme({
    Table: `
    height:${isFooterSticky ? `100%` : undefined};
    border: ${makeBorderSize(theme.border.width.thin)} solid ${
      theme.colors.surface.border.normal.lowContrast
    };
    background-color: transparent;
    --data-table-library_grid-template-columns:  ${
      selectionType === 'multiple' ? 'min-content' : ''
    } repeat(${columnCount},minmax(100px, 1fr)) !important; 
    `,
    Footer: `
    .tr-footer th {
      position: ${isFooterSticky ? 'sticky' : 'relative'};
      bottom: ${isFooterSticky ? '0' : undefined};
    };
    `,
    Header: `
    .tr-header th {
      position: ${isHeaderSticky ? 'sticky' : 'relative'};
      top: ${isHeaderSticky ? '0' : undefined};
    };`,
  });

  useEffect(() => {
    // Get the total number of items
    setTotalItems(data.nodes.length);
  }, [data.nodes]);

  // Selection Logic
  const onSelectChange: MiddlewareFunction = (action, state): void => {
    const selectedIDs: TableNode['id'][] = state.id ? [state.id] : state.ids ?? [];
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
    () => (id: TableNode['id']): void => {
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
      rowSelectConfig.fns.onToggleAll({});
    },
    [rowSelectConfig.fns],
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
  const handlePaginationChange: MiddlewareFunction = (action, state) => {
    console.log('pagination', state);
  };

  const paginationConfig = usePagination(
    data,
    {
      state: {
        page: 0,
        size: 2,
      },
      onChange: handlePaginationChange,
    },
    {
      isServer: false,
    },
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
          sort={sort}
          styledProps={{
            height,
          }}
          pagination={paginationConfig}
        >
          {children}
        </StyledReactTable>
        {pagination}
      </>
    </TableProvider>
  );
};

export { Table };
