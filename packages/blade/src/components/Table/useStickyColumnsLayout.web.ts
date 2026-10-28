import React from 'react';
import { checkboxCellWidth } from './tokens';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';

type StickyColumnsLayout = {
  /**
   * `left` offset of each cell to pin: the sum of the widths of the columns before it. Only cells
   * whose offset is known are listed, so it can be shorter than the number of sticky cells asked
   * for: before the grid is measured, or when the table has fewer columns than that.
   */
  stickyCellOffsets: number[];
  /** Number of columns in the table grid, `null` until the grid is measured */
  gridColumnCount: number | null;
};

type StickyColumnsState = StickyColumnsLayout & {
  /** Whether the table is scrolled away from its left edge, so columns are sliding under the sticky ones */
  isScrolledHorizontally: boolean;
};

/**
 * Offsets used until the grid is measured, and wherever there is no layout to measure (a hidden
 * table, jsdom). Only the first column's offset is known without measuring (after the checkbox
 * column, assumed to be its default width), so the columns after it aren't pinned until then
 * rather than all being stacked on the same offset.
 */
const getFallbackOffsets = ({
  stickyCellCount,
  hasCheckboxColumn,
}: {
  stickyCellCount: number;
  hasCheckboxColumn: boolean;
}): number[] => (hasCheckboxColumn ? [0, checkboxCellWidth] : [0]).slice(0, stickyCellCount);

/**
 * Reads the column widths from the resolved `grid-template-columns` of the grid the cells are
 * laid out in. Unlike the widths of the cells in a row, these stay right when cells span columns
 * or rows. Returns `null` when the grid isn't laid out (a hidden table, jsdom), in which case the
 * computed value is the declared template rather than a list of pixel widths.
 */
const getGridColumnWidths = (grid: Element): number[] | null => {
  const tracks = window.getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/);
  if (!tracks.every((track) => /^-?[\d.]+px$/.test(track))) return null;
  const widths = tracks.map((track) => parseFloat(track));
  return widths.every((width) => !Number.isNaN(width)) ? widths : null;
};

// Rows (tr) are `display: contents` in a regular table, so the grid is the table element, while
// in a virtualized table every row and the header wrapper are grids of their own.
const getClosestGrid = (element: Element | null): Element | null => {
  let current = element;
  while (current) {
    if (window.getComputedStyle(current).display === 'grid') return current;
    current = current.parentElement;
  }
  return null;
};

const areLayoutsEqual = (a: StickyColumnsLayout, b: StickyColumnsLayout): boolean =>
  a.gridColumnCount === b.gridColumnCount &&
  a.stickyCellOffsets.length === b.stickyCellOffsets.length &&
  a.stickyCellOffsets.every((offset, index) => offset === b.stickyCellOffsets[index]);

/**
 * Measures where each sticky cell sits and how many columns the table has, and tracks whether the
 * table is scrolled horizontally. Column widths depend on `gridTemplateColumns` and on the content,
 * so they are measured again whenever the rows change or one of the sticky cells resizes.
 */
const useStickyColumnsLayout = ({
  tableWrapperRef,
  stickyCellCount,
  hasCheckboxColumn,
  columnCount,
  isLoading,
}: {
  tableWrapperRef: React.RefObject<HTMLDivElement>;
  /** Number of sticky cells in a row, including the multi-select checkbox cell */
  stickyCellCount: number;
  hasCheckboxColumn: boolean;
  /** Changes when columns are added or removed, so the new columns are measured */
  columnCount: number;
  /** The table is remounted when it leaves the loading state, so the new grid is measured */
  isLoading: boolean;
}): StickyColumnsState => {
  const fallbackOffsets = React.useMemo(
    () => getFallbackOffsets({ stickyCellCount, hasCheckboxColumn }),
    [stickyCellCount, hasCheckboxColumn],
  );
  const [measuredLayout, setMeasuredLayout] = React.useState<StickyColumnsLayout | null>(null);

  useIsomorphicLayoutEffect(() => {
    const tableWrapper = tableWrapperRef.current;
    if (stickyCellCount <= 0 || isLoading || !tableWrapper) return undefined;

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure());
    const observedElements = new Set<Element>();
    const observe = (element: Element): void => {
      if (resizeObserver && !observedElements.has(element)) {
        observedElements.add(element);
        resizeObserver.observe(element);
      }
    };
    // The row the last measurement was taken from, see the mutation observer below
    let measuredRow: Element | null = null;

    function measure(): void {
      // The table library renders its rows after this effect runs, so the cells are looked up on
      // every measurement
      const firstRow = tableWrapper?.querySelector('tr');
      const grid = getClosestGrid(firstRow?.firstElementChild ?? null);
      if (!firstRow || !grid) return;
      // The grid resizes with the table and the sticky cells resize when their column does
      observe(grid);
      Array.from(firstRow.children)
        .slice(0, stickyCellCount)
        .forEach((cell) => observe(cell));

      const columnWidths = getGridColumnWidths(grid);
      if (!columnWidths) return;
      measuredRow = firstRow;

      // Asking for more sticky columns than the table has pins all of them
      const layout: StickyColumnsLayout = {
        stickyCellOffsets: columnWidths
          .slice(0, stickyCellCount)
          .map((_, index) => columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0)),
        gridColumnCount: columnWidths.length,
      };
      setMeasuredLayout((previousLayout) =>
        previousLayout && areLayoutsEqual(previousLayout, layout) ? previousLayout : layout,
      );
    }

    measure();
    // Measure again when the rows render or the first row is replaced, since its cells may not have
    // existed yet. Other changes are skipped: a virtualized table swaps rows on every scroll frame,
    // and column width changes are already caught by the resize observer.
    const mutationObserver =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => {
            if (tableWrapper.querySelector('tr') !== measuredRow) measure();
          });
    mutationObserver?.observe(tableWrapper, { childList: true, subtree: true });
    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [stickyCellCount, hasCheckboxColumn, columnCount, isLoading]);

  const [isScrolledHorizontally, setIsScrolledHorizontally] = React.useState(false);

  React.useEffect(() => {
    const tableWrapper = tableWrapperRef.current;
    if (stickyCellCount <= 0 || isLoading || !tableWrapper) return undefined;

    // Scroll events don't bubble, so they are caught on the way down. Which element scrolls
    // differs between a regular and a virtualized table, so any scroll container holding the rows
    // counts, while scrolling inside a cell (a text area, say) doesn't.
    const handleScroll = (event: Event): void => {
      const scrollContainer = event.target;
      if (!(scrollContainer instanceof Element)) return;
      const firstRow = tableWrapper.querySelector('tr');
      if (!firstRow || !scrollContainer.contains(firstRow)) return;
      setIsScrolledHorizontally(scrollContainer.scrollLeft > 0);
    };

    tableWrapper.addEventListener('scroll', handleScroll, { capture: true, passive: true });
    return () => tableWrapper.removeEventListener('scroll', handleScroll, { capture: true });
  }, [tableWrapperRef, stickyCellCount, isLoading]);

  // A measurement taken for a different number of sticky cells is stale until the next one
  const layout =
    typeof measuredLayout?.gridColumnCount === 'number' &&
    measuredLayout.stickyCellOffsets.length ===
      Math.min(stickyCellCount, measuredLayout.gridColumnCount)
      ? measuredLayout
      : { stickyCellOffsets: fallbackOffsets, gridColumnCount: null };

  return { ...layout, isScrolledHorizontally };
};

export { useStickyColumnsLayout };
