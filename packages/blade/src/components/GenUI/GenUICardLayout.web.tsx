/**
 * `cardLayout: 'compact'`: where each block in a CARD sits.
 *
 * The CARD knows its children, so it decides the space around each one and tells the block
 * through GenUICardBlockContext. Blocks that own vertical space (GRID, INFO_GROUP, STACK, ALERT,
 * TABLE) drop it on a trimmed side.
 *
 * - Between two blocks: one row gap, 8px.
 * - Next to a DIVIDER: the divider's 12px only. No row gap, margin or padding stacks on it. The
 *   CARD header's divider counts for the first block.
 * - The last block: no space below it, so the card's 16px padding is the bottom edge.
 * - A chart card (a CHART and no TABLE): no divider under the header. The header's 12px is the
 *   one step above the chart.
 * - A TABLE as a direct child: flush to the card's sides. First in a card with no header, it
 *   meets the top edge. Last in a card with no footer and no TABLE action slot, it meets the
 *   bottom edge. The card clips it to its rounded corners.
 */
import React from 'react';
import type { GenUIBaseComponent } from './types';

/** The row gap between blocks in a card (compactCardRowGap), in px. */
const CARD_ROW_GAP_PX = 8;
/** The vertical margin of the gradient ring around a block-level component, in px. */
const BLOCK_RING_MARGIN_PX = 12;
/** The narrowest a GRID column gets, in px: a crore amount on one line. */
const GRID_MIN_COLUMN_PX = 120;

type GenUICardBlock = {
  /** True for any block inside a CARD, at any depth. */
  isInsideCard: boolean;
  /** No space above this block: a divider or the card's top edge is above it. */
  isTrimmedTop: boolean;
  /** No space below this block: a divider or the card's bottom edge is below it. */
  isTrimmedBottom: boolean;
  /** True for a TABLE that is a direct child of a CARD: it drops its own frame. */
  isFlushTable: boolean;
  /** True for a STACK tile in a GRID: the GRID owns the space around its tiles. */
  isGridTile: boolean;
};

const outsideCard: GenUICardBlock = {
  isInsideCard: false,
  isTrimmedTop: false,
  isTrimmedBottom: false,
  isFlushTable: false,
  isGridTile: false,
};

const insideCard: GenUICardBlock = { ...outsideCard, isInsideCard: true };

const GenUICardBlockContext = React.createContext<GenUICardBlock>(outsideCard);

const useGenUICardBlock = (): GenUICardBlock => React.useContext(GenUICardBlockContext);

const isComponent = (node: unknown, component: string): boolean =>
  Boolean(node) && typeof node === 'object' && (node as GenUIBaseComponent).component === component;

const isDivider = (node: unknown): boolean => isComponent(node, 'DIVIDER');
const isTable = (node: unknown): boolean => isComponent(node, 'TABLE');

/** True when the nodes, at any depth, hold one of `components`. */
const holdsComponent = (nodes: unknown, components: readonly string[]): boolean =>
  Array.isArray(nodes) &&
  nodes.some(
    (node: (GenUIBaseComponent & { children?: unknown }) | undefined) =>
      Boolean(node) &&
      typeof node === 'object' &&
      ((node.component !== undefined && components.includes(node.component)) ||
        holdsComponent(node.children, components)),
  );

/** A chart card: a CHART and no TABLE. Its header has no divider. */
const isChartCard = (children: unknown): boolean =>
  holdsComponent(children, ['CHART']) && !holdsComponent(children, ['TABLE']);

type CardRowLayout = {
  block: GenUICardBlock;
  /** Space above the row, in px. Negative pulls a flush TABLE over the card padding. */
  marginTop: number;
  /** Space below the row, in px. Negative only for a flush TABLE. */
  marginBottom: number;
  /** True for a TABLE that spans the card's side padding. */
  isFlushSides: boolean;
};

type CardShape = {
  hasHeader: boolean;
  hasFooter: boolean;
  /** A TABLE action slot renders under each TABLE, inside the card. */
  hasTableActionSlot: boolean;
  /** The card's padding, in px. */
  cardPaddingPx: number;
  /** The card's edge, drawn inside its padding, in px. */
  cardEdgePx: number;
};

/** The space around each child of a compact CARD. */
const getCardRowLayouts = (children: unknown[], card: CardShape): CardRowLayout[] => {
  const lastIndex = children.length - 1;
  // How far a flush TABLE reaches into the card padding: to the card's edge, which stays.
  const toCardEdge = card.cardPaddingPx - card.cardEdgePx;

  return children.map((child, index) => {
    const isFirst = index === 0;
    const isLast = index === lastIndex;
    const hasDividerAbove = isFirst ? card.hasHeader : isDivider(children[index - 1]);
    const hasDividerBelow = !isLast && isDivider(children[index + 1]);
    const isTrimmedTop = hasDividerAbove;
    const isTrimmedBottom = hasDividerBelow || isLast;
    const rowGap = isFirst || isDivider(child) || hasDividerAbove ? 0 : CARD_ROW_GAP_PX;

    if (!isTable(child)) {
      return {
        block: { ...insideCard, isTrimmedTop, isTrimmedBottom },
        marginTop: rowGap,
        marginBottom: 0,
        isFlushSides: false,
      };
    }

    // A TABLE keeps its gradient ring's 12px margin unless a side is trimmed.
    let marginTop = rowGap;
    if (isFirst && !card.hasHeader) marginTop = -(toCardEdge + BLOCK_RING_MARGIN_PX);
    else if (isTrimmedTop) marginTop = rowGap - BLOCK_RING_MARGIN_PX;

    // An action slot sits under the table, inside the card, so the bottom stays as it is.
    let marginBottom = 0;
    if (!card.hasTableActionSlot) {
      if (isLast && !card.hasFooter) marginBottom = -(toCardEdge + BLOCK_RING_MARGIN_PX);
      else if (isTrimmedBottom) marginBottom = -BLOCK_RING_MARGIN_PX;
    }

    return {
      block: { ...insideCard, isTrimmedTop, isTrimmedBottom, isFlushTable: true },
      marginTop,
      marginBottom,
      isFlushSides: true,
    };
  });
};

/** The blocks of a STACK: the stack's trimmed edges pass to the blocks at those edges. */
const getStackChildBlocks = (
  parent: GenUICardBlock,
  count: number,
  direction: 'vertical' | 'horizontal',
): GenUICardBlock[] =>
  Array.from({ length: count }, (_, index) => {
    const isAtTop = direction === 'horizontal' || index === 0;
    const isAtBottom = direction === 'horizontal' || index === count - 1;
    return {
      ...outsideCard,
      isInsideCard: parent.isInsideCard,
      isTrimmedTop: parent.isTrimmedTop && isAtTop,
      isTrimmedBottom: parent.isTrimmedBottom && isAtBottom,
    };
  });

/**
 * The compact GRID template: `columns` tracks at most, none under 120px. Each track is at least
 * the larger of 120px and an equal share of the row, so a row never takes more than `columns`.
 * The 0.1px keeps rounding from dropping a column the row has room for.
 */
const getCompactGridTemplate = (columns: number, gapPx: number): string => {
  const share = `calc((100% - ${(columns - 1) * gapPx}px) / ${columns} - 0.1px)`;
  return `repeat(auto-fill, minmax(max(${GRID_MIN_COLUMN_PX}px, ${share}), 1fr))`;
};

export {
  GenUICardBlockContext,
  useGenUICardBlock,
  getCardRowLayouts,
  getStackChildBlocks,
  getCompactGridTemplate,
  outsideCard,
  isTable,
  isChartCard,
};
export type { CardRowLayout };
