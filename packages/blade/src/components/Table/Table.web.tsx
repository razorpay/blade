import React, { useCallback, useEffect, useMemo } from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import type { MiddlewareFunction } from '@table-library/react-table-library/types/common';
import { useSort } from '@table-library/react-table-library/sort';
import { usePagination } from '@table-library/react-table-library/pagination';
import { SelectTypes, useRowSelect } from '@table-library/react-table-library/select';
import styled from 'styled-components';
import usePresence from 'use-presence';
import type { TableContextType } from './TableContext';
import { TableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import {
  checkboxCellWidth,
  firstColumnStickyHeaderFooterZIndex,
  refreshWrapperZIndex,
  tableBackgroundColor,
  tablePagination,
} from './tokens';
import type { TableProps, TableNode, Identifier } from './types';
import { makeBorderSize, makeMotionTime } from '~utils';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import type { BoxProps } from '~components/Box';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import { getStyledProps } from '~components/Box/styledProps';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';

const rowSelectType: Record<
  NonNullable<TableProps<unknown>['selectionType']>,
  SelectTypes | undefined
> = {
  single: SelectTypes.SingleSelect,
  multiple: SelectTypes.MultiSelect,
  none: undefined,
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

const StyledReactTable = styled(ReactTable)<{ $styledProps?: { height?: BoxProps['height'] } }>(
  ({ $styledProps }) => {
    const { theme } = useTheme();
    const styledPropsCSSObject = getBaseBoxStyles({
      theme,
      height: $styledProps?.height,
    });

    return {
      '&&&': {
        ...styledPropsCSSObject,
      },
    };
  },
);

const RefreshWrapper = styled(BaseBox)<{
  isRefreshSpinnerVisible: boolean;
  isRefreshSpinnerEntering: boolean;
  isRefreshSpinnerExiting: boolean;
}>(({ isRefreshSpinnerVisible, isRefreshSpinnerEntering, isRefreshSpinnerExiting, theme }) => {
  return {
    opacity: isRefreshSpinnerVisible ? 1 : 0,
    transition: `opacity ${makeMotionTime(theme.motion.duration.quick)} ${
      isRefreshSpinnerEntering
        ? theme.motion.easing.entrance.effective
        : isRefreshSpinnerExiting
        ? theme.motion.easing.exit.effective
        : ''
    }`,
  };
});

const _Table = <Item,>({
  children,
  data,
  selectionType = 'none',
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
  showStripedRows,
  gridTemplateColumns,
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
  const backgroundColor = tableBackgroundColor;

  const {
    isEntering: isRefreshSpinnerEntering,
    isMounted: isRefreshSpinnerMounted,
    isExiting: isRefreshSpinnerExiting,
    isVisible: isRefreshSpinnerVisible,
  } = usePresence(isRefreshing, {
    transitionDuration: theme.motion.duration.quick,
  });

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
      theme.colors.surface.border.gray.muted
    };
    --data-table-library_grid-template-columns: ${
      gridTemplateColumns ??
      ` ${
        selectionType === 'multiple' ? 'min-content' : ''
      } repeat(${columnCount},minmax(100px, 1fr)) !important;`
    } !important;
    background-color: ${getIn(theme.colors, backgroundColor)};
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
      values: data.nodes.filter((node) => selectedIDs.includes(node.id)),
    });
  };

  const rowSelectConfig = useRowSelect(
    data,
    {
      onChange: onSelectChange,
    },
    {
      rowSelect: selectionType !== 'none' ? rowSelectType[selectionType] : undefined,
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
      showStripedRows,
      disabledRows,
      setDisabledRows,
      backgroundColor,
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
      showStripedRows,
      disabledRows,
      setDisabledRows,
      backgroundColor,
    ],
  );

  return (
    <TableContext.Provider value={tableContext}>
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
          {isRefreshSpinnerMounted && (
            <RefreshWrapper
              position="absolute"
              width="100%"
              height="100%"
              zIndex={refreshWrapperZIndex}
              backgroundColor="overlay.background.subtle"
              justifyContent="center"
              alignItems="center"
              display="flex"
              isRefreshSpinnerEntering={isRefreshSpinnerEntering}
              isRefreshSpinnerExiting={isRefreshSpinnerExiting}
              isRefreshSpinnerVisible={isRefreshSpinnerVisible}
            >
              <Spinner color="white" accessibilityLabel="Refreshing Table" size="large" />
            </RefreshWrapper>
          )}
          {toolbar}
          <StyledReactTable
            role="table"
            layout={{ fixedHeader: shouldHeaderBeSticky, horizontalScroll: true }}
            data={data}
            // @ts-expect-error ignore this, theme clashes with styled-component's theme. We're using useTheme from blade to get actual theme
            theme={tableTheme}
            select={selectionType !== 'none' ? rowSelectConfig : null}
            sort={sortFunctions ? sort : null}
            $styledProps={{
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
    </TableContext.Provider>
  );
};

const Table = assignWithoutSideEffects(_Table, {
  componentId: ComponentIds.Table,
});

export { Table };
