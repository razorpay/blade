import React from 'react';
import { fireEvent } from '@testing-library/react';
import { MetricsCard } from '../MetricsCard';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { normalizeSnapshotIds } from '~utils/testing/normalizeSnapshotIds';
import { Box } from '~components/Box';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');

  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={800} height={320}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const chartData = [
  {
    time: '12AM',
    salesCurrent: 2800,
    salesPrevious: 2700,
    conversionCurrent: 11,
    conversionPrevious: 10.4,
  },
  {
    time: '3AM',
    salesCurrent: 2350,
    salesPrevious: 2550,
    conversionCurrent: 9.8,
    conversionPrevious: 10.1,
  },
  {
    time: '6AM',
    salesCurrent: 2600,
    salesPrevious: 1900,
    conversionCurrent: 10.4,
    conversionPrevious: 8.8,
  },
  {
    time: '9AM',
    salesCurrent: 2200,
    salesPrevious: 1600,
    conversionCurrent: 9.2,
    conversionPrevious: 8.2,
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
];

const replaceableMetrics = [
  ...metrics.map((metric) => ({ id: metric.id, label: metric.label })),
  { id: 'average-order-value', label: 'Average order value' },
];

describe('<MetricsCard />', () => {
  const onMetricSelect = jest.fn();
  const baseProps = {
    metrics,
    chartData,
    xAxisDataKey: 'time',
    footer: {
      action: {
        text: 'See more',
        href: '#',
      },
    },
  };

  it('should render expanded metrics card', () => {
    const { container } = renderWithTheme(
      <Box width="900px">
        <MetricsCard {...baseProps} />
      </Box>,
    );

    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });

  it('should render collapsed state', () => {
    const { queryByLabelText, queryByText } = renderWithTheme(
      <Box width="900px">
        <MetricsCard {...baseProps} isExpandable={false} />
      </Box>,
    );

    expect(queryByText('Last 7 days')).not.toBeInTheDocument();
    expect(queryByLabelText(/expand metrics card/i)).not.toBeInTheDocument();
    expect(queryByLabelText(/collapse metrics card/i)).not.toBeInTheDocument();
  });

  it('should call onSelectedMetricChange when a different metric is clicked', () => {
    const onSelectedMetricChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Box width="900px">
        <MetricsCard {...baseProps} onSelectedMetricChange={onSelectedMetricChange} />
      </Box>,
    );

    fireEvent.click(getByRole('button', { name: /checkout conversion rate/i }));

    expect(onSelectedMetricChange).toHaveBeenCalledWith('checkout-conversion-rate');
  });

  it('should expand when a metric is clicked in collapsed expandable state', () => {
    const onExpandedChange = jest.fn();
    const { getByRole, queryByText } = renderWithTheme(
      <Box width="900px">
        <MetricsCard {...baseProps} defaultIsExpanded={false} onExpandedChange={onExpandedChange} />
      </Box>,
    );

    expect(queryByText('Last 7 days')).not.toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: /checkout conversion rate/i }));

    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(queryByText('Last 7 days')).toBeInTheDocument();
  });

  it('should use accessibilityValue when metric value is a React node', () => {
    const metricsWithNodeValue = [
      {
        ...metrics[0],
        value: <span>₹2.89L</span>,
        accessibilityValue: '2.89 lakhs',
      },
      metrics[1],
    ];
    const { getByRole } = renderWithTheme(
      <Box width="900px">
        <MetricsCard
          {...baseProps}
          metrics={metricsWithNodeValue}
          isExpandable={false}
          onSelectedMetricChange={onMetricSelect}
        />
      </Box>,
    );

    expect(getByRole('button', { name: /total sales 2\.89 lakhs 12%/i })).toBeInTheDocument();
  });

  it('should toggle expanded state', () => {
    const onExpandedChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Box width="900px">
        <MetricsCard {...baseProps} onExpandedChange={onExpandedChange} />
      </Box>,
    );

    fireEvent.click(getByRole('button', { name: /collapse metrics card/i }));

    expect(onExpandedChange).toHaveBeenCalledWith(false);
  });

  it('should open replace menu and call onReplaceMetric for unused metric', () => {
    const onReplaceMetric = jest.fn();
    const { getByLabelText, getByText } = renderWithTheme(
      <Box width="900px">
        <MetricsCard
          {...baseProps}
          replaceableMetrics={replaceableMetrics}
          onReplaceMetric={onReplaceMetric}
        />
      </Box>,
    );

    fireEvent.click(getByLabelText(/replace total sales card/i));
    fireEvent.click(getByText('Average order value'));

    expect(onReplaceMetric).toHaveBeenCalledWith({
      currentMetricId: 'total-sales',
      nextMetricId: 'average-order-value',
    });
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Box width="900px">
        <MetricsCard {...baseProps} onSelectedMetricChange={onMetricSelect} />
      </Box>,
    );

    await assertAccessible(container);
  });
});
