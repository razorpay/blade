

##  Config-Driven API (Not Recommended)

This approach consolidates all chart settings into a single `config` object.

### For Line Chart -  

```ts
const chartConfig = {
  data: chartData,
  xAxis: {
    dataKey: 'month',
    label: 'Month',
  },
  yAxis: {
    label: 'Active users',
    config: [
      { value: 0, label: '0' },
      { value: 1000, label: '1K' },
    ],
  },
  lines: [
    { dataKey: 'teamA', name: 'Team A Users', type: 'monotone' },
    { dataKey: 'teamB', name: 'Team B Users', type: 'linear' },
  ],
  referenceLines: [{ y: 2200, label: 'Target: 2,200' }],
  options: {
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    tinyChart: false,
    connectNulls: false,
    dotType: 'circle',
  },
};

<LineChart config={chartConfig} />;
```

### For Area Chart -  


```ts
const chartConfig = {
  data: chartData,
  xAxis: {
    dataKey: 'month',
    label: 'Month',
  },
  yAxis: {
    label: 'Active users',
    config: [
      { value: 0, label: '0' },
      { value: 1000, label: '1K' },
    ],
  },
  areas: [
    { dataKey: 'teamA', name: 'Team A Users', stackId: '1' },
    { dataKey: 'teamB', name: 'Team B Users', stackId: '1' },
  ],
  referenceLines: [{ y: 2200, label: 'Target: 2,200' }],
  options: {
    showGrid: true,
    showTooltip: true,
    showLegend: true,
    tinyChart: false,
    connectNulls: false,
    isStacked: true,
  },
};

<AreaChart config={chartConfig} />;
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
const chartConfig = {
  data: chartData,
  barConfig: barConfig,
  xAxisDataKey: 'month',
  yAxisLabel: 'Active Users',
  layout: 'vertical',
  stacked: false,
  showLegend: true,
  showTooltip: true,
  showGrid: true,
};

<BarChart config={chartConfig}/>
```


### For Donut Chart -  


```ts
const chartConfig = {
  data: chartData,
  series: [
    {
      dataKey: 'amount',
      nameKey: 'category',
      type: 'donut', // 'pie' or 'donut'
      innerRadius: '60%',
      outerRadius: '80%',
    },
  ],
  options: {
    showTooltip: true,
    showLegend: true,
    centerText: 'Total: ₹1.05L'
  },
};

<PieChart config={chartConfig} />;
```



  * **Pros**
      * Provides a single source of truth for chart configuration.
      * Easy to serialize/deserialize for storage or dynamic generation.
      * Keeps the JSX clean with minimal props.
  * **Cons**
      * Less discoverable API. Developers need to inspect the config object to know what options are available.
      * Nested objects can become complex and hard to manage.
      * Passing custom React components (like a tooltip) is more difficult.
      * TypeScript autocompletion is less effective within a deeply nested object.

