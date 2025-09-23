// Arbitrary sequential limit per palette (we will not have this in updated design)
const BAR_CHART_CORNER_RADIUS = 2;
const DISTANCE_BETWEEN_STACKED_BARS = 2;
const BAR_SIZE = 49;
const DISTANCE_BETWEEN_BARS = 2;
const DISTANCE_BETWEEN_CATEGORY_BARS = 2;
const ANIMATION_TIME_OFFEST = 200;

const componentIds = {
  chartBar: 'ChartBar',
};

const MOTION_TRIGGERS = {
  RESET: 'reset',
  FADE_IN: 'fadeIn',
  FADE_OUT: 'fadeOut',
};

export {
  componentIds,
  DISTANCE_BETWEEN_STACKED_BARS,
  BAR_CHART_CORNER_RADIUS,
  BAR_SIZE,
  DISTANCE_BETWEEN_BARS,
  DISTANCE_BETWEEN_CATEGORY_BARS,
  ANIMATION_TIME_OFFEST,
  MOTION_TRIGGERS,
};
