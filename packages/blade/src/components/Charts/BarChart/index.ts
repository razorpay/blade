export { ChartBarWrapper, ChartBar } from './BarChart';
export type { ChartBarProps, ChartBarWrapperProps } from './types';
// ChartReferenceBand works inside ChartBarWrapper (the band layer lives in useBarReferenceBand),
// but it is NOT re-exported here: `Charts/index.ts` star-exports both this module and
// CommonChartComponents, so re-exporting it would make the name ambiguous (`import/export`
// "Multiple exports of name 'ChartReferenceBand'"). It stays available from the shared barrel.
