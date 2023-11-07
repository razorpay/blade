import React, { useCallback, useEffect, useMemo } from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import filter from 'lodash/filter';
import type { MiddlewareFunction } from '@table-library/react-table-library/types/common';
import type { Identifier } from '@table-library/react-table-library/table';
import { useSort } from '@table-library/react-table-library/sort';
import { SelectTypes, useRowSelect } from '@table-library/react-table-library/select';
import type { TableContextType } from './TableContext';
import { TableProvider } from './TableContext';
import { ComponentIds } from './componentIds';
import type { TableHeaderCellProps } from './TableHeader';
import { makeBorderSize, useTheme } from '~utils';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';

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
    background-color: ${theme.colors.surface.background.level2.lowContrast};
    --data-table-library_grid-template-columns:  ${
      selectionType === 'multiple' ? 'min-content' : ''
    } repeat(${columnCount},minmax(0px, 1fr)) !important; 
    `,
    Footer: `
    .tr-footer th {
      position: ${isFooterSticky ? `sticky` : undefined};
      bottom: ${isFooterSticky ? `0` : undefined};
    };
    `,
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
      rowDensity,
      toggleSort,
      currentSortedState,
    ],
  );

  return (
    <TableProvider value={tableContext}>
      <>
        {toolbar}
        <ReactTable
          layout={{ fixedHeader: isHeaderSticky, horizontalScroll: true }}
          data={data}
          theme={tableTheme}
          select={selectionType ? rowSelectConfig : null}
          sort={sort}
        >
          {children}
        </ReactTable>
      </>
    </TableProvider>
  );
};

export { Table };
