## Component Name

FunnelChart

## Description

FunnelChart shows how many reach each step of a sequence and how many drop off between steps. Each step is a column on a percentage axis, where 100% is the first step. The solid part of a column is who reached the step and the hatched part on top is who dropped since the previous step. The tooltip shows both counts and their share of the previous step, and it follows the mouse and the keyboard (focus the chart, then use the arrow keys). It is made of `ChartFunnelWrapper` (the container) and `ChartFunnel` (the columns), and it composes with `ChartXAxis`, `ChartYAxis`, `ChartCartesianGrid` and `ChartTooltip`.

## Important Constraints

- `ChartFunnelWrapper` must contain exactly one `ChartFunnel`
- `data` is one row per step, in funnel order. `ChartFunnel`'s `dataKey` names the count in each row and `ChartXAxis`'s `dataKey` names the step label
- Counts that are missing, negative or not numbers are treated as 0
- If the first step is 0, every column is drawn at 0%. The tooltip still shows the counts
- The y-axis always runs from 0% to the first step. If a later step is larger than the first, the axis grows to fit it
- `ChartYAxis` gets a percentage domain, ticks and formatter by default. Props passed to it override them
- `ChartTooltip` gets the funnel tooltip by default. A `content` prop passed to it overrides it
- The Dropped row is left out of the tooltip when nobody dropped at that step
- `color` accepts only categorical color tokens. The hatch and hover state use other steps of the same color
- Web only. On React Native the wrapper throws an error
- There is no legend and there are no rate labels between columns

## TypeScript Types

```typescript
type ChartFunnelWrapperProps = {
  /** One row per step, in funnel order */
  data: { [key: string]: string | number }[];
  /** One `<ChartFunnel>`, plus any of ChartXAxis, ChartYAxis, ChartCartesianGrid and ChartTooltip */
  children: React.ReactNode;
} & BoxProps &
  TestID &
  DataAnalyticsAttribute;

type ChartFunnelProps = {
  /** Key of the count in each row of the wrapper's `data` */
  dataKey: string;
  /**
   * Tooltip label of the solid part: who reached the step
   * @default 'Reached'
   */
  name?: string;
  /**
   * Tooltip label of the hatched part: who dropped since the previous step
   * @default 'Dropped'
   */
  droppedName?: string;
  /**
   * Colour of the solid part
   * @default 'data.background.categorical.blue.moderate'
   */
  color?: ChartsCategoricalColorToken;
  /**
   * Formats the counts in the tooltip
   * @default Indian digit grouping, e.g. `12,34,567`
   */
  formatValue?: (value: number) => string;
};
```

## Usage Guidelines

- Use FunnelChart for an ordered sequence where each step is a subset of the one before, like checkout, onboarding or a support flow
- Use BarChart when the categories are not a sequence, and SankeyChart when the flow branches
- Give the wrapper a parent with a fixed height
- Hide the x-axis with `<ChartXAxis dataKey="step" hide />` for a compact chart, and keep `ChartTooltip` so the steps can still be read

## Examples

### Basic Funnel Chart

```tsx
import React from 'react';
import {
  Box,
  ChartFunnelWrapper,
  ChartFunnel,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
} from '@razorpay/blade/components';

function AbandonedCartFunnel() {
  const steps = [
    { step: 'Carts abandoned', count: 34 },
    { step: 'Calls made', count: 19 },
    { step: 'Calls connected', count: 19 },
    { step: 'Ordered within 24 hours', count: 5 },
  ];

  return (
    <Box width="100%" height="300px">
      <ChartFunnelWrapper data={steps}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="step" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartFunnel dataKey="count" />
      </ChartFunnelWrapper>
    </Box>
  );
}

export default AbandonedCartFunnel;
```

### Custom Color, Labels and Format

```tsx
import React from 'react';
import {
  Box,
  ChartFunnelWrapper,
  ChartFunnel,
  ChartXAxis,
  ChartYAxis,
  ChartTooltip,
} from '@razorpay/blade/components';

function ConversionFunnel() {
  const steps = [
    { step: 'Opened checkout', count: 4200 },
    { step: 'Entered card', count: 1800 },
    { step: 'Paid', count: 1320 },
  ];

  return (
    <Box width="100%" height="300px">
      <ChartFunnelWrapper data={steps}>
        <ChartXAxis dataKey="step" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartFunnel
          dataKey="count"
          color="data.background.categorical.green.moderate"
          name="Converted"
          droppedName="Lost"
          formatValue={(value) => `${value} carts`}
        />
      </ChartFunnelWrapper>
    </Box>
  );
}

export default ConversionFunnel;
```

### Compact Funnel

```tsx
import React from 'react';
import {
  Box,
  ChartFunnelWrapper,
  ChartFunnel,
  ChartXAxis,
  ChartTooltip,
} from '@razorpay/blade/components';

function CompactFunnel() {
  const steps = [
    { step: 'Carts abandoned', count: 34 },
    { step: 'Calls made', count: 19 },
    { step: 'Ordered', count: 5 },
  ];

  return (
    <Box width="360px" height="96px">
      <ChartFunnelWrapper data={steps}>
        <ChartXAxis dataKey="step" hide />
        <ChartTooltip />
        <ChartFunnel dataKey="count" />
      </ChartFunnelWrapper>
    </Box>
  );
}

export default CompactFunnel;
```
