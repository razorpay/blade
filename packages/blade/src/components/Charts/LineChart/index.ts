export type { ChartLineProps, ChartLineWrapperProps } from './types';
export type { ChartReferenceBandProps } from '../CommonChartComponents/types';
export { ChartLine, ChartLineWrapper } from './LineChart';
// ChartReferenceBand is LineChart-specific (the band-rendering layer lives in ChartLineWrapper's
// useReferenceBand). Re-exported here instead of the shared CommonChartComponents barrel so it's
// not mistaken as a cross-chart component (BarChart/AreaChart would silently no-op).
export { ChartReferenceBand } from '../CommonChartComponents/CommonChartComponents';
