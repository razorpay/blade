/**
 * SankeyChart layout and interaction tokens.
 *
 * Colors, typography, spacing, and motion all come from the Blade theme
 * via `useTheme()` at render time. Only stateless, non-theme constants live here.
 */

// ── Layout ────────────────────────────────────────────────────────────────────
/** Width of each node bar in px */
export const NODE_WIDTH = 14;

// ── Label chip geometry ───────────────────────────────────────────────────────
/** Minimum width for a label chip in px */
export const CHIP_MIN_WIDTH = 80;
/** Approximate px-per-character for chip width estimation (12px Inter, weight 600) */
export const CHIP_PX_PER_CHAR = 6;
/** Right margin reserved for label chips (px). Longer-term should be computed from CHIP_MIN_WIDTH + gap. */
export const LABEL_MARGIN_RIGHT = 160;

// ── Link opacity states ────────────────────────────────────────────────────────
export const LINK_DEFAULT_OPACITY = 0.55;
export const LINK_HOVER_OPACITY = 0.85;
export const LINK_DIMMED_OPACITY = 0.1;

// ── Node opacity states ───────────────────────────────────────────────────────
export const NODE_DEFAULT_OPACITY = 1;
export const NODE_DIMMED_OPACITY = 0.3;

// ── Tooltip ───────────────────────────────────────────────────────────────────
/** Must sit above the SVG stacking context */
export const TOOLTIP_Z_INDEX = 100;

// ── Responsive layout ─────────────────────────────────────────────────────────
/**
 * Minimum SVG render width in px. Sized for a 4-level chart with label chips
 * (~4 columns × ~120px column gap + NODE_WIDTH + chip margin).
 * Below this the Sankey layout collapses; the scroll wrapper kicks in instead.
 */
export const MIN_CHART_WIDTH = 560;
