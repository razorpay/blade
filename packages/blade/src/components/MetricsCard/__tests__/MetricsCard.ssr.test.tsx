import React from 'react';
import { MetricsCard } from '../MetricsCard';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

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

describe('<MetricsCard /> SSR', () => {
  it('should render collapsed expandable metrics card on server', () => {
    const { container } = renderWithSSR(
      <MetricsCard
        metrics={metrics}
        chartData={chartData}
        xAxisDataKey="time"
        defaultIsExpanded={false}
      />,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render non-expandable collapsed metrics card on server', () => {
    const { container } = renderWithSSR(
      <MetricsCard
        metrics={metrics}
        chartData={chartData}
        xAxisDataKey="time"
        isExpandable={false}
      />,
    );

    expect(container).toMatchSnapshot();
  });
});
