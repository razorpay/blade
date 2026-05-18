/**
 * SankeyChart layout and interaction tokens.
 *
 * Colors, typography, spacing, and motion all come from the Blade theme
 * via `useTheme()` at render time. Only stateless, non-theme constants live here.
 */

// ── Layout ────────────────────────────────────────────────────────────────────
/** Width of each node bar in px */
export const NODE_WIDTH = 14;
/** Vertical gap between stacked nodes in the same column in px */
export const NODE_PADDING = 16;

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
