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
import { useTree } from '@table-library/react-table-library/tree';
import styled from 'styled-components';
import usePresence from 'use-presence';
import type { TableContextType } from './TableContext';
import { TableContext } from './TableContext';
import { ComponentIds } from './componentIds';
import { useStickyColumnsLayout } from './useStickyColumnsLayout.web';
import {
  firstColumnStickyCornerZIndex,
  firstColumnStickySpannedZIndex,
  firstColumnStickyZIndex,
  refreshWrapperZIndex,
  tableBackgroundColor,
  tablePagination,
  tableStickyColumn,
  classes,
} from './tokens';
import type {
  TableProps,
  TableNode,
  Identifier,
  TablePaginationType,
  TableHeaderRowProps,
} from './types';
import { getTableBodyStyles } from './commonStyles';
import { TableSurface } from './TableSurface.web';
import { makeBorderSize, makeMotionTime, makeSpace } from '~utils';
import { getComponentId, isValidAllowedChildren } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import type { BoxProps } from '~components/Box';
import { getBaseBoxStyles } from '~components/Box/BaseBox/baseBoxStyles';
import BaseBox from '~components/Box/BaseBox';
import { Spinner } from '~components/Spinner';
import { Skeleton } from '~components/Skeleton';
import { getStyledProps } from '~components/Box/styledProps';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTheme } from '~components/BladeProvider';
import getIn from '~utils/lodashButBetter/get';
import { makeAccessible } from '~utils/makeAccessible';
import { useIsMobile } from '~utils/useIsMobile';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useListViewContext } from '~components/ListView/ListViewContext';

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

const StyledReactTable = styled(ReactTable)<{
  $styledProps?: {
    height?: BoxProps['height'];
    width?: BoxProps['width'];
    isVirtualized?: boolean;
    isSelectable?: boolean;
    showStripedRows?: boolean;
    hasStickyColumns?: boolean;
  };
}>(({ $styledProps }) => {
  const { theme } = useTheme();
  const styledPropsCSSObject = getBaseBoxStyles({
    theme,
    height: $styledProps?.height,
    ...($styledProps?.isVirtualized && {
      width: '100%',
    }),
  });
  const $isSelectable = $styledProps?.isSelectable;
  const $showStripedRows = $styledProps?.showStripedRows;
  return {
    '&&&': {
      ...styledPropsCSSObject,
      overflow: `${$styledProps?.isVirtualized ? 'unset' : 'auto'} !important`,
    },
    ...($styledProps?.isVirtualized
      ? getTableBodyStyles({
          isVirtualized: $styledProps?.isVirtualized,
          theme,
          height: $styledProps?.height,
          width: '100%',
          isSelectable: $isSelectable,
          showStripedRows: $showStripedRows,
        })
      : null),
    // A sticky cell can't move past the edge of the box that contains it. In a virtualized table
    // the header wrapper and the body rows are only as wide as the visible area, so when the
    // columns overflow, sticky cells would get pushed out of view on scrolling. Letting the
    // virtual list's inner element and the rows grow to the width of their columns fixes that.
    ...($styledProps?.isVirtualized && $styledProps?.hasStickyColumns
      ? {
          '& > div > div > div, tbody div tr': {
            minWidth: 'min-content',
          },
        }
      : null),
  };
});

// The sticky cells and the refresh overlay use z-indexes that only make sense inside the table.
// Isolating them in the wrapper's own stacking context keeps that scale from competing with
// app-level layers around the table (a page header scrolled over it, for example).
const StyledTableWrapper = styled(BaseBox)({
  isolation: 'isolate',
});

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

const SKELETON_ROW_COUNT = 7;
const SKELETON_CELL_WIDTHS = {
  first: '70%',
  last: '50%',
  middle: '75%',
  headerFirst: '80%',
  headerRest: '60%',
} as const;

const StyledSkeletonRow = styled(BaseBox)<{ $columns: number; $isHeader?: boolean }>(
  ({ theme, $columns, $isHeader }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${$columns}, minmax(100px, 1fr))`,
    paddingLeft: makeSpace(theme.spacing[4]),
    paddingRight: makeSpace(theme.spacing[4]),
    paddingTop: makeSpace(theme.spacing[$isHeader ? 3 : 4]),
    paddingBottom: makeSpace(theme.spacing[$isHeader ? 3 : 4]),
    borderBottomWidth: makeSpace(theme.border.width.thin),
    borderBottomColor: theme.colors.surface.border.gray.muted,
    borderBottomStyle: 'solid',
    gap: makeSpace(theme.spacing[4]),
    alignItems: 'center',
  }),
);

const _Table = <Item,>({
  children,
  data,
  multiSelectTrigger = 'row',
  selectionType = 'none',
  onSelectionChange,
  isHeaderSticky,
  isFooterSticky,
  isFirstColumnSticky,
  stickyColumns,
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
  backgroundColor = tableBackgroundColor,
  isGrouped = false,
  checkboxDisplay = 'always',
  ...rest
}: TableProps<Item>): React.ReactElement => {
  const { theme, colorScheme } = useTheme();
  const { isInsideListView } = useListViewContext();
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
  const tableRootComponent = children([]);
  const isVirtualized = getComponentId(tableRootComponent) === ComponentIds.VirtualizedTable;
  const isMobile = useIsMobile();
  const lastHoverActionsColWidth = isMobile ? '1fr' : '0px';

  // stickyColumns takes precedence, isFirstColumnSticky is the older way of pinning one column.
  // On mobile only the first column stays pinned so the pinned columns don't fill the screen.
  const requestedStickyColumnCount = Math.max(
    0,
    Math.floor(stickyColumns ?? (isFirstColumnSticky ? 1 : 0)),
  );
  const stickyColumnCount = isMobile
    ? Math.min(requestedStickyColumnCount, 1)
    : requestedStickyColumnCount;
  // The multi-select checkbox column is pinned along with the sticky columns but isn't counted
  const stickyCellCount =
    stickyColumnCount > 0 && selectionType === 'multiple'
      ? stickyColumnCount + 1
      : stickyColumnCount;
  // Need to make header is sticky if a column is sticky otherwise the sticky header cells will not be sticky
  const shouldHeaderBeSticky = isVirtualized || isHeaderSticky || stickyColumnCount > 0;

  const columnCount = getTableHeaderCellCount(children);
  const tableWrapperRef = React.useRef<HTMLDivElement>(null);
  const { stickyCellOffsets, gridColumnCount, isScrolledHorizontally } = useStickyColumnsLayout({
    tableWrapperRef,
    stickyCellCount,
    hasCheckboxColumn: selectionType === 'multiple',
    columnCount,
    isLoading,
  });
  // Cells are pinned once their offset is known, which can be fewer than asked for (see the hook)
  const pinnedCellCount = stickyCellOffsets.length;
  // The offsets change whenever a column resizes, so they go in CSS variables rather than in the
  // table theme, which would otherwise inject a new copy of the sticky styles on every change
  const getStickyCellOffsetVariable = (index: number): string =>
    `--blade-table-sticky-cell-left-${index}`;
  const stickyCellOffsetVariables = Object.fromEntries(
    stickyCellOffsets.map((offset, index) => [getStickyCellOffsetVariable(index), `${offset}px`]),
  ) as React.CSSProperties;

  const {
    isEntering: isRefreshSpinnerEntering,
    isMounted: isRefreshSpinnerMounted,
    isExiting: isRefreshSpinnerExiting,
    isVisible: isRefreshSpinnerVisible,
  } = usePresence(isRefreshing, {
    transitionDuration: theme.motion.duration.quick,
  });

  // Table Theme
  /*
   * Sticky stacking order: sticky header/footer cells (the corners) > sticky column body cells >
   * other cells. The corner cells (sticky both vertically and horizontally) must outrank the
   * sticky body cells, otherwise the body cells - which come later in the DOM - paint over them
   * when the table is scrolled. All sticky header/footer cells share the corner z-index on
   * purpose: until the real column widths are measured, the first data column sits right after
   * a checkbox column assumed to be 44px wide, which overlaps it when it is wider, and with equal
   * z-index the later cell in the DOM wins that overlap.
   */
  // The divider is the right border of a transparent layer over the last sticky cell. The layer
  // covers the whole cell so that its shadow comes off a full edge rather than a 1px line.
  // Once scrolled, the shadow shows how far the sticky columns reach. The layer reaches above the
  // cell so the shadow's downward offset still covers the top of the row, and the clip trims it
  // back to the row, keeping only the right side, so the shadows of stacked rows line up into one
  // even edge.
  const stickyColumnShadowOverhang = makeSpace(theme.spacing[7]);
  const stickyColumnDividerCSS = `
    content: '';
    position: absolute;
    top: -${stickyColumnShadowOverhang};
    right: 0;
    bottom: 0;
    left: 0;
    border-right: ${makeBorderSize(
      getIn(theme.border.width, tableStickyColumn.dividerWidth),
    )} solid ${getIn(theme.colors, tableStickyColumn.dividerColor)};
    pointer-events: none;
    box-shadow: ${
      isScrolledHorizontally ? theme.elevation[tableStickyColumn.shadowElevation] : 'none'
    };
    clip-path: inset(${stickyColumnShadowOverhang} -${stickyColumnShadowOverhang} 0 0);
    transition: box-shadow ${makeMotionTime(
      getIn(theme.motion, tableStickyColumn.shadowMotionDuration),
    )} ${getIn(theme.motion, tableStickyColumn.shadowMotionEasing)};
  `;
  /*
   * The divider goes on the last sticky cell of a row, but only in rows that have a cell for every
   * column. In a row with a cell spanning columns, or below a cell spanning rows, the nth sticky
   * cell isn't in the nth column, so those rows get no divider rather than one in the wrong place
   * (a sticky cell spanning rows still draws it down its full height). Until the grid is measured
   * (and in jsdom) the column count isn't known, so every row gets it.
   */
  const getStickyColumnDividerSelector = (rowCellCounts: number[]): string =>
    gridColumnCount === null
      ? `&:nth-of-type(${pinnedCellCount})::after`
      : rowCellCounts
          .filter((rowCellCount) => rowCellCount >= pinnedCellCount)
          .map(
            (rowCellCount) =>
              `&:nth-of-type(${pinnedCellCount}):nth-last-of-type(${
                rowCellCount - pinnedCellCount + 1
              })::after`,
          )
          .join(', ');
  // The header renders a cell for the hover actions column, body rows only when they have hover
  // actions, and footer rows never do
  const hoverActionsCellCount = hasHoverActions ? 1 : 0;
  const gridColumnCountWithoutHoverActions = (gridColumnCount ?? 0) - hoverActionsCellCount;
  const stickyHeaderCellDividerSelector = getStickyColumnDividerSelector([gridColumnCount ?? 0]);
  const stickyBodyCellDividerSelector = getStickyColumnDividerSelector(
    hasHoverActions
      ? [gridColumnCount ?? 0, gridColumnCountWithoutHoverActions]
      : [gridColumnCount ?? 0],
  );
  const stickyFooterCellDividerSelector = getStickyColumnDividerSelector([
    gridColumnCountWithoutHoverActions,
  ]);
  const getStickyCellCSS = ({
    zIndex,
    spannedZIndex,
    dividerSelector,
  }: {
    zIndex: number;
    spannedZIndex: number;
    dividerSelector: string;
  }): string =>
    Array.from({ length: pinnedCellCount }, (_, index) => {
      const nth = index + 1;
      return `
  &:nth-of-type(${nth}) {
    left: var(${getStickyCellOffsetVariable(index)}) !important;
    position: sticky !important;
    z-index: ${zIndex} !important;
  }
  /* Higher z-index for sticky cells that also span rows to prevent stacking issues */
  &:nth-of-type(${nth}).${classes.HAS_ROW_SPANNING} {
    z-index: ${spannedZIndex} !important;
  }`;
    })
      .concat(
        pinnedCellCount > 0 && dividerSelector
          ? `
  ${dividerSelector} {
    ${stickyColumnDividerCSS}
  }`
          : [],
      )
      .join('');
  const stickyHeaderCellCSS = getStickyCellCSS({
    zIndex: firstColumnStickyCornerZIndex,
    spannedZIndex: firstColumnStickyCornerZIndex,
    dividerSelector: stickyHeaderCellDividerSelector,
  });
  const stickyBodyCellCSS = getStickyCellCSS({
    zIndex: firstColumnStickyZIndex,
    spannedZIndex: firstColumnStickySpannedZIndex,
    dividerSelector: stickyBodyCellDividerSelector,
  });
  const stickyFooterCellCSS = getStickyCellCSS({
    zIndex: firstColumnStickyCornerZIndex,
    spannedZIndex: firstColumnStickyCornerZIndex,
    dividerSelector: stickyFooterCellDividerSelector,
  });

  const tableTheme = useTableTheme({
    Table: `
    height:${isFooterSticky ? `100%` : undefined};
    ${
      toolbar && !isInsideListView
        ? `border-top: ${makeBorderSize(theme.border.width.thin)} solid ${
            theme.colors.surface.border.gray.muted
          };`
        : ''
    }
    ${
      pagination
        ? `border-bottom: ${makeBorderSize(theme.border.width.thin)} solid ${
            theme.colors.surface.border.gray.muted
          };`
        : ''
    }
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
    ${stickyHeaderCellCSS}
    `,
    Cell: `
    ${stickyBodyCellCSS}
    `,
    FooterCell: `
    position: ${isFooterSticky ? 'sticky' : 'relative'};
    bottom: ${isFooterSticky ? '0' : undefined};
    ${stickyFooterCellCSS}
    `,
  });

  useEffect(() => {
    // Get the total number of items
    setTotalItems(data.nodes.length);
  }, [data.nodes]);

  // Selection Logic
  const onSelectChange: MiddlewareFunction = (_, state): void => {
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
      // Use recursive selection only for grouped tables with multiple selection
      if (selectionType === 'multiple' && isGrouped) {
        rowSelectConfig.fns.onToggleByIdRecursively(id, {
          // When clicking partially selected parent, select all children
          isPartialToAll: true,
        });
      } else {
        rowSelectConfig.fns.onToggleById(id);
      }
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
      } else if (isGrouped) {
        rowSelectConfig.fns.onToggleAll({});
      } else {
        const ids = data.nodes
          .map((item: TableNode<Item>) => (disabledRows.includes(item.id) ? null : item.id))
          .filter(Boolean) as Identifier[];

        rowSelectConfig.fns.onAddAll(ids);
      }
    },
    [rowSelectConfig.fns, data.nodes, selectedRows, disabledRows],
  );

  const tree = useTree(
    isGrouped ? data : { nodes: [] },
    {},
    {
      // Disable row click expand/collapse (fallback enables unwanted expand/collapse on row click)
      clickType: undefined,
      // Disable all indentation for flat appearance
      treeYLevel: undefined,
    },
  );

  useIsomorphicLayoutEffect(() => {
    if (isGrouped && tree?.fns.onToggleAll) {
      tree.fns.onToggleAll({ ids: [] });
    }
  }, []);

  // Sort Logic
  const handleSortChange: MiddlewareFunction = (_, state) => {
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

  const currentSortedState: TableContextType<Item>['currentSortedState'] = useMemo(() => {
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

  // Extract defaultPageSize from TablePagination child props
  const paginationDefaultPageSize =
    React.isValidElement(pagination) && getComponentId(pagination) === ComponentIds.TablePagination
      ? (pagination.props as { defaultPageSize?: number }).defaultPageSize
      : undefined;

  const paginationConfig = usePagination(
    data,
    {
      state: {
        page: 0,
        size: paginationDefaultPageSize ?? tablePagination.defaultPageSize,
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
  const tableContext: TableContextType<Item> = useMemo(
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
      multiSelectTrigger,
      columnCount,
      gridTemplateColumns,
      isVirtualized,
      tableData: data.nodes,
      isGrouped,
      tableToolbarPlacement: toolbar?.props?.placement ?? 'inline',
      checkboxDisplay,
    }),
    [
      selectionType,
      selectedRows,
      totalItems,
      toggleRowSelectionById,
      toggleAllRowsSelection,
      deselectAllRows,
      gridTemplateColumns,
      rowDensity,
      toggleSort,
      columnCount,
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
      multiSelectTrigger,
      isVirtualized,
      data,
      isGrouped,
      checkboxDisplay,
    ],
  );

  return (
    <TableContext.Provider value={tableContext}>
      <TableSurface
        colorScheme={colorScheme}
        borderRadius={isInsideListView ? 'none' : 'medium'}
        overflow="hidden"
        isInsideListView={isInsideListView ?? false}
        // Transparent when inside ListView so the gradient pseudo-elements
        // on ListViewSurface remain visible through the TableSurface.
        backgroundColor={isInsideListView ? 'transparent' : 'surface.background.gray.intense'}
      >
        {isLoading ? (
          <BaseBox
            flex={1}
            {...getStyledProps(rest)}
            {...metaAttribute({ name: MetaConstants.Table })}
            {...makeAnalyticsAttribute(rest)}
            testID="table-skeleton"
          >
            {/* Header skeleton row */}
            <StyledSkeletonRow $columns={columnCount || 5} $isHeader>
              {Array.from({ length: columnCount || 5 }).map((_, i) => (
                <Skeleton
                  key={i}
                  width={
                    i === 0 ? SKELETON_CELL_WIDTHS.headerFirst : SKELETON_CELL_WIDTHS.headerRest
                  }
                  height="16px"
                  borderRadius="medium"
                />
              ))}
            </StyledSkeletonRow>
            {/* Body skeleton rows */}
            {Array.from({ length: SKELETON_ROW_COUNT }).map((_, rowIdx) => (
              <StyledSkeletonRow key={rowIdx} $columns={columnCount || 5}>
                {Array.from({ length: columnCount || 5 }).map((_, colIdx) => {
                  const cols = columnCount || 5;
                  const width =
                    colIdx === 0
                      ? SKELETON_CELL_WIDTHS.first
                      : colIdx === cols - 1
                      ? SKELETON_CELL_WIDTHS.last
                      : SKELETON_CELL_WIDTHS.middle;
                  return (
                    <Skeleton key={colIdx} width={width} height="14px" borderRadius="medium" />
                  );
                })}
              </StyledSkeletonRow>
            ))}
          </BaseBox>
        ) : (
          <StyledTableWrapper
            ref={tableWrapperRef}
            style={stickyCellOffsetVariables}
            flex={1}
            position="relative"
            {...getStyledProps(rest)}
            {...metaAttribute({ name: MetaConstants.Table })}
            width={isVirtualized ? `100%` : undefined}
            {...makeAnalyticsAttribute(rest)}
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
            {/* wrapping toolbar in BaseBox and passing the same analytics attributes as of table because in analytics POV, events triggered are from table */}
            <BaseBox {...makeAnalyticsAttribute(rest)}>{toolbar}</BaseBox>
            <StyledReactTable
              role="table"
              layout={{ fixedHeader: shouldHeaderBeSticky, horizontalScroll: true }}
              data={data}
              // @ts-expect-error ignore this, theme clashes with styled-component's theme. We're using useTheme from blade to get actual theme
              theme={tableTheme}
              select={selectionType !== 'none' ? rowSelectConfig : null}
              sort={sortFunctions ? sort : null}
              tree={isGrouped ? tree : null}
              $styledProps={{
                height,
                width: isVirtualized ? `100%` : undefined,
                isVirtualized,
                isSelectable: selectionType !== 'none',
                showStripedRows,
                hasStickyColumns: stickyCellCount > 0,
              }}
              pagination={hasPagination ? paginationConfig : null}
              {...makeAccessible({ multiSelectable: selectionType === 'multiple' })}
              {...metaAttribute({ name: MetaConstants.Table })}
              {...makeAnalyticsAttribute(rest)}
            >
              {children}
            </StyledReactTable>
            {pagination}
          </StyledTableWrapper>
        )}
      </TableSurface>
    </TableContext.Provider>
  );
};
const Table = assignWithoutSideEffects(_Table, {
  componentId: ComponentIds.Table,
});

export { Table };
