import React from 'react';
import styled from 'styled-components';
import { Skeleton } from '~components/Skeleton';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import type { SpacingValueType } from '~components/Box/BaseBox/types/spacingTypes';
import { makeSpace } from '~utils';
import { useListViewContext } from './ListViewContext';

type ListViewSkeletonProps = {
  /**
   * Number of skeleton table rows to render.
   * @default 7
   */
  rows?: number;
  /**
   * Number of skeleton table columns to render.
   *
   * When `<ListViewSkeleton>` is placed inside `<ListView columns={N}>`, this
   * value is automatically inherited from the ListView context — you do **not**
   * need to pass it manually.
   *
   * Only set this explicitly when rendering `<ListViewSkeleton>` outside of a
   * `<ListView>` wrapper.
   *
   * @default inherited from `<ListView columns>` context, or 5
   */
  columns?: number;
  /**
   * Whether to show the QuickFilter + search skeleton above the table.
   * @default true
   */
  showFilters?: boolean;
  /**
   * Whether to show the pagination skeleton below the table.
   * @default true
   */
  showPagination?: boolean;
};

// Widths typed as SpacingValueType so they satisfy Box/Skeleton prop constraints.
// Values are varied per column position to look like real data rather than a uniform grid.
const CELL_WIDTHS = {
  first: '70%' as SpacingValueType,
  last: '50%' as SpacingValueType,
  middle: '75%' as SpacingValueType,
  headerFirst: '80%' as SpacingValueType,
  headerRest: '60%' as SpacingValueType,
};

const FILTER_TAB_WIDTHS: SpacingValueType[] = ['80px', '64px', '72px', '70px'];

// Box only allows display "flex"|"none", so we use a styled-component for grid
// layout — the same pattern used by Table's internal row components.
// $spacingKey selects which theme.spacing index to use for paddingY:
//   3 → 8px (header row), 4 → 12px (data rows)
const StyledGridRow = styled(BaseBox)<{ $columns: number; $spacingKey: 3 | 4 }>(
  ({ theme, $columns, $spacingKey }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${$columns}, minmax(100px, 1fr))`,
    paddingLeft: makeSpace(theme.spacing[5]),
    paddingRight: makeSpace(theme.spacing[5]),
    paddingTop: makeSpace(theme.spacing[$spacingKey]),
    paddingBottom: makeSpace(theme.spacing[$spacingKey]),
    borderBottomWidth: makeSpace(theme.border.width.thin),
    borderBottomColor: theme.colors.surface.border.gray.muted,
    borderBottomStyle: 'solid',
    gap: makeSpace(theme.spacing[4]),
    alignItems: 'center',
  }),
);

/**
 * `ListViewSkeleton` renders an animated shimmer placeholder that mirrors the
 * full structure of a `ListView` — QuickFilter tabs, search action area, table
 * header, table rows, and pagination.
 *
 * ### Recommended usage — inside `<ListView>`
 *
 * Place `<ListViewSkeleton>` as a child of `<ListView columns={N}>`. The column
 * count is inherited automatically via context, so the skeleton always matches
 * the real table without any extra props.
 *
 * ```tsx
 * <ListView columns={4}>
 *   {isLoading ? (
 *     <ListViewSkeleton />
 *   ) : (
 *     <>
 *       <ListViewFilters ... />
 *       <Table> ... </Table>
 *     </>
 *   )}
 * </ListView>
 * ```
 *
 * ### Standalone usage — outside `<ListView>`
 *
 * Pass `columns` explicitly if rendering the skeleton outside a `<ListView>`:
 *
 * ```tsx
 * if (isLoading) return <ListViewSkeleton columns={4} rows={7} />;
 * return <ListView columns={4}>...</ListView>;
 * ```
 */
const ListViewSkeleton = ({
  rows = 7,
  columns: columnsProp,
  showFilters = true,
  showPagination = true,
}: ListViewSkeletonProps): React.ReactElement => {
  // When inside a <ListView columns={N}>, inherit the column count automatically.
  // The explicit prop overrides context (useful for standalone usage outside ListView).
  const { columns: contextColumns } = useListViewContext();
  const columns = columnsProp ?? contextColumns;

  return (
    <Box display="flex" flexDirection="column" width="100%" testID="list-view-skeleton">
      {/* ── Filter bar ─────────────────────────────────────────────── */}
      {showFilters && (
        <Box
          testID="list-view-skeleton-filters"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingX="spacing.5"
          paddingY="spacing.4"
          borderBottomWidth="thin"
          borderBottomColor="surface.border.gray.muted"
          gap="spacing.4"
        >
          {/* QuickFilter pill-shaped tab skeletons */}
          <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="center">
            {FILTER_TAB_WIDTHS.map((width, i) => (
              <Skeleton key={i} width={width} height="32px" borderRadius="max" />
            ))}
          </Box>

          {/* Search / action area skeleton */}
          <Skeleton width="200px" height="36px" borderRadius="medium" />
        </Box>
      )}

      {/* ── Table header ───────────────────────────────────────────── */}
      <StyledGridRow testID="list-view-skeleton-header" $columns={columns} $spacingKey={3}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === 0 ? CELL_WIDTHS.headerFirst : CELL_WIDTHS.headerRest}
            height="16px"
            borderRadius="medium"
          />
        ))}
      </StyledGridRow>

      {/* ── Table rows ─────────────────────────────────────────────── */}
      <Box testID="list-view-skeleton-rows">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <StyledGridRow
            key={rowIdx}
            testID={`list-view-skeleton-row-${rowIdx}`}
            $columns={columns}
            $spacingKey={4}
          >
            {Array.from({ length: columns }).map((_, colIdx) => {
              const width =
                colIdx === 0
                  ? CELL_WIDTHS.first
                  : colIdx === columns - 1
                  ? CELL_WIDTHS.last
                  : CELL_WIDTHS.middle;
              return <Skeleton key={colIdx} width={width} height="14px" borderRadius="medium" />;
            })}
          </StyledGridRow>
        ))}
      </Box>

      {/* ── Pagination bar ─────────────────────────────────────────── */}
      {showPagination && (
        <Box
          testID="list-view-skeleton-pagination"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
          paddingX="spacing.5"
          paddingY="spacing.4"
          gap="spacing.3"
        >
          <Skeleton width="80px" height="32px" borderRadius="medium" />
          <Skeleton width="120px" height="32px" borderRadius="medium" />
          <Skeleton width="80px" height="32px" borderRadius="medium" />
        </Box>
      )}
    </Box>
  );
};

export { ListViewSkeleton };
export type { ListViewSkeletonProps };
