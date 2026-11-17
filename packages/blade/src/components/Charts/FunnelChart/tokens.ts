const componentIds = {
  chartFunnel: 'ChartFunnel',
};

const REACHED_KEY = 'bladeFunnelReached';
const DROPPED_KEY = 'bladeFunnelDropped';
const STEP_KEY = 'bladeFunnelStep';

const DEFAULT_NAME = 'Reached';
const DEFAULT_DROPPED_NAME = 'Dropped';

const MAX_COLUMN_WIDTH = 192;
const BAR_CATEGORY_GAP = 8;
const MIN_COLUMN_HEIGHT = 2;
const HATCH_SIZE = 6;
const HATCH_STRIPE_WIDTH = 2;
const PERCENT_TICKS = [0, 25, 50, 75, 100];

export {
  componentIds,
  REACHED_KEY,
  DROPPED_KEY,
  STEP_KEY,
  MAX_COLUMN_WIDTH,
  BAR_CATEGORY_GAP,
  DEFAULT_NAME,
  DEFAULT_DROPPED_NAME,
  MIN_COLUMN_HEIGHT,
  HATCH_SIZE,
  HATCH_STRIPE_WIDTH,
  PERCENT_TICKS,
};
