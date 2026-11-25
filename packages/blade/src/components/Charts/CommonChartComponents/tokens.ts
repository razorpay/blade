const RECT_WIDTH = 80;
const RECT_HEIGHT = 30;
const TEXT_BASELINE = 15;

// Padding for text inside the rectangle (4px vertical, 8px horizontal)
const PADDING_VERTICAL = 4;
const PADDING_HORIZONTAL = 8;

const X_OFFSET = 32;
const Y_OFFSET = 14.5;
const X_AXIS_TEXT_BASELINE = 24;
const X_AXIS_TEXT_BASELINE_WITH_SECONDARY_LABEL = 48;

// X-axis tick label constants
const X_AXIS_TICK_LINE_HEIGHT = 14.5;
const X_AXIS_TICK_START_DY = 8;
const X_AXIS_LABEL_GAP = 4;
const X_AXIS_BOTTOM_PADDING = 8;

// Gap between tick labels and X-axis label (e.g., "Month")
const X_AXIS_LABEL_OFFSET = 8;
// Height of the X-axis label text
const X_AXIS_LABEL_HEIGHT = 16;

// Legend spacing from X-axis label (or tick labels if no label)
const LEGEND_MARGIN_TOP = 8;

const MIN_WIDTH = RECT_WIDTH;
const MAX_WIDTH = 200;

const DEFAULT_COLOR = 'data.background.categorical.blue.moderate';

// Default fill colour + opacity for the reference band. A faint categorical blue rendered at a
// low opacity reads as a subtle shaded range behind the trend line (matches the Figma design).
const REFERENCE_BAND_DEFAULT_COLOR = 'data.background.categorical.blue.faint';
const REFERENCE_BAND_FILL_OPACITY = 0.5;

// Default label for a band that declares no name. Sourced from here by *both* the legend swatch and
// the tooltip's range row: they read the name through different paths (the band layer vs `rangeMap`)
// and applying the default separately in each let them drift apart.
const REFERENCE_BAND_DEFAULT_NAME = 'Reference band';

// Stable classNames applied to the band's invisible bound lines (web) so ChartLineWrapper can find
// their rendered curves and paint the filled band between them.
const REFERENCE_BAND_LOWER_CLASS = 'blade-reference-band-lower';
const REFERENCE_BAND_UPPER_CLASS = 'blade-reference-band-upper';
// className on the <g> layer that holds the painted band path.
const REFERENCE_BAND_LAYER_CLASS = 'blade-reference-band-layer';

// `minimal` axis style: the plot runs to the left and right edges of the chart, so the Y ticks
// start where a title above the chart starts. No bottom margin: the X labels end the chart. The
// top keeps the recharts 5px.
const MINIMAL_AXIS_CHART_MARGIN = { top: 5, right: 0, bottom: 0, left: 0 };
// `minimal` axis style: the Y axis width. recharts draws no axis of width 0, so it is 1px.
const MINIMAL_Y_AXIS_WIDTH = 1;
// recharts' chart margin when a wrapper passes none. A `left` or `right` Y label column sets its
// side to 0, so the widest label meets the edge of the chart.
const DEFAULT_CHART_MARGIN = { top: 5, right: 5, bottom: 5, left: 5 };
// recharts sets a Y tick label's baseline 0.355em under its tick: half of its 0.71em cap height.
const Y_LABEL_HALF_CAP_EM = 0.355;

// `labelSize` to the key of `theme.typography.fonts.size`. The same keys as the Text sizes
// `small`, `medium` and `large`.
const LABEL_SIZE_FONT_SIZE = { s: 75, m: 100, l: 200 } as const;
// `labelSize` to the Text size of the legend.
const LABEL_SIZE_TEXT_SIZE = { s: 'small', m: 'medium', l: 'large' } as const;

const componentId = {
  chartLegend: 'chart-legend',
  chartXAxis: 'chart-x-axis',
  chartYAxis: 'chart-y-axis',
  chartCartesianGrid: 'chart-cartesian-grid',
  chartTooltip: 'chart-tooltip',
  chartReferenceLine: 'chart-reference-line',
  chartReferenceBand: 'chart-reference-band',
};

export {
  componentId,
  RECT_WIDTH,
  RECT_HEIGHT,
  TEXT_BASELINE,
  PADDING_VERTICAL,
  PADDING_HORIZONTAL,
  X_OFFSET,
  Y_OFFSET,
  X_AXIS_TEXT_BASELINE,
  X_AXIS_TICK_LINE_HEIGHT,
  X_AXIS_TICK_START_DY,
  X_AXIS_LABEL_GAP,
  X_AXIS_BOTTOM_PADDING,
  X_AXIS_LABEL_OFFSET,
  X_AXIS_LABEL_HEIGHT,
  LEGEND_MARGIN_TOP,
  MIN_WIDTH,
  MAX_WIDTH,
  DEFAULT_COLOR,
  REFERENCE_BAND_DEFAULT_COLOR,
  REFERENCE_BAND_DEFAULT_NAME,
  REFERENCE_BAND_FILL_OPACITY,
  REFERENCE_BAND_LOWER_CLASS,
  REFERENCE_BAND_UPPER_CLASS,
  REFERENCE_BAND_LAYER_CLASS,
  X_AXIS_TEXT_BASELINE_WITH_SECONDARY_LABEL,
  MINIMAL_AXIS_CHART_MARGIN,
  MINIMAL_Y_AXIS_WIDTH,
  DEFAULT_CHART_MARGIN,
  LABEL_SIZE_FONT_SIZE,
  LABEL_SIZE_TEXT_SIZE,
  Y_LABEL_HALF_CAP_EM,
};
