export { AreaChart, Area } from './AreaCharts';

export type { AreaChartProps, AreaProps } from './AreaCharts';

// Re-export common components from LineCharts to avoid duplication
export {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ChartTooltip,
} from '../LineCharts';

export type {
  XAxisProps,
  YAxisProps,
  CartesianGridProps,
  TooltipProps,
  LegendProps,
  ResponsiveContainerProps,
  BladeColorToken,
} from '../LineCharts';

// Re-export ReferenceLine types
export type { ReferenceLineProps } from './AreaCharts'; 