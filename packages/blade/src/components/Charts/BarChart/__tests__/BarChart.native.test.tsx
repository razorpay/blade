import React from 'react';
import {
  ChartBar,
  ChartBarWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartLegend,
  ChartCartesianGrid,
  ChartReferenceLine,
} from '~components/Charts';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const sampleData = [
  { month: 'Jan', revenue: 100, refunds: 20 },
  { month: 'Feb', revenue: 140, refunds: 25 },
  { month: 'Mar', revenue: 180, refunds: 30 },
];

describe('<ChartBarWrapper /> (native)', () => {
  it('renders horizontal grouped bars', () => {
    const { toJSON } = renderWithTheme(
      <ChartBarWrapper data={sampleData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartBar dataKey="revenue" name="Revenue" />
        <ChartBar dataKey="refunds" name="Refunds" />
        <ChartLegend />
      </ChartBarWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders empty-state copy when data is empty', () => {
    const { getByText } = renderWithTheme(
      <ChartBarWrapper data={[]}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartBar dataKey="revenue" />
      </ChartBarWrapper>,
    );
    expect(getByText('No data to display')).toBeTruthy();
  });

  it('renders a horizontal reference line at y=120', () => {
    const { toJSON } = renderWithTheme(
      <ChartBarWrapper data={sampleData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartBar dataKey="revenue" />
        <ChartReferenceLine y={120} label="Target" />
      </ChartBarWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
