// Arbitrary sequential limit per palette (we will not have this in updated design)
const BAR_CHART_CORNER_RADIUS = 2;
const DISTANCE_BETWEEN_STACKED_BARS = 2;
const BAR_SIZE = 49;
const DISTANCE_BETWEEN_BARS = 2;
const DISTANCE_BETWEEN_CATEGORY_BARS = 2;
const ANIMATION_TIME_OFFEST = 200;

// Opacity of the shaded column drawn behind the hovered category while a per-bar reference band is
// revealed. Keeps the column readable without competing with the bars sitting on top of it.
const BAND_HIGHLIGHT_OPACITY = 0.7;

// Opacity applied to the bars of every series other than the hovered one, so the hovered series
// and its reference band read as the subject. Matches the existing per-category fade.
const NON_HOVERED_SERIES_OPACITY = 0.2;

const componentIds = {
  chartBar: 'ChartBar',
};

/**
 * Stable className on a bar series' rendered group, so the reference-band layer can find *that*
 * series' bars by dataKey. Index-based lookup would break the moment a series is toggled off in the
 * legend, since a hidden bar renders no group at all.
 */
const barSeriesClass = (dataKey: string): string =>
  `blade-bar-series-${dataKey.replace(/[^a-zA-Z0-9_-]/g, '-')}`;

export {
  componentIds,
  barSeriesClass,
  DISTANCE_BETWEEN_STACKED_BARS,
  BAR_CHART_CORNER_RADIUS,
  BAR_SIZE,
  DISTANCE_BETWEEN_BARS,
  DISTANCE_BETWEEN_CATEGORY_BARS,
  ANIMATION_TIME_OFFEST,
  BAND_HIGHLIGHT_OPACITY,
  NON_HOVERED_SERIES_OPACITY,
};
