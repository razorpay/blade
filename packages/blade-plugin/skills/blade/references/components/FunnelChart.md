## Component Name

FunnelChart

## Description

FunnelChart shows how many reach each step of a sequence. It wraps Recharts' FunnelChart and Funnel: each step is a trapezoid whose width is its count against the largest step, labelled with the step name, its count and its share of the first step. Hovering a step darkens it and shows its count in the tooltip. It is made of `ChartFunnelWrapper` (the container) and `ChartFunnel` (the funnel), and it composes with `ChartTooltip`.

## Important Constraints

- `ChartFunnelWrapper` must contain exactly one `ChartFunnel`, plus an optional `ChartTooltip`. `ChartXAxis`, `ChartYAxis` and `ChartCartesianGrid` don't apply to a funnel
- `data` is one row per step, in funnel order. `ChartFunnel`'s `dataKey` names the count and `nameKey` names the step
- Counts that are missing, negative or not numbers are treated as 0
- If every count is 0, or `data` is empty, nothing is drawn
- If the first step is 0, the labels show step names and counts without a share
- `color` accepts only categorical color tokens. Hover uses a darker step of the same color
- The tooltip works on hover only. Recharts' funnel has no keyboard tooltip
- Each step is an `img` named with its label, so screen readers can read the steps
- `ChartFunnelWrapper` throws unless it has exactly one `ChartFunnel` child, or if `dataKey` or `nameKey` is not a key of the data rows
- Web only. On React Native the wrapper throws an error

## TypeScript Types

```typescript
type ChartFunnelWrapperProps = {
  /** One row per step, in funnel order */
  data: { [key: string]: string | number | null | undefined }[];
  /** One `<ChartFunnel>`, plus an optional `<ChartTooltip>` */
  children: React.ReactNode;
} & BoxProps &
  TestID &
  DataAnalyticsAttribute;

type ChartFunnelProps = {
  /** Key of the count in each row of the wrapper's `data` */
  dataKey: string;
  /**
   * Key of the step name in each row of the wrapper's `data`
   * @default 'name'
   */
  nameKey?: string;
  /**
   * Colour of the funnel
   * @default 'data.background.categorical.blue.moderate'
   */
  color?: ChartsCategoricalColorToken;
};
```

## Usage Guidelines

- Use FunnelChart for an ordered sequence where each step is a subset of the one before, like checkout, onboarding or a support flow
- Use BarChart when the categories are not a sequence, and SankeyChart when the flow branches
- Give the wrapper a parent with a fixed height
- Leave room on the right for the step labels; the funnel takes the left 60% of the chart. Below about 480px wide, long step names wrap

## Examples

### Basic Funnel Chart

```tsx
import React from 'react';
import { Box, ChartFunnelWrapper, ChartFunnel, ChartTooltip } from '@razorpay/blade/components';

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
        <ChartTooltip />
        <ChartFunnel dataKey="count" nameKey="step" />
      </ChartFunnelWrapper>
    </Box>
  );
}

export default AbandonedCartFunnel;
```

### Custom Color

```tsx
import React from 'react';
import { Box, ChartFunnelWrapper, ChartFunnel, ChartTooltip } from '@razorpay/blade/components';

function ConversionFunnel() {
  const steps = [
    { step: 'Opened checkout', count: 4200 },
    { step: 'Entered card', count: 1800 },
    { step: 'Paid', count: 1320 },
  ];

  return (
    <Box width="100%" height="240px">
      <ChartFunnelWrapper data={steps}>
        <ChartTooltip />
        <ChartFunnel
          dataKey="count"
          nameKey="step"
          color="data.background.categorical.green.moderate"
        />
      </ChartFunnelWrapper>
    </Box>
  );
}

export default ConversionFunnel;
```
