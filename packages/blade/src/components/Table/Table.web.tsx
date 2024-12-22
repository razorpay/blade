import React, { useCallback, useEffect, useMemo } from 'react';
import { Table as ReactTable } from '@table-library/react-table-library/table';
import { useTheme as useTableTheme } from '@table-library/react-table-library/theme';
import type { MiddlewareFunction } from '@table-library/react-table-library/types/common';
import { useSort } from '@table-library/react-table-library/sort';
import { usePagination } from '@table-library/react-table-library/pagination';
import {
  SelectClickTypes,
  SelectTypes,
  useRowSelect,
} from '@table-library/react-table-library/select';
import styled from 'styled-components';
import usePresence from 'use-presence';
import type { TableContextType } from './TableContext';
import { TableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import {
  checkboxCellWidth,
  firstColumnStickyZIndex,
  refreshWrapperZIndex,
  tableBackgroundColor,
  tablePagination,
} from './tokens';
import type {
  TableProps,
  TableNode,
  Identifier,
  TablePaginationType,
  TableHeaderRowProps,
} from './types';
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
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
        ? theme.motion.easing.entrance
        : isRefreshSpinnerExiting
        ? theme.motion.easing.exit
        : ''
    }`,
  };
});

const _Table = <Item,>({
  children,
  data,
  multiSelectTrigger = 'row',
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
  showBorderedCells = false,
  defaultSelectedIds = [],
  ...rest
}: TableProps<Item>): React.ReactElement => {
  const { theme } = useTheme();
  const [selectedRows, setSelectedRows] = React.useState<TableNode<unknown>['id'][]>(
    selectionType !== 'none' ? defaultSelectedIds : [],
  );
  const [disabledRows, setDisabledRows] = React.useState<TableNode<unknown>['id'][]>([]);
  const [totalItems, setTotalItems] = React.useState(data.nodes.length || 0);
  const [paginationType, setPaginationType] = React.useState<NonNullable<TablePaginationType>>(
    'client',
  );
  const [headerRowDensity, setHeaderRowDensity] = React.useState<TableHeaderRowProps['rowDensity']>(
    undefined,
  );
  const [hasHoverActions, setHasHoverActions] = React.useState(false);
  // Need to make header is sticky if first column is sticky otherwise the first header cell will not be sticky
  const shouldHeaderBeSticky = isHeaderSticky ?? isFirstColumnSticky;
  const backgroundColor = tableBackgroundColor;

  const isMobile = useIsMobile();
  const lastHoverActionsColWidth = isMobile ? '1fr' : '0px';

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
    z-index: ${firstColumnStickyZIndex} !important;
  }
  ${
    selectionType === 'multiple' &&
    `&:nth-of-type(2) {
    left: ${checkboxCellWidth}px !important;
    position: sticky !important;
    z-index: ${firstColumnStickyZIndex} !important;
  }
  `
  }`
    : '';
  const firstColumnStickyFooterCellCSS = isFirstColumnSticky
    ? `
  &:nth-of-type(1) {
    left: 0 !important;
    position: sticky !important;
    z-index: ${firstColumnStickyZIndex} !important;
  }
  ${
    selectionType === 'multiple' &&
    `&:nth-of-type(2) {
    left: ${checkboxCellWidth}px !important;
    position: sticky !important;
    z-index: ${firstColumnStickyZIndex} !important;
  }
  `
  }`
    : '';
  const firstColumnStickyBodyCellCSS = isFirstColumnSticky
    ? `
  &:nth-of-type(1) {
    left: 0 !important;
    position: sticky !important;
    z-index: ${firstColumnStickyZIndex} !important;
  }
  ${
    selectionType === 'multiple' &&
    `&:nth-of-type(2) {
    left: ${checkboxCellWidth}px !important;
    position: sticky !important;
    z-index: ${firstColumnStickyZIndex} !important;
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
      gridTemplateColumns
        ? `${gridTemplateColumns} ${hasHoverActions ? lastHoverActionsColWidth : ''}`
        : ` ${
            selectionType === 'multiple' ? 'min-content' : ''
          } repeat(${columnCount},minmax(100px, 1fr)) ${
            hasHoverActions ? lastHoverActionsColWidth : ''
          } !important;`
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
    const selectedIds: Identifier[] = state.id ? [state.id] : state.ids ?? [];
    setSelectedRows(selectedIds);
    onSelectionChange?.({
      selectedIds,
      values: data.nodes.filter((node) => selectedIds.includes(node.id)),
    });
  };

  const rowSelectConfig = useRowSelect(
    data,
    {
      onChange: onSelectChange,
      state: {
        ...(selectionType === 'multiple'
          ? { ids: selectedRows }
          : selectionType === 'single'
          ? { id: selectedRows[0] }
          : {}),
      },
    },
    {
      clickType:
        multiSelectTrigger === 'row' ? SelectClickTypes.RowClick : SelectClickTypes.ButtonClick,
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

  const paginationConfig = usePagination(
    data,
    {
      state: {
        page: 0,
        size: tablePagination.defaultPageSize,
      },
    },
    {
      isServer: paginationType === 'server',
    },
  );

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
      paginationType,
      setPaginationType,
      backgroundColor,
      headerRowDensity,
      setHeaderRowDensity,
      showBorderedCells,
      hasHoverActions,
      setHasHoverActions,
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
      paginationType,
      setPaginationType,
      backgroundColor,
      headerRowDensity,
      setHeaderRowDensity,
      showBorderedCells,
      hasHoverActions,
      setHasHoverActions,
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
          {...getStyledProps(rest)}
          {...metaAttribute({ name: MetaConstants.Table })}
          {...makeAnalyticsAttribute(rest)}
        >
          <Spinner accessibilityLabel="Loading Table" size="large" testID="table-spinner" />
        </BaseBox>
      ) : (
        <BaseBox
          // ref={ref as never}
          flex={1}
          position="relative"
          {...getStyledProps(rest)}
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
            {...makeAccessible({ multiSelectable: selectionType === 'multiple' })}
            {...metaAttribute({ name: MetaConstants.Table })}
            {...makeAnalyticsAttribute(rest)}
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
