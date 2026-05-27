import type { Meta, StoryFn } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { MetricsCard } from './MetricsCard';
import type { MetricsCardProps } from './types';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

const chartData = [
  {
    time: '12AM',
    salesCurrent: 2800,
    salesPrevious: 2700,
    conversionCurrent: 11,
    conversionPrevious: 10.4,
    ordersCurrent: 108,
    ordersPrevious: 102,
    successCurrent: 96,
    successPrevious: 95,
  },
  {
    time: '3AM',
    salesCurrent: 2350,
    salesPrevious: 2550,
    conversionCurrent: 9.8,
    conversionPrevious: 10.1,
    ordersCurrent: 90,
    ordersPrevious: 98,
    successCurrent: 94,
    successPrevious: 95,
  },
  {
    time: '6AM',
    salesCurrent: 2600,
    salesPrevious: 1900,
    conversionCurrent: 10.4,
    conversionPrevious: 8.8,
    ordersCurrent: 96,
    ordersPrevious: 76,
    successCurrent: 96,
    successPrevious: 93,
  },
  {
    time: '9AM',
    salesCurrent: 2200,
    salesPrevious: 1600,
    conversionCurrent: 9.2,
    conversionPrevious: 8.2,
    ordersCurrent: 82,
    ordersPrevious: 68,
    successCurrent: 94,
    successPrevious: 90,
  },
  {
    time: '12PM',
    salesCurrent: 1850,
    salesPrevious: 1700,
    conversionCurrent: 8.6,
    conversionPrevious: 8.9,
    ordersCurrent: 74,
    ordersPrevious: 72,
    successCurrent: 92,
    successPrevious: 91,
  },
  {
    time: '3PM',
    salesCurrent: 1920,
    salesPrevious: 1820,
    conversionCurrent: 8.9,
    conversionPrevious: 8.7,
    ordersCurrent: 76,
    ordersPrevious: 75,
    successCurrent: 93,
    successPrevious: 92,
  },
  {
    time: '6PM',
    salesCurrent: 1720,
    salesPrevious: 2320,
    conversionCurrent: 8.2,
    conversionPrevious: 10.2,
    ordersCurrent: 68,
    ordersPrevious: 88,
    successCurrent: 91,
    successPrevious: 94,
  },
  {
    time: '9PM',
    salesCurrent: 1880,
    salesPrevious: 1980,
    conversionCurrent: 8.7,
    conversionPrevious: 9.1,
    ordersCurrent: 72,
    ordersPrevious: 80,
    successCurrent: 92,
    successPrevious: 93,
  },
];

const metrics = [
  {
    id: 'total-sales',
    label: 'Total sales',
    editLabel: 'Replace Total sales card',
    value: '₹2.89L',
    change: { value: '12%', trend: 'positive' as const },
    sparklineData: [20, 24, 25, 27, 29, 35, 33, 38],
    chartSeries: [
      {
        dataKey: 'salesCurrent',
        label: 'Last 7 days',
        color: 'data.background.categorical.blue.moderate' as const,
      },
      {
        dataKey: 'salesPrevious',
        label: 'Apr 12 - Apr 19',
        color: 'data.background.sequential.blue.100' as const,
        strokeStyle: 'dashed' as const,
      },
    ],
  },
  {
    id: 'checkout-conversion-rate',
    label: 'Checkout conversion rate',
    editLabel: 'Replace Checkout conversion rate card',
    value: '10.12%',
    change: { value: '12%', trend: 'positive' as const },
    sparklineData: [5, 8, 9, 11, 12, 16, 14, 18],
    chartSeries: [
      {
        dataKey: 'conversionCurrent',
        label: 'Last 7 days',
        color: 'data.background.categorical.blue.moderate' as const,
      },
      {
        dataKey: 'conversionPrevious',
        label: 'Apr 12 - Apr 19',
        color: 'data.background.sequential.blue.100' as const,
        strokeStyle: 'dashed' as const,
      },
    ],
  },
  {
    id: 'total-orders',
    label: 'Total orders',
    editLabel: 'Replace Total orders card',
    value: '672',
    change: { value: '12%', trend: 'positive' as const },
    sparklineData: [8, 10, 12, 13, 14, 18, 17, 20],
    chartSeries: [
      {
        dataKey: 'ordersCurrent',
        label: 'Last 7 days',
        color: 'data.background.categorical.blue.moderate' as const,
      },
      {
        dataKey: 'ordersPrevious',
        label: 'Apr 12 - Apr 19',
        color: 'data.background.sequential.blue.100' as const,
        strokeStyle: 'dashed' as const,
      },
    ],
  },
  {
    id: 'payment-success-rate',
    label: 'Payment success rate',
    editLabel: 'Replace Payment success rate card',
    value: '97%',
    change: { value: '12%', trend: 'positive' as const },
    sparklineData: [8, 11, 12, 13, 15, 19, 17, 21],
    chartSeries: [
      {
        dataKey: 'successCurrent',
        label: 'Last 7 days',
        color: 'data.background.categorical.blue.moderate' as const,
      },
      {
        dataKey: 'successPrevious',
        label: 'Apr 12 - Apr 19',
        color: 'data.background.sequential.blue.100' as const,
        strokeStyle: 'dashed' as const,
      },
    ],
  },
];

const allMetrics = [
  ...metrics,
  {
    id: 'average-order-value',
    label: 'Average order value',
    editLabel: 'Replace Average order value card',
    value: '₹4,298',
    change: { value: '8%', trend: 'positive' as const },
    sparklineData: [10, 14, 13, 15, 16, 18, 17, 19],
    chartSeries: [
      {
        dataKey: 'salesCurrent',
        label: 'Last 7 days',
        color: 'data.background.categorical.blue.moderate' as const,
      },
      {
        dataKey: 'salesPrevious',
        label: 'Apr 12 - Apr 19',
        color: 'data.background.sequential.blue.100' as const,
        strokeStyle: 'dashed' as const,
      },
    ],
  },
  {
    id: 'returning-customers',
    label: 'Returning customers',
    editLabel: 'Replace Returning customers card',
    value: '184',
    change: { value: '5%', trend: 'positive' as const },
    sparklineData: [7, 8, 9, 11, 10, 12, 13, 14],
    chartSeries: [
      {
        dataKey: 'ordersCurrent',
        label: 'Last 7 days',
        color: 'data.background.categorical.blue.moderate' as const,
      },
      {
        dataKey: 'ordersPrevious',
        label: 'Apr 12 - Apr 19',
        color: 'data.background.sequential.blue.100' as const,
        strokeStyle: 'dashed' as const,
      },
    ],
  },
  {
    id: 'sessions',
    label: 'Sessions',
    editLabel: 'Replace Sessions card',
    value: '14.8K',
    change: { value: '3%', trend: 'positive' as const },
    sparklineData: [12, 15, 13, 16, 18, 19, 21, 22],
    chartSeries: [
      {
        dataKey: 'salesCurrent',
        label: 'Last 7 days',
        color: 'data.background.categorical.blue.moderate' as const,
      },
      {
        dataKey: 'salesPrevious',
        label: 'Apr 12 - Apr 19',
        color: 'data.background.sequential.blue.100' as const,
        strokeStyle: 'dashed' as const,
      },
    ],
  },
  {
    id: 'items-sold',
    label: 'Items sold',
    editLabel: 'Replace Items sold card',
    value: '1,284',
    change: { value: '6%', trend: 'positive' as const },
    sparklineData: [9, 11, 10, 13, 12, 14, 16, 18],
    chartSeries: [
      {
        dataKey: 'ordersCurrent',
        label: 'Last 7 days',
        color: 'data.background.categorical.blue.moderate' as const,
      },
      {
        dataKey: 'ordersPrevious',
        label: 'Apr 12 - Apr 19',
        color: 'data.background.sequential.blue.100' as const,
        strokeStyle: 'dashed' as const,
      },
    ],
  },
];

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="MetricsCard"
      componentDescription="MetricsCard is a dashboard summary surface that combines multiple KPI summaries with an optional comparison chart and footer action, using Blade chart primitives and standard layout tokens."
      figmaURL="https://www.figma.com/design/5A2YtOJo6tpcxiPJU7NFvt/Magic-Dashboard-Home-Page?node-id=831-59112&t=tb3gdXV98ZJ6pPxQ-4"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`import { MetricsCard } from '@razorpay/blade/components';

<MetricsCard
  metrics={metrics}
  chartData={chartData}
  xAxisDataKey="time"
  footer={{
    action: { text: 'See more', href: '#' },
  }}
  expandedChartType="line"
  collapsedChartType="line"
/>
`}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = {
  DATA: 'Data Props',
  STATE: 'State Props',
  EDITING: 'Editing Props',
  APPEARANCE: 'Appearance Props',
  LAYOUT: 'Layout Props',
} as const;

const dataProp = {
  table: {
    category: propsCategory.DATA,
  },
} as const;

const stateProp = {
  table: {
    category: propsCategory.STATE,
  },
} as const;

const editingProp = {
  table: {
    category: propsCategory.EDITING,
  },
} as const;

const appearanceProp = {
  table: {
    category: propsCategory.APPEARANCE,
  },
} as const;

const layoutProp = {
  table: {
    category: propsCategory.LAYOUT,
  },
} as const;

const getMetricsCardInvalidationKey = (args: MetricsCardProps): string => {
  return JSON.stringify({
    isExpandable: args.isExpandable,
    defaultIsExpanded: args.defaultIsExpanded,
    defaultSelectedMetricId: args.defaultSelectedMetricId,
    metricIds: args.metrics?.map((metric) => metric.id),
    replaceableMetricIds: args.replaceableMetrics?.map((metric) => metric.id),
  });
};

const MetricsCardPreview = (args: MetricsCardProps): React.ReactElement => {
  const invalidationKey = getMetricsCardInvalidationKey(args);
  const [visibleMetrics, setVisibleMetrics] = React.useState(args.metrics);

  React.useEffect(() => {
    setVisibleMetrics(args.metrics);
  }, [args.metrics]);

  const handleReplaceMetric = React.useMemo(() => {
    if (!args.replaceableMetrics?.length) {
      return args.onReplaceMetric;
    }

    if (args.onReplaceMetric) {
      return args.onReplaceMetric;
    }

    return ({
      currentMetricId,
      nextMetricId,
    }: {
      currentMetricId: string;
      nextMetricId: string;
    }) => {
      setVisibleMetrics((previousMetrics) => {
        const metricToInsert = allMetrics.find((metric) => metric.id === nextMetricId);

        if (!metricToInsert) {
          return previousMetrics;
        }

        return previousMetrics.map((metric) =>
          metric.id === currentMetricId ? metricToInsert : metric,
        );
      });
    };
  }, [args.onReplaceMetric, args.replaceableMetrics]);

  return (
    <MetricsCard
      key={invalidationKey}
      {...args}
      metrics={args.replaceableMetrics?.length ? visibleMetrics : args.metrics}
      onReplaceMetric={handleReplaceMetric}
    />
  );
};

const meta: Meta<MetricsCardProps> = {
  title: 'Components/MetricsCard',
  component: MetricsCard,
  tags: ['autodocs'],
  args: {
    metrics,
    chartData,
    xAxisDataKey: 'time',
    defaultSelectedMetricId: metrics[0]?.id,
    isExpandable: true,
    defaultIsExpanded: true,
    expandedChartType: 'line',
    collapsedChartType: 'line',
    width: '100%',
  },
  argTypes: {
    metrics: {
      control: 'object',
      description: 'Metric cards shown in the summary row.',
      ...dataProp,
    },
    chartData: {
      control: 'object',
      description: 'Chart data used by the expanded comparison chart.',
      ...dataProp,
    },
    xAxisDataKey: {
      control: 'text',
      description: 'Data key used for the chart x-axis.',
      ...dataProp,
    },
    selectedMetricId: {
      control: 'text',
      description: 'Controlled selected metric id.',
      ...stateProp,
    },
    defaultSelectedMetricId: {
      control: 'text',
      description: 'Initial selected metric id for uncontrolled usage.',
      ...stateProp,
    },
    onSelectedMetricChange: {
      control: false,
      description: 'Callback invoked when the selected metric changes.',
      ...stateProp,
    },
    isExpandable: {
      control: 'boolean',
      description: 'Enables the expandable layout with the larger comparison chart.',
      ...stateProp,
    },
    isExpanded: {
      control: 'boolean',
      description: 'Controlled expanded state.',
      ...stateProp,
    },
    defaultIsExpanded: {
      control: 'boolean',
      description: 'Initial expanded state for uncontrolled usage.',
      ...stateProp,
    },
    onExpandedChange: {
      control: false,
      description: 'Callback invoked when the expanded state changes.',
      ...stateProp,
    },
    replaceableMetrics: {
      control: 'object',
      description: 'List of metrics available in the replace menu for the selected card.',
      ...editingProp,
    },
    onReplaceMetric: {
      control: false,
      description: 'Callback invoked when a selected metric is replaced from the replace menu.',
      ...editingProp,
    },
    footer: {
      control: 'object',
      description: 'Optional footer content shown below the expanded chart.',
      ...appearanceProp,
    },
    expandedChartType: {
      control: 'radio',
      options: ['line', 'area'],
      description: 'Chart type used in the expanded comparison chart.',
      ...appearanceProp,
    },
    collapsedChartType: {
      control: 'radio',
      options: ['line', 'area'],
      description: 'Chart type used in the collapsed sparkline.',
      ...appearanceProp,
    },
    yAxisTickFormatter: {
      control: false,
      description: 'Formatter used for y-axis tick labels in the expanded chart.',
      ...appearanceProp,
    },
    width: {
      control: 'text',
      description: 'Width of the root card container.',
      ...layoutProp,
    },
    minWidth: {
      control: 'text',
      description: 'Minimum width of the root card container.',
      ...layoutProp,
    },
    maxWidth: {
      control: 'text',
      description: 'Maximum width of the root card container.',
      ...layoutProp,
    },
    testID: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

export default meta;

const Template: StoryFn<typeof MetricsCard> = (args: MetricsCardProps) => (
  <MetricsCardPreview {...args} />
);

export const Expanded = Template.bind({});
Expanded.args = {
  footer: {
    action: {
      text: 'See more',
      href: '#',
    },
  },
};

export const Collapsed = Template.bind({});
Collapsed.args = {
  isExpandable: false,
};

export const AreaChartVariant = Template.bind({});
AreaChartVariant.args = {
  expandedChartType: 'area',
  collapsedChartType: 'area',
  footer: {
    action: {
      text: 'See more',
      href: '#',
    },
  },
};

export const Editable = Template.bind({});
Editable.args = {
  footer: {
    action: {
      text: 'See more',
      href: '#',
    },
  },
  replaceableMetrics: allMetrics.map((metric) => ({
    id: metric.id,
    label: metric.label,
  })),
};
