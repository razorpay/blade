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
/**
 * Maximum width for a label chip in px on **native**, where content wider than
 * (CHIP_MAX_WIDTH - horizontal padding) wraps to two lines.
 * The web chart renders single-line labels and caps them at `LABEL_MAX_WIDTH` instead.
 */
export const CHIP_MAX_WIDTH = 160;
/**
 * Maximum width for a single-line label on **web** (chip or plain text), in px.
 * Matches the 200px cap that axis label chips use across Blade charts
 * (`MAX_WIDTH` in CommonChartComponents tokens). Content wider than this is truncated
 * with an ellipsis — the name first, the value text only as a last resort.
 */
export const LABEL_MAX_WIDTH = 200;
/**
 * Fixed pixel budget reserved for the humanized value + percentage part of a label chip,
 * e.g. "1.24L txn  (100%)". Used by the **native** chart when computing the dynamic
 * right margin before node values are available. The web chart measures the exact
 * label text of every node instead.
 */
export const CHIP_VALUE_BUDGET = 120;
/**
 * Diameter of the colour indicator dot rendered inside labels when `showColorIndicator`
 * is set, in px. Gap to the text uses `theme.spacing[2]`.
 */
export const COLOR_INDICATOR_SIZE = 8;
/** Minimum rendered height for a node bar in px — prevents invisible zero-height nodes */
export const NODE_MIN_HEIGHT = 1;

// ── Vertical orientation (native-only) ────────────────────────────────────────
/**
 * Fallback height (px) reserved below each node bar for its label chip when the
 * native SankeyChart renders in `orientation="vertical"`. Enough for a two-line
 * wrapped chip so the bottom stage's label never clips off-canvas.
 * (Theme spacing is added on top of this at render time.)
 */
export const VERTICAL_LABEL_RESERVE = 44;

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
// ── Label vertical alignment ──────────────────────────────────────────────────
/**
 * Cap-height ratio for the Inter font family.
 * Uppercase glyphs occupy ~72% of font-size above the baseline.
 * Used for vertical SVG text alignment in node label rendering.
 * Update if Blade's base font family ever changes.
 */
export const LABEL_CAP_HEIGHT_RATIO = 0.72;

// ── Component IDs ─────────────────────────────────────────────────────────────
// PascalCase values match the convention used by BarChart ('ChartBar'),
// AreaChart ('ChartArea'), and LineChart ('ChartLine').
export const componentIds = {
  ChartSankey: 'ChartSankey',
  ChartSankeyWrapper: 'ChartSankeyWrapper',
};
