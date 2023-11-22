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
import {
  checkboxCellWidth,
  firstColumnStickyHeaderFooterZIndex,
  refreshWrapperZIndex,
  tablePagination,
} from './tokens';
import type { TableHeaderCellProps } from './TableHeader';
import { makeBorderSize, useTheme } from '~utils';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import type { BoxProps } from '~components/Box';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';
import type { SurfaceLevels } from '~tokens/theme/theme';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';

export type TableNode<Item> = Item & {
  id: Identifier;
};

export type TableData<Item> = {
  nodes: TableNode<Item>[];
};

export type TableProps<Item> = {
  /**
   * The children of the Table component should be a function that returns TableHeader, TableBody and TableFooter components.
   * The function will be called with the tableData prop.
   */
  children: (tableData: TableNode<Item>[]) => React.ReactElement;
  /**
   * The data prop is an object with a nodes property that is an array of objects.
   * Each object in the array is a row in the table.
   * The object should have an id property that is a unique identifier for the row.
   */
  data: TableData<Item>;
  /**
   * The selectionType prop determines the type of selection that is allowed on the table.
   * The selectionType prop can be 'single' or 'multiple'.
   **/
  selectionType?: 'single' | 'multiple';
  /**
   * The onSelectionChange prop is a function that is called when the selection changes.
   * The function is called with an object that has a values property that is an array of the selected rows.
   **/
  onSelectionChange?: ({ values }: { values: TableNode<Item>[] }) => void;
  /**
   * The isHeaderSticky prop determines whether the table header is sticky or not.
   * The default value is `false`.
   **/
  isHeaderSticky?: boolean;
  /**
   * The isFooterSticky prop determines whether the table footer is sticky or not.
   * The default value is `false`.
   **/
  isFooterSticky?: boolean;
  /**
   * The isFirstColumnSticky prop determines whether the first column is sticky or not.
   * The default value is `false`.
   **/
  isFirstColumnSticky?: boolean;
  /**
   * The rowDensity prop determines the density of the table.
   * The rowDensity prop can be 'normal' or 'comfortable'.
   * The default value is `normal`.
   **/
  rowDensity?: 'normal' | 'comfortable';
  /**
   * The onSortChange prop is a function that is called when the sort changes.
   * The function is called with an object that has a sortKey property that is the key of the column that is sorted and a isSortReversed property that is a boolean that determines whether the sort is reversed or not.
   **/
  onSortChange?: ({
    sortKey,
    isSortReversed,
  }: {
    sortKey: TableHeaderCellProps['headerKey'];
    isSortReversed: boolean;
  }) => void;
  /**
   * The sortFunctions prop is an object that has a key for each column that is sortable.
   * The value of each key is a function that is called when the column is sorted.
   * The function is called with an array of the rows in the table.
   * The function should return an array of the rows in the table.
   **/
  sortFunctions?: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]>;
  /**
   * The toolbar prop is a React element that is rendered above the table.
   * The toolbar prop should be a `TableToolbar` component.
   **/
  toolbar?: React.ReactElement;
  /**
   * The pagination prop is a React element that is rendered below the table.
   * The pagination prop should be a `TablePagination` component.
   **/
  pagination?: React.ReactElement;
  /**
   * The height prop is a responsive styled prop that determines the height of the table.
   **/
  height?: BoxProps['height'];
  /**
   * The showStripes prop determines whether the table should have striped rows or not.
   * The default value is `false`.
   **/
  showStripes?: boolean;
  /**
   * The gridTemplateColumns prop determines the grid-template-columns CSS property of the table.
   * The default value is `repeat(${columnCount},minmax(100px, 1fr))`.
   **/
  gridTemplateColumns?: string;
  /**
   * The surfaceLevel prop determines the surface level of the table.
   * The surfaceLevel prop can be 1, 2, 3, 4 or 5.
   * The default value is `2`.
   **/
  surfaceLevel?: SurfaceLevels;
  /**
   * The isLoading prop determines whether the table is loading or not.
   * The default value is `false`.
   **/
  isLoading?: boolean;
  /**
   * The isRefreshing prop determines whether the table is refreshing or not.
   * The default value is `false`.
   **/
  isRefreshing?: boolean;
} & StyledPropsBlade;

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
  isLoading = false,
  isRefreshing = false,
  ...styledProps
}: TableProps<Item>): React.ReactElement => {
  const { theme } = useTheme();
  const [selectedRows, setSelectedRows] = React.useState<TableNode<unknown>['id'][]>([]);
  const [disabledRows, setDisabledRows] = React.useState<TableNode<unknown>['id'][]>([]);
  const [totalItems, setTotalItems] = React.useState(data.nodes.length || 0);
  // Need to make header is sticky if first column is sticky otherwise the first header cell will not be sticky
  const shouldHeaderBeSticky = isHeaderSticky ?? isFirstColumnSticky;
  // Table Theme
  const columnCount = getTableHeaderCellCount(children);
  const firstColumnStickyHeaderCellCSS = isFirstColumnSticky
    ? `
  &:nth-of-type(1) {
    left: 0 !important;
    position: sticky !important;
    z-index: ${firstColumnStickyHeaderFooterZIndex} !important;
  }
  ${
    selectionType === 'multiple' &&
    `&:nth-of-type(2) {
    left: ${checkboxCellWidth}px !important;
    position: sticky !important;
    z-index: ${firstColumnStickyHeaderFooterZIndex} !important;
  }
  `
  }`
    : '';
  const firstColumnStickyFooterCellCSS = isFirstColumnSticky
    ? `
  &:nth-of-type(1) {
    left: 0 !important;
    position: sticky !important;
    z-index: ${firstColumnStickyHeaderFooterZIndex} !important;
  }
  ${
    selectionType === 'multiple' &&
    `&:nth-of-type(2) {
    left: ${checkboxCellWidth}px !important;
    position: sticky !important;
    z-index: ${firstColumnStickyHeaderFooterZIndex} !important;
  }
  `
  }`
    : '';
  const firstColumnStickyBodyCellCSS = isFirstColumnSticky
    ? `
  &:nth-of-type(1) {
    left: 0 !important;
    position: sticky !important;
  }
  ${
    selectionType === 'multiple' &&
    `&:nth-of-type(2) {
    left: ${checkboxCellWidth}px !important;
    position: sticky !important;
  }
  `
  }`
    : '';

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
    HeaderCell: `
    position: ${shouldHeaderBeSticky ? 'sticky' : 'relative'};
    top: ${shouldHeaderBeSticky ? '0' : undefined};
    ${firstColumnStickyHeaderCellCSS}
    `,
    Cell: `
    ${firstColumnStickyBodyCellCSS}
    `,
    FooterCell: `
    position: ${isFooterSticky ? 'sticky' : 'relative'};
    bottom: ${isFooterSticky ? '0' : undefined};
    ${firstColumnStickyFooterCellCSS}
    `,
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
      {isLoading ? (
        <BaseBox
          display="flex"
          flex={1}
          alignItems="center"
          justifyContent="center"
          height={height}
          {...getStyledProps(styledProps)}
          {...metaAttribute({ name: MetaConstants.Table })}
        >
          <Spinner accessibilityLabel="Loading Table" size="large" />
        </BaseBox>
      ) : (
        <BaseBox
          flex={1}
          position="relative"
          {...getStyledProps(styledProps)}
          {...metaAttribute({ name: MetaConstants.Table })}
        >
          {isRefreshing && (
            <BaseBox
              position="absolute"
              width="100%"
              height="100%"
              zIndex={refreshWrapperZIndex}
              backgroundColor={theme.colors.surface.overlay.background[800]}
              justifyContent="center"
              alignItems="center"
              display="flex"
            >
              <Spinner color="white" accessibilityLabel="Refreshing Table" size="large" />
            </BaseBox>
          )}
          {toolbar}
          <StyledReactTable
            role="table"
            layout={{ fixedHeader: shouldHeaderBeSticky, horizontalScroll: true }}
            data={data}
            // @ts-expect-error ignore this, theme clashes with styled-component's theme. We're using useTheme from blade to get actual theme
            theme={tableTheme}
            select={selectionType ? rowSelectConfig : null}
            sort={sortFunctions ? sort : null}
            styledProps={{
              height,
            }}
            pagination={hasPagination ? paginationConfig : null}
            {...metaAttribute({ name: MetaConstants.Table })}
          >
            {children}
          </StyledReactTable>
          {pagination}
        </BaseBox>
      )}
    </TableProvider>
  );
};

export { Table };
