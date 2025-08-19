# Charts API

**Author(s):** [Gaurav Tewari](mailto:gaurav.tewari@razorpay.com)  
**Team/Pod:** Blade  
**BU:** Platform  
**Published Date:** Aug 7, 2025

-----

### Table of Contents

1. [Design Breakdown](#1-design-breakdown)
2. [Requirements to Handle](#2-requirements-to-handle)
3. [API Specifications](#3-api-specifications)
4. [Alternative APIs](#4-alternative-apis-)
5. [Open Questions](#5-open-questions)

-----

## 1\. Design Breakdown
 ### 1.a - Line Chart
  * **[Figma Design Link](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188716&p=f&m=dev)**
  ![](./images/line-chart-design.png)

 ### 1.b - Area Chart

  * **[Figma Design Link](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188716&p=f&m=dev)**

![](./images/area-design.png)

 ### 1.c - Bar Chart 

   [Design Link](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188719&p=f&m=dev) 

   ![](./images/bar-chart-design.png)



-----

## 2\. Requirements to Handle

  * **[Data Viz Phase -1 - Design Requirements Doc (for razorpay  employees)](https://docs.google.com/document/d/1u7zkzpsQwwYsdtjSDlPgalArT7XkzAC400KqNI7Ibus/edit?tab=t.l3y0g5difjs4)**

<!-- end list -->

### 2.1 - Line Chart

#### 2.1.a **[Basic Line Chart](https://recharts.org/en-US/examples/SimpleLineChart)** A standard line chart with a grid, X-axis, Y-axis, Tooltip, Legend, and line.

![](./images/basic-line-chart.png)



#### 2.1.b  **[Tiny Line Chart](https://recharts.org/en-US/examples/TinyLineChart)** A minimal line chart with only the line, with no grid or axes.

![](./images/tiny-line-chart.png)



#### 2.1.c  **[Line Chart that Connects Nulls](https://recharts.org/en-US/examples/LineChartConnectNulls)** The chart should be able to handle `null` data points by connecting the line over the gap. This is supported in Recharts via the `connectNulls` prop.

![](./images/null-line-chart.png)




#### 2.1.d  **[Custom Dot Charts](https://recharts.org/en-US/examples/CustomizedDotLineChart)** We will support a limited set of options for customizing the dots on the line chart. Recharts allows passing a `Dot` component as a prop.

![](./images/dot-line-chart.png)



#### 2.1.e  **Forecast Line Chart** This requires showing a portion of the line as a dotted or dashed line to represent forecasted data. This can be implemented by rendering two separate lines and hiding the forecast line from the legend. The API design needs to consider how to accept forecast data.

![](./images/forecast-line-chart.png)



#### 2.1.f  **[Stepped Line Chart](https://ui.shadcn.com/charts/line#charts)** The chart should support different interpolation types, like 'step'. This can be controlled via a `lineType` prop, which maps to the Recharts `type` prop on the `<Line />` component. We will likely support a limited number of line types initially.

![](./images/step-line-chart.png)



-----



### 2.2 - Area Chart


#### 2.2.a  **[Simple Area Chart](https://recharts.org/en-US/examples/SimpleAreaChart)** An area chart with a grid, X-axis, Y-axis, Tooltip, Legend, and the area fill.
![](./images/area-chart.png)

#### 2.2.b  **[Stacked Area Chart](https://recharts.org/en-US/examples/StackedAreaChart)** The chart should support stacking multiple areas. This is handled by adding a `stackId` prop to the `Area` component in Recharts. Also if we have more then 2 area, user need to pass stackId. otherwise we will consider 
all areas part of a single stack.


![](./images/stacked-area-chart.png)



#### 2.2.c  **[Area Chart that Connects Nulls](https://recharts.org/en-US/examples/AreaChartConnectNulls)** Similar to line charts, the chart should be able to handle `null` data points by connecting the area over the gap. This is supported in Recharts via the `connectNulls` prop.

![](./images/area-connects-null.png)



#### 2.2.d  **[Tiny Area Chart](https://recharts.org/en-US/examples/TinyAreaChart)** A minimal area chart with only the filled area, with no grid or axes. Also known as a sparkline.

![](./images/tiny-area-chart.png)



### 2.3 - Bar Chart





#### 2.3.a [TinyBarChart](https://recharts.org/en-US/examples/TinyBarChart)

   ![](./images/tiny-bar-chart.png)
   Simple bar graph with responsive container and BarChart.  

#### 2.3.b [SimpleBarChart](https://recharts.org/en-US/examples/SimpleBarChart)

   ![](./images/normal-bar-chart.png)
   Bar Chart with other chart components. Need to discuss ActiveBar here..  With [Rama Krushna Behera](mailto:rama.behera@razorpay.com) . should users be able to change it or not. 

#### 2.3.c [StackedBarChart](https://recharts.org/en-US/examples/StackedBarChart)  

   ![](./images/stacked-bar-chart.png)
   It would be simple. Just need to use `stackId`  
         
#### 2.4.d [Vertical Bar Chart](https://ui.shadcn.com/charts/bar#charts)  
   ![](./images/vertical-bar-chart.png)
   We just need to use layout=”vertical” prop  
#### 2.5.e [NegativeBarChart](https://ui.shadcn.com/charts/bar#charts)  
   We just need to pass \-ve values recharts will handle it for us.   

#### 2.5.f [CustomLabelBarChart](https://ui.shadcn.com/charts/bar#charts)  
   We need to use labelList. But we need to style it.





## 3\. API Specifications


3.1.0 Composition API (Re-exporting Styled Components) (Recommended 🥇)

This approach involves re-exporting styled versions of the underlying `recharts` components, giving developers full compositional control.


#### ReferenceLine Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | ✅ | - | Text label to display for the reference line |
| `y` | `number` | ✅ | `undefined` | Y-axis value where the reference line should be drawn |
| `color` | `BladeColorToken` | ❌ | none | Color token for the reference line |



#### Line Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dataKey` | `string` | ✅ | - | The key used to identify the data value for this line in the dataset |
| `name` | `string` | ✅ | - | The display name for the line, shown in legend and tooltips |
| `type` | `'step' \| 'stepAfter' \| 'stepBefore' \| 'linear' \| 'monotone'` | ❌ | `'linear'` | The interpolation type for connecting data points |
| `dot` | `React.ReactNode` | ❌ | `undefined` | Custom component for rendering dots on the line |
| `activeDot` | `React.ReactNode` | ❌ | `undefined` | Custom component for rendering the active (hovered) dot |
| `connectNulls` | `boolean` | ❌ | `false` | Whether to connect the line over null data points |
| `legendType` | `'none' \| 'line' \| 'square' \| 'diamond' \| 'circle' \| 'cross' \| 'triangle' \| 'triangleDown' \| 'triangleUp' \| 'star' \| 'wye'` | ❌ | `'line'` | The symbol type to display in the legend for this line |
| `color` | `BladeColorToken` | ❌ | Auto-assigned | Color token for the line (automatically assigned from palette if not provided) |
| `strokeStyle` | `'solid' \| 'dotted' \| 'dashed'` | ❌ | `'solid'` | Line stroke style for forecast or emphasis |

* Apart from this we would be exposing all the event handlers provided by recharts like `onCopy`, `onCopyCapture`, `onCut`, `onDrag` , `onMouseUp` , `onMouseDown` etc. 

> **LineChart Margin:** The `margin` prop from LineChart will not be exposed to developers. We will use predefined values that align with our design system. 

> **Restrict max Lines :**  We will add a check for max. lines In Chart Container.(design will tell the number of max lines). 
if more than decided number of max lines, we will show an error message. 

> **Color Handling:** Line Charts will not support sequential colors. A limited, curated palette of theme colors will be available. Colors are automatically assigned from the predefined palette if not specified.


Example - 

```ts
import {
  ChartContainer,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
} from '@razorpay/blade/charts';


// Simple Line Chart 
  <ResponsiveContainer width="100%" height="100%">
  // Line 
    <LineChart data={chartData}>
       <CartesianGrid />
       <XAxis dataKey="month" />
       <YAxis />
       <Tooltip content={<CustomTooltip />} />
       <Legend />
       <Line
         dataKey="teamA"
         name="Team A"
         type="solid"
       />
       <Line
         dataKey="teamB"
         name="Team B"
         type="solid"
       />
       <ReferenceLine y={2200} label="Minimum" color="theme.charts.grey" />
    </LineChart>
  </ResponsiveContainer>

// Tiny Line Chart 
  <ResponsiveContainer width="100%" height="100%">
     <LineChart data={chartData}>
       <Line
         dataKey="teamA"
         type="solid"
         color="theme.charts.grey"
       />
     </LineChart>
   </ResponsiveContainer>

 // ForeCast line chart 
  <ResponsiveContainer width="100%" height="100%">
      <LineChart data={forecastData}>
          <CartesianGrid/>
            <XAxis dataKey="date" />
              <YAxis />
              // This would be a custom tooltip from blade
              <ChartToolTip />
              <Legend />
              <Line
                dataKey="historical"
                name="Historical Data"
                connectNulls={true}
              />
              <Line
                dataKey="forecast"
                name="Forecast"
                type="solid"
                connectNulls={true}
                legendType="none"
              />
      </LineChart>
    </ResponsiveContainer>
```



```ts
<Line type="monotone" dataKey="pv" activeDot={<BladeChartDots />} />
```



#### Area Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dataKey` | `string` | ✅ | - | The key used to identify the data value for this area in the dataset |
| `name` | `string` | ✅ | - | Display name for the area, shown in legend and tooltips |
| `type` | `'step' \| 'stepAfter' \| 'stepBefore' \| 'linear' \| 'monotone'` | ✅ | - | The interpolation type for connecting data points in the area |
| `stackId` | `string \| number` | ❌ | `undefined` | Identifier used to group areas into a stack. Areas with the same stackId will be stacked. Required when using multiple areas |
| `connectNulls` | `boolean` | ❌ | `false` | Whether to connect the area over null data points |
| `color` | `BladeColorToken` | ❌ | Auto-assigned | Color token for the area fill (automatically assigned from palette if not provided) |

* Apart from this we would be exposing all the event handlers provided by recharts like `onCopy`, `onCopyCapture`, `onCut`, `onDrag` , `onMouseUp` , `onMouseDown` etc. 


> **AreaChart Margin:** The `margin` prop from AreaChart will not be exposed to developers. We will use predefined values that align with our design system.

> **Restrict max Area :**  We will add a check for max. area In Chart Container.(design will tell the number of max area). 
if more than decided number of max area, we will show an error message.

> **Stacking Behavior:** If you have more than 2 areas, you need to pass `stackId` to each area. Otherwise, all areas will be considered part of a single stack.

> **Color Handling:** Area Charts will not support sequential colors. A limited, curated palette of theme colors will be available. Colors are automatically assigned from the predefined palette if not specified.

Example - 


```ts
import {
  ChartContainer,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area,
  ReferenceLine,
  ResponsiveContainer,
} from '@razorpay/blade/charts';


// Simple Area Chart
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={chartData}>
       <CartesianGrid />
       <XAxis dataKey="month" />
       <YAxis />
       <Tooltip />
       <Area
         dataKey="teamA"
         name="Team A"
       />
    </AreaChart>
  </ResponsiveContainer>

// Stacked Area Chart
  <ResponsiveContainer width="100%" height="100%">
     <AreaChart data={chartData}>
       <CartesianGrid />
       <XAxis dataKey="month" />
       <YAxis />
       <Tooltip />
       <Legend />
       <Area
         dataKey="teamA"
         name="Team A"
         stackId="1"
       />
       <Area
         dataKey="teamB"
         name="Team B"
         stackId="1"
       />
     </AreaChart>
   </ResponsiveContainer>

 // Tiny Area Chart
  <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
          <Area
            dataKey="pv"
            type="monotone"
          />
      </AreaChart>
    </ResponsiveContainer>
```




#### Bar Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dataKey` | `string` | ✅ | - | The key used to identify the data value for this bar in the dataset |
| `name` | `string` | ❌ | `dataKey` value | Display name for the bar, shown in legend and tooltips |
| `color` | `BladeColorToken` | ❌ | Auto-assigned | Color token for the bar (maps to `fill` prop internally) |
| `stackId` | `string` | ❌ | `undefined` | Identifier used to group bars into a stack. Bars with the same stackId will be stacked |
| `activeBar` | `React.ReactElement \| boolean` | ❌ | `false` | Custom component or boolean to enable active state styling when bar is hovered |
| `label` | `React.ReactElement \| boolean` | ❌ | `false` | Custom component or boolean to display labels on bars |

* Apart from this we would be exposing all the event handlers provided by recharts like `onCopy`, `onCopyCapture`, `onCut`, `onDrag` , `onMouseUp` , `onMouseDown` etc. 





> **Colors** : In case of Bar Charts We would be handling both Categorical and Sequential color. Also there will be a limit on Sequential Colors. 
For that, best would be to have an internal check how many colors are already used. 

> **Note:**  BarChart has this `margin` prop which allows user to set margin from ResponsiveContainer. We won't be exposing that. We would have predefined values.

> **Restrict max Bar :**  We will add a check for max. bars In Chart Container.(design will tell the number of max bars). 
if more than decided number of max bars, we will show an error message. 



Example - 
```tsx
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from '@razorpay/blade/charts';

// 1. Simple Bar Chart
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="seriesA" name="Series A" color="surface.action.primary.default" />
    <Bar dataKey="seriesB" name="Series B" color="surface.action.secondary.default" />
  </BarChart>
</ResponsiveContainer>

// 2. Stacked Bar Chart
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    {/* Both bars share the same stackId */}
    <Bar dataKey="seriesA" stackId="a" name="Series A" color="surface.action.primary.default" />
    <Bar dataKey="seriesB" stackId="a" name="Series B" color="surface.action.secondary.default" />
  </BarChart>
</ResponsiveContainer>

// 3.  Bar Chart with different Layout.
<ResponsiveContainer width="100%" height={300}>
  {/* The key is layout="vertical" */}
  <BarChart data={chartData} layout="vertical" margin={{ left: 30 }}>
    <CartesianGrid horizontal={false} />
    {/* Axes are swapped: XAxis is numeric, YAxis is categorical */}
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" />
    <Tooltip />
    <Legend />
    <Bar dataKey="seriesA" name="Series A" color="surface.action.primary.default" />
  </BarChart>
</ResponsiveContainer>

// 4. Custom Label Bar Chart (note: high chance we might not need this.)
<ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="seriesA" name="Series A" color="surface.action.primary.default">
            {/* Blade will provide a styled LabelList component */}
            <LabelList dataKey="seriesA" position="top" />
        </Bar>
    </BarChart>
</ResponsiveContainer>
```

#### Additional Notes


> **Component Re-exports:** Components like ResponsiveContainer, Legend, CartesianGrid, XAxis, YAxis etc. will be styled and re-exported with minimal changes. For CartesianGrid , XAxis, YAxis we won't allow styling (i.e we won't be exposing props like stroke , strokeWidth , strokeDasharray, tick, tickLine and axisLine).


> **Responsive Container :** The `ResponsiveContainer` may have other options like actions, onResize, onResizeEnd, etc. will write a separate API doc after discussion with design. 

> **Restrict passing <Defs/> in Recharts :** We will not allow developers to pass <Defs/> in Recharts. Since We would be controlling colors , gradient in our own way.


> **Animation :**  We will handle Animations like Entry , Exit or Hover internally in line , area , bar and donut charts  (if any).



  * **Pros**
      * Maximum flexibility and control over chart composition and behavior.
      * Familiar developer experience with direct mapping to recharts API.
      * Strong TypeScript support with excellent autocompletion.
      * Extensible and future-proof - easy to add new chart types.
      * Composable and reusable components for building higher-level abstractions.
  * **Cons**
      * Steeper learning curve for developers new to recharts.
      * Verbose usage requiring multiple component imports for simple charts.
      * Documentation and guidelines overhead to ensure proper usage.
      * Potential for misuse bypassing Blade theming standards.


## 4. Alternative APIs - 

### 4.1 Hybrid API (Prop & Config Driven) - (Not Recommended)

This approach combines component props for high-level control with configuration objects for detailed specifications.

#### For Line Chart -  

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


#### TypeScript Interface for Line Chart

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

#### For Area Chart - 


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

#### TypeScript Interface for Area Chart - 

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

#### For Bar Chart - 



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


#### TypeScript Interface for Area Chart - 

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



  * **Pros**
      * All configuration options are available at the component level.
      * Strong TypeScript autocompletion for all props.
      * Easy to understand what each prop does.
      * Custom components (like tooltips) are easily passed as props.
  * **Cons**
      * Can become verbose with many configuration options.
      * The props list can get long for complex charts.



### 4.2 Config-Driven API (Not Recommended)

This approach consolidates all chart settings into a single `config` object.

#### For Line Chart -  

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

#### For Area Chart -  


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

#### For Bar Chart -  

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

  * **Pros**
      * Provides a single source of truth for chart configuration.
      * Easy to serialize/deserialize for storage or dynamic generation.
      * Keeps the JSX clean with minimal props.
  * **Cons**
      * Less discoverable API; developers need to inspect the config object to know what options are available.
      * Nested objects can become complex and hard to manage.
      * Passing custom React components (like a tooltip) is more difficult.
      * TypeScript autocompletion is less effective within a deeply nested object.



-----

## 5\. Open Questions

- Color Handling

We will not support sequential colors for line charts. A limited, curated palette of theme colors will be available. A `color` prop will be available in the line configuration. If it is not provided, we will automatically assign a color from the predefined palette. [Rama Krushna Behera](mailto:rama.behera@razorpay.com) will confirm the final color palette.

- Tooltip 

We might need to make custom tooltip. Like ChartsToolTip. Since the tooltip would be different then our blade's tooltip. (We are awaiting Designs on this.)

- BladeChartDots  - Awaiting Designs on this. 

-  **Label Customization in case of Bar Chart:** How much control should users have over the `LabelList` component? Should we provide pre-styled variants (e.g., `position="top"`, `position="center"`) or allow developers to pass in their own custom label components? (We might not be doing Label in v1 -  Awaiting Designs on this).


