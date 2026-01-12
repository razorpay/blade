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

const DEFAULT_COLOR = 'data.background.categorical.gray.moderate';

const componentId = {
  chartLegend: 'chart-legend',
  chartXAxis: 'chart-x-axis',
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
  X_AXIS_TEXT_BASELINE_WITH_SECONDARY_LABEL,
};
