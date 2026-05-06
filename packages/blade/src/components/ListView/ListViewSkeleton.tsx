import React from 'react';
import { Skeleton } from '~components/Skeleton';
import { Box } from '~components/Box';
import type { SpacingValueType } from '~components/Box/BaseBox/types/spacingTypes';

type ListViewSkeletonProps = {
  /**
   * Number of skeleton table rows to render.
   * @default 7
   */
  rows?: number;
  /**
   * Number of skeleton table columns to render.
   * @default 5
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

/**
 * `ListViewSkeleton` renders an animated shimmer placeholder that mirrors the
 * full structure of a `ListView` — QuickFilter tabs, search action area, table
 * header, table rows, and pagination.
 *
 * Use it as a drop-in replacement for `<ListView>` while data is loading.
 *
 * ### Usage
 * ```tsx
 * if (isLoading) {
 *   return <ListViewSkeleton rows={7} columns={5} />;
 * }
 * return (
 *   <ListView>
 *     <ListViewFilters ... />
 *     <Table ... />
 *   </ListView>
 * );
 * ```
 */
const ListViewSkeleton = ({
  rows = 7,
  columns = 5,
  showFilters = true,
  showPagination = true,
}: ListViewSkeletonProps): React.ReactElement => {
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
      <Box
        testID="list-view-skeleton-header"
        display="grid"
        gridTemplateColumns={`repeat(${columns}, minmax(100px, 1fr))`}
        paddingX="spacing.5"
        paddingY="spacing.3"
        borderBottomWidth="thin"
        borderBottomColor="surface.border.gray.muted"
        gap="spacing.4"
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            width={i === 0 ? CELL_WIDTHS.headerFirst : CELL_WIDTHS.headerRest}
            height="16px"
            borderRadius="medium"
          />
        ))}
      </Box>

      {/* ── Table rows ─────────────────────────────────────────────── */}
      <Box testID="list-view-skeleton-rows">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <Box
            key={rowIdx}
            testID={`list-view-skeleton-row-${rowIdx}`}
            display="grid"
            gridTemplateColumns={`repeat(${columns}, minmax(100px, 1fr))`}
            paddingX="spacing.5"
            paddingY="spacing.4"
            borderBottomWidth="thin"
            borderBottomColor="surface.border.gray.muted"
            gap="spacing.4"
            alignItems="center"
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
          </Box>
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
