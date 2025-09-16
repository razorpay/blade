# Charts API

Chart is a container that represent data in a graphical format in a container. 

This document outlines the API of Charts component.


<img src="./images/bar-chart-design.png" alt="Bar Chart Design"  height="400" width="600"/>



-----

- [Charts](#charts)
  - [Design](#1-design)
  - [Anatomy](#2-anatomy)
  - [API Specifications](#3-api-specifications)
    - [`LineChart`](#33-line-chart)
    - [`AreaChart`](#34-area-chart)
    - [`BarChart`](#35-bar-chart)
    - [`DonutChart`](#36-donut-chart)
  - [Open questions](#4-open-questions)

-----

## 1\. Design 

  - Figma Design[ Line](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188716&p=f&m=dev), [Area](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188716&p=f&m=dev), [Bar](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188719&p=f&m=dev), [Donut](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=92678-188718&p=f&m=dev)  Charts.

   [More on design and requirements](./requirement.md)
   

## 2\. Anatomy
 
 <img src="./images/areaChart.png" alt="Area Chart Design"  height="400" width="600"/>
 



**Components:**
* `ResponsiveContainer` (The main responsive wrapper for all charts)(We decided to merge it with the Chart Type Wrapper)
    * **Chart Type Wrapper** (for `LineChart`, `AreaChart`, `BarChart`, `DonutChart`)
        * **Data Mark Components** (The visual representation of your data)
            * `Line` (For Line Charts)
            * `Area` (For Area Charts)
            * `Bar` (For Bar Charts)
            * `Pie` (For Pie/Donut Charts)
        * **Axis & Grid Components** (For Cartesian charts like Line, Area, and Bar)
            * `XAxis`
            * `YAxis`
            * `CartesianGrid`
            * `ReferenceLine`
        * **Accessory Components** (For context and interactivity, used in most charts)
            * `Tooltip`
 
## 3\. API Specifications

### 3.1\. Composition API (Recommended 🥇)

* **Maximum flexibility and control** over chart composition and behavior.
    * Familiar developer experience with direct mapping to `recharts` API.
    * Strong TypeScript support with excellent autocompletion.
    * Extensible and future-proof - easy to add new chart types.
    * Composable and reusable components for building higher-level abstractions.

* While development we saw we were exporting components like `Line`, `Area` which might have confliting names with other component so we decided to add `Chart` prefix and rename chart container to ChartWrapper. (eg - `LineChart` will be name to `ChartLineWrapper`)

```tsx
import {
  ChartLineWrapper,
  ChartCartesianGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartArea,
} from '@razorpay/blade/charts';

// A simple stacked Area Chart example
  <ChartLineWrapper data={chartData}>
    <ChartCartesianGrid />
    <ChartXAxis dataKey="month" />
    <ChartYAxis />
    <ChartTooltip />
    <ChartLegend />
    <ChartArea dataKey="teamA" name="Team A" stackId="1" />
    <ChartArea dataKey="teamB" name="Team B" stackId="1" />
  </ChartLineWrapper>

```

### 3.2\. Alternative API Structures
<details>
<summary>View Alternative (Not Recommended) APIs</summary>



#### 3.2.1\. Hybrid API (Prop & Config Driven)
This approach combines component props for high-level control with configuration objects for detailed specifications.




#### Example - 


```ts
// Import statement
import { AreaChart } from '@razorpay/blade/charts';
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



  * **Pros**
      * All configuration options are available at the component level.
      * Strong TypeScript autocompletion for all props.
      * Easy to understand what each prop does.
      * Custom components (like tooltips) are easily passed as props.
  * **Cons**
      * Can become verbose with many configuration options.
      * The props list can get long for complex charts.

[More on alternative API](./alternativeApi1.md)

#### 3.2.2\. Config-Driven API
This approach consolidates all chart settings into a single config object. It keeps JSX clean but can make the API less discoverable and harder to type-check effectively.


This approach consolidates all chart settings into a single `config` object.



#### 3.2.3\. For Area Chart -  


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

  * **Pros**
      * Provides a single source of truth for chart configuration.
      * Easy to serialize/deserialize for storage or dynamic generation.
      * Keeps the JSX clean with minimal props.
  * **Cons**
      * Less discoverable API. Developers need to inspect the config object to know what options are available.
      * Nested objects can become complex and hard to manage.
      * Passing custom React components (like a tooltip) is more difficult.
      * TypeScript autocompletion is less effective within a deeply nested object.


[More on alternative API](./alternativeApi2.md)

</details>





### 3.3\. Line Chart

<img src="./images/linechart.png" alt="Line Chart Design"  height="400" width="600"/>



[Use Cases](./requirement.md#11-line-chart)








| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dataKey` | `string` | ✅ | - | The key used to identify the data value for this line in the dataset |
| `name` | `string` | ✅ | - | The display name for the line, shown in legend and tooltips |
| `type` | `'step' \| 'stepAfter' \| 'stepBefore' \| 'linear' \| 'monotone'` | ❌ | `'linear'` | The interpolation type for connecting data points |
| `dot` | `React.ReactNode` | ❌ | `undefined` | Custom component for rendering dots on the line |
| `activeDot` | `React.ReactNode` | ❌ | `undefined` | Custom component for rendering the active (hovered) dot |
| `connectNulls` | `boolean` | ❌ | `false` | Whether to connect the line over null data points |
| `showLegend` | `boolean` | ❌ | `true` | Whether to show the legend for this line |
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
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
} from '@razorpay/blade/charts';


// Simple Line Chart 
  // Line 
    <ChartLineWrapper data={chartData}>
       <ChartCartesianGrid />
       <ChartXAxis dataKey="month" />
       <ChartYAxis />
       <ChartTooltip content={<CustomTooltip />} />
       <ChartLegend />
       <ChartLine
         dataKey="teamA"
         name="Team A"
         type="solid"
       />
       <ChartLine
         dataKey="teamB"
         name="Team B"
         type="solid"
       />
       <ChartReferenceLine y={2200} label="Minimum" color="theme.charts.grey" />
    </ChartLineWrapper>
```
<details>
<summary>More examples</summary>

```ts 

import {
  ChartLineWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartLine,
  ChartReferenceLine,
} from '@razorpay/blade/charts';


// Tiny Line Chart 
     <ChartLineWrapper data={chartData}>
       <ChartLine
         dataKey="teamA"
         type="solid"
         color="theme.charts.grey"
       />
     </ChartLineWrapper>

 // ForeCast line chart 
      <ChartLineWrapper data={forecastData}>
          <ChartCartesianGrid/>
            <ChartXAxis dataKey="date" />
              <ChartYAxis />
              // This would be a custom tooltip from blade
              <ChartTooltip />
              <ChartLegend />
              <ChartLine
                dataKey="historical"
                name="Historical Data"
                connectNulls={true}
              />
              <ChartLine
                dataKey="forecast"
                name="Forecast"
                type="solid"
                connectNulls={true}
                showLegend={false}
              />
      </ChartLineWrapper>
```

</details>


### 3.4\. Area Chart

<img src="./images/areaChart.png" alt="Area Chart Design"  height="400" width="600"/>


[Use Cases](./requirement.md#12-area-chart)



#### Area Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dataKey` | `string` | ✅ | - | The key used to identify the data value for this area in the dataset |
| `name` | `string` | ✅ | - | Display name for the area, shown in legend and tooltips |
| `type` | `'step' \| 'stepAfter' \| 'stepBefore' \| 'linear' \| 'monotone'` | ❌ | `'linear'` | The interpolation type for connecting data points in the area |
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
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartArea,
  ChartReferenceLine,
} from '@razorpay/blade/charts';


// Simple Area Chart
    <ChartAreaWrapper data={chartData}>
       <ChartCartesianGrid />
       <ChartXAxis dataKey="month" />
       <ChartYAxis />
       <ChartTooltip />
       <ChartArea
         dataKey="teamA"
         name="Team A"
       />
    </ChartAreaWrapper>
```
<details>
<summary> More Examples </summary>


```ts 

import {
  ChartAreaWrapper,
  ChartCartesianGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartArea,
  ChartReferenceLine,
} from '@razorpay/blade/charts';


// Stacked Area Chart
     <ChartAreaWrapper data={chartData}>
       <ChartCartesianGrid />
       <ChartXAxis dataKey="month" />
       <ChartYAxis />
       <ChartTooltip />
       <ChartLegend />
       <ChartArea
         dataKey="teamA"
         name="Team A"
         stackId="1"
       />
       <ChartArea
         dataKey="teamB"
         name="Team B"
         stackId="1"
       />
     </ChartAreaWrapper>

 // Tiny Area Chart
      <ChartAreaWrapper data={chartData}>
          <ChartArea
            dataKey="pv"
            type="monotone"
          />
      </ChartAreaWrapper>

```




</details>



### 3.5\. Bar Chart

<img src="./images/barChart.png" alt="Bar Chart Design"  height="400" width="600"/>


[Use Cases](./requirement.md#13-bar-chart)





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
  ChartBarWrapper,
  ChartBar,
  ChartCartesianGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartLabelList,
} from '@razorpay/blade/charts';

// Simple Bar Chart
  <ChartBarWrapper data={chartData}>
    <ChartCartesianGrid vertical={false} />
    <ChartXAxis dataKey="name" />
    <ChartYAxis />
    <ChartTooltip />
    <ChartLegend />
    <ChartBar dataKey="seriesA" name="Series A" color="surface.action.primary.default" />
    <ChartBar dataKey="seriesB" name="Series B" color="surface.action.secondary.default" />
  </ChartBarWrapper>
```

#### Additional Notes

> **Responsive Container :** The `ResponsiveContainer` may have other options like actions, onResize, onResizeEnd, etc. will write a separate API doc after discussion with design. 

> **Restrict passing <Defs/> in Recharts :** We will not allow developers to pass <Defs/> in Recharts. Since We would be controlling colors , gradient in our own way.


> **Animation :**  We will handle Animations like Entry , Exit or Hover internally in line , area , bar and donut charts  (if any).
<details>
<summary> More Examples </summary>

```ts 

import {
  ChartBarWrapper,
  ChartBar,
  ChartCartesianGrid,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
  ChartLegend,
  ChartLabelList,
} from '@razorpay/blade/charts';


// Stacked Bar Chart
  <ChartBarWrapper data={chartData}>
    <ChartCartesianGrid vertical={false} />
    <ChartXAxis dataKey="name" />
    <ChartYAxis />
    <ChartTooltip />
    <ChartLegend />
    {/* Both bars share the same stackId */}
    <ChartBar dataKey="seriesA" stackId="a" name="Series A" color="surface.action.primary.default" />
    <ChartBar dataKey="seriesB" stackId="a" name="Series B" color="surface.action.secondary.default" />
  </ChartBarWrapper>

// Bar Chart with different Layout.
  {/* The key is layout="vertical" */}
  <ChartBarWrapper data={chartData} layout="vertical" margin={{ left: 30 }}>
    <ChartCartesianGrid horizontal={false} />
    {/* Axes are swapped: XAxis is numeric, YAxis is categorical */}
    <ChartXAxis type="number" />
    <ChartYAxis dataKey="name" type="category" />
    <ChartTooltip />
    <ChartLegend />
    <ChartBar dataKey="seriesA" name="Series A" color="surface.action.primary.default" />
  </ChartBarWrapper>

// Custom Label Bar Chart (note: high chance we might not need this.)
    <ChartBarWrapper data={chartData}>
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartBar dataKey="seriesA" name="Series A" color="surface.action.primary.default">
            {/* Blade will provide a styled LabelList component */}
            <LabelList dataKey="seriesA" position="top" />
        </ChartBar>
    </ChartBarWrapper>
```

</details>





### 3.6\. Donut Chart

<img src="./images/donut.png" alt="Donut Chart Design"  height="400" width="600"/>


[Use Cases](./requirement.md#14-donut-chart)





| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `dataKey` | `string` | ✅ | - | The key used to identify the data value for each slice |
| `nameKey` | `string` | ✅ | - | The key used to identify the name/label for each slice |
| `data` | `{ [key: string]: string \| number }[]` | ✅ | - | Array of data objects containing the pie chart data |
| `cx` | `string \| number` | ✅ | - | The x-coordinate of the center of the pie chart |
| `cy` | `string \| number` | ✅ | - | The y-coordinate of the center of the pie chart |
| `radius` | `'small' \| 'medium' \| 'large' \| 'extraLarge' \| 'none'` | ❌ | `'medium'` | Controls the inner and outer radius values internally to create donut charts |
| `activeShape` | `React.ReactElement \| ((props: any) => React.ReactNode)` | ❌ | - | Custom component or render function for the active (hovered) pie slice |
| `centerText` | `string` | ❌ | - | Text to display in the center of the donut chart |
| `type` | `donut \| pie` | ❌ | `donut` | Type of chart to render. (Pie Chart will be supported in future)|

Example - 

```ts
import {
  ChartPieWrapper,
  ChartPie,
  ChartCell,
  ChartTooltip,
  ChartLegend,
} from '@razorpay/blade/charts';



// 1. Donut Chart
  <ChartPieWrapper>
    <ChartPie
      data={data}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      radius="small"
    >
       {/* ... <Cell /> components ... */}
    </ChartPie>
  </ChartPieWrapper>

// 2. Donut with Text in Center
// This pattern can be achieved by adding a custom <text> element.
  <ChartPieWrapper>
    <ChartPie
      data={data}
      dataKey="value"
      radius="large"
      centerText="₹1.05L"
    >
       {/* ... <Cell /> components ... */}
    </ChartPie>
  </ChartPieWrapper>
```
>**Note** - You might think why we have named  it pie chart if it's donut chart ? So we have decided to have Donut variant of pie chart only. (Pie Chart will be supported in future). We just want to keep this api future proof. In When we enable it you can use it as pie chart.




### 3.7\. Axis and Grid Components

#### 3.7.1\. ReferenceLine Component

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | ✅ | - | Text label to display for the reference line |
| `y` | `number` | ✅ | `undefined` | Y-axis value where the reference line should be drawn |
| `color` | `BladeColorToken` | ❌ | none | Color token for the reference line |



> **Component Re-exports:** Components like ResponsiveContainer, CartesianGrid, XAxis, YAxis etc. will be styled and re-exported with minimal changes. For CartesianGrid , XAxis, YAxis we won't allow styling (i.e we won't be exposing props like stroke , strokeWidth , strokeDasharray, tick, tickLine and axisLine).


## 4\. Open Questions

- Color Handling

We will not support sequential colors for line charts. A limited, curated palette of theme colors will be available. A `color` prop will be available in the line configuration. If it is not provided, we will automatically assign a color from the predefined palette. [Rama Krushna Behera](mailto:rama.behera@razorpay.com) will confirm the final color palette.

- Tooltip 

We might need to make custom tooltip. Like ChartsToolTip. Since the tooltip would be different then our blade's tooltip. (We are awaiting Designs on this.)

- BladeChartDots  - Awaiting Designs on this. 

-  **Label Customization in case of Bar Chart:** How much control should users have over the `LabelList` component? Should we provide pre-styled variants (e.g., `position="top"`, `position="center"`) or allow developers to pass in their own custom label components? (We might not be doing Label in v1 -  Awaiting Designs on this).

-  **Donut Charts:** 
The design for the default "active" (hovered) donut slice and the standard customized label needs to be finalized. 


## 5\. References

- [Recharts](https://recharts.org/)
- [Shadcn/ui](https://ui.shadcn.com/docs/components/chart)
- [Material UI](https://mui.com/material-ui/react-chart/)
