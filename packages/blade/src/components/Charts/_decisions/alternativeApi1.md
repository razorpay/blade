
## Hybrid API (Prop & Config Driven) - (Not Recommended)

This approach combines component props for high-level control with configuration objects for detailed specifications.

### For Line Chart -  

```ts
// Import statement
import { LineChart } from '@razorpay/blade/charts';

const chartData = [
  { month: 'Jan', teamA: 2450, teamB: 2600 },
  { month: 'Feb', teamA: 2300, teamB: 2500 },
  { month: 'Mar', teamA: 2300, teamB: 2700 },
  { month: 'Apr', teamA: 2300, teamB: 3000 },
  { month: 'Jun', teamA: 2300, teamB: 3300 },
  { month: 'Jul', teamA: 2300, teamB: 3400,  forecast: true },
  { month: 'Aug', teamA: 2300, teamB: 3500, forecast: true },
  { month: 'Sep', teamA: 2300, teamB: 3500, forecast: true },
  { month: 'Oct', teamA: 2300, teamB: { data: 3600, foreCastData: true } },
  // more data...
];

const lineConfig = [
  {
    dataKey: 'teamA',
    name: 'Team A Users', // name in legend
    color: 'theme.charts.dummy.red',
  },
  {
    dataKey: 'teamB',
    name: 'Team B Users',
    color: 'theme.charts.dummy.blue',
  },
];

const referenceLineDefinitions = [
  { y: 2200, label: 'Avg: 2,200' }
];

const yAxisConfig = [
  { value: 0, label: '0' },
  { value: 500, label: '500' },
  // more data
];


//This is just an example of custom tooltip. we might change it later. according to design.
const CustomToolTip = ({ active, payload, label }) => {
  // We can handle isVisible logic internally as well.
  const isVisible = active && payload && payload.length;
  if (!isVisible) return null;

  return (
    <Box>
      <Text>{`${label} : ${payload[0].value}`}</Text>
      <Text>{getIntroOfPage(label)}</Text>
      <Text>Anything you want can be displayed here.</Text>
    </Box>
  );
};

<LineChart
  data={chartData}
  lineConfig={lineConfig}
  xAxisDataKey="month"
  yAxisConfig={yAxisConfig}
  yAxisLabel="Active users" // Controls the axis title
  xAxisLabel="Month" // Controls the axis title
  referenceLineDefinitions={referenceLineDefinitions}
  showLegend={true}
  showTooltip={true}
  lineType="linear"
  tinyLineChart={false}
  customToolTip={CustomToolTip}
  connectNulls={true}
  dotType="circle" // TBD with design team
/>
```


### TypeScript Interface for Line Chart

```ts
// ============================================================================
// TypeScript Interfaces for the CustomLineChart Component
// ============================================================================

/**
 * Defines the possible styles for the line in the chart.
 */
type LineType = 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter';

/**
 * Defines the shape for a single data point in the chart's data array.
 * Uses a generic index signature to allow for flexible data keys.
 */
interface ChartData {
  [key: string]: any;
}

/**
 * Configuration for a single line on the chart.
 */
interface LineDefinition {
  dataKey: string;
  name: string;
  type?: LineType;
}

/**
 * Configuration for a single reference line.
 */
interface ReferenceLineDefinition {
  y: number;
  label: string;
}

/**
 * Configuration for a single item in the Y-axis tick array.
 */
interface YAxisConfigItem {
  value: number;
  label: string;
}

/**
 * The main interface for all props accepted by the LineChart component.
 */
interface CustomLineChartProps {
  data: ChartData[];
  lines: LineDefinition[];
  xAxisDataKey: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  yAxisConfig?: YAxisConfigItem[];
  referenceLines?: ReferenceLineDefinition[];
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  tinyLineChart?: boolean;
  customToolTip?: React.ReactNode;
  connectNulls?: boolean;
  dotType?: 'circle' | 'square' | 'star' | 'line';
}
```

### For Area Chart - 


```ts
// Import statement
import { AreaChart } from '@razorpay/blade/charts';

const chartData = [
  { month: 'Jan', teamA: 2450, teamB: 2600 },
  { month: 'Feb', teamA: 2300, teamB: 2500 },
  { month: 'Mar', teamA: 2300, teamB: 2700 },
  { month: 'Apr', teamA: 2300, teamB: 3000 },
  { month: 'Jun', teamA: 2300, teamB: 3300 },
  { month: 'Jul', teamA: 2300, teamB: 3400 },
  { month: 'Aug', teamA: 2300, teamB: 3500 },
  { month: 'Sep', teamA: 2300, teamB: 3500 },
  { month: 'Oct', teamA: 2300, teamB: 3600 },
  // more data...
];

const areaConfig = [
  {
    dataKey: 'teamA',
    name: 'Team A Users', // name in legend
    color: 'theme.charts.dummy.red',
  },
  {
    dataKey: 'teamB',
    name: 'Team B Users',
    color: 'theme.charts.dummy.blue',
  },
];

const referenceLineDefinitions = [
  { y: 2200, label: 'Avg: 2,200' }
];

const yAxisConfig = [
  { value: 0, label: '0' },
  { value: 500, label: '500' },
  // more data
];

<AreaChart
  data={chartData}
  areaConfig={areaConfig}
  xAxisDataKey="month"
  yAxisConfig={yAxisConfig}
  yAxisLabel="Active users" // Controls the axis title
  xAxisLabel="Month" // Controls the axis title
  referenceLineDefinitions={referenceLineDefinitions}
  showLegend={true}
  showTooltip={true}
  connectNulls={true}
  isStacked={true}
  tinyAreaChart={false}
/>
```

### TypeScript Interface for Area Chart - 

```ts
// ============================================================================
// TypeScript Interfaces for the CustomAreaChart Component
// ============================================================================

/**
 * Defines the shape for a single data point in the chart's data array.
 * Uses a generic index signature to allow for flexible data keys.
 */
interface ChartData {
  [key: string]: any;
}

/**
 * Configuration for a single area on the chart.
 */
interface AreaDefinition {
  dataKey: string;
  name: string;
  stroke: string;
  fill: string;
  stackId?: string | number;
}

/**
 * Configuration for a single reference line.
 */
interface ReferenceLineDefinition {
  y: number;
  label: string;
  stroke: string;
}

/**
 * Configuration for a single item in the Y-axis tick array.
 */
interface YAxisConfigItem {
  value: number;
  label: string;
}

/**
 * The main interface for all props accepted by the AreaChart component.
 */
interface CustomAreaChartProps {
  data: ChartData[];
  areas: AreaDefinition[];
  xAxisDataKey: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  yAxisConfig?: YAxisConfigItem[];
  referenceLines?: ReferenceLineDefinition[];
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  tinyAreaChart?: boolean;
  connectNulls?: boolean;
}
```

### For Bar Chart - 



```tsx
import { BarChart } from '@razorpay/blade/charts';

const chartData = [
  { month: 'Jan', desktop: 400, mobile: 240 },
  { month: 'Feb', desktop: 300, mobile: 139 },
  // ... more data
];

const barConfig = [
  {
    dataKey: 'desktop',
    name: 'Desktop Users',
    color: 'theme.charts.blue',
  },
  {
    dataKey: 'mobile',
    name: 'Mobile Users',
    color: 'theme.charts.green',
    // stackId can be added here for stacked charts
    // stackId: 'users'
  },
];

<BarChart
  data={chartData}
  barConfig={barConfig}
  xAxisDataKey="month"
  yAxisLabel="Active Users"
  layout="vertical" // 'vertical' or 'horizontal'
  stacked={false} // A boolean prop to control stacking
  showLegend={true}
  showTooltip={true}
  showGrid={true}
/>
```


### TypeScript Interface for Area Chart - 

```ts
interface BarDefinition {
  dataKey: string;
  name: string;
  color: BladeColorToken;
  stackId?: string;
}

interface CustomBarChartProps {
  data: Record<string, any>[];
  barConfig: BarDefinition[];
  xAxisDataKey: string;
  layout?: 'vertical' | 'horizontal';
  stacked?: boolean;
  yAxisLabel?: string;
  xAxisLabel?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  // ... other high-level props
}
```

### For Donut Chart - 


```ts
import { PieChart } from '@razorpay/blade/charts';

const chartData = [
  { category: 'Electronics', amount: 45000 },
  { category: 'Apparel', amount: 28000 },
  { category: 'Groceries', amount: 32000 },
];

const seriesConfig = [
  {
    dataKey: 'amount',
    nameKey: 'category',
    innerRadius: '60%',
    outerRadius: '80%',
  },
];

<PieChart
  data={chartData}
  seriesConfig={seriesConfig}
  showLegend={true}
  showTooltip={true}
  chartType="donut" // 'pie' | 'donut' (in future if we want to support donut chart)
  centerText="₹1.05L" // Text to display in the center of a donut
  customToolTip={<CustomTooltip />}
/>
```

### TypeScript Interface for Donut Chart - 

```ts
interface ChartData {
  [key: string]: any;
}

interface SeriesDefinition {
  dataKey: string;
  nameKey: string;
  innerRadius?: string | number;
  outerRadius?: string | number;
  // Colors could be defined here or assigned automatically
  colors?: string[];
}

interface CustomPieChartProps {
  data: ChartData[];
  seriesConfig: SeriesDefinition[];
  showTooltip?: boolean;
  showLegend?: boolean;
  chartType?: 'pie' | 'donut';
  centerText?: string;
  customToolTip?: React.ReactNode;
}
```





  * **Pros**
      * All configuration options are available at the component level.
      * Strong TypeScript autocompletion for all props.
      * Easy to understand what each prop does.
      * Custom components (like tooltips) are easily passed as props.
  * **Cons**
      * Can become verbose with many configuration options.
      * The props list can get long for complex charts.


