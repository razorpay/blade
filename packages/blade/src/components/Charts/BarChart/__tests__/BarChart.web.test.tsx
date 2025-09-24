import React from 'react';
import { ChartBarWrapper, ChartBar } from '../BarChart';
import {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '../../CommonChartComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

const mockData = [
  { name: 'Jan', sales: 4000, profit: 2000, revenue: 6000 },
  { name: 'Feb', sales: 3000, profit: 1500, revenue: 4500 },
  { name: 'Mar', sales: 2000, profit: 1000, revenue: 3000 },
  { name: 'Apr', sales: 5000, profit: 2500, revenue: 7500 },
];

// Mock recharts ResponsiveContainer for consistent testing
// Thanks to : https://jskim1991.medium.com/react-writing-tests-with-graphs-9b7f2c9eeefc

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

describe('<BarChart />', () => {
  it('should render basic BarChart with single bar', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartBar dataKey="sales" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render BarChart with multiple bars', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartBar dataKey="sales" name="Sales" />
          <ChartBar dataKey="profit" name="Profit" />
          <ChartBar dataKey="revenue" name="Revenue" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render stacked BarChart', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartBar dataKey="sales" name="Sales" stackId="stack-1" />
          <ChartBar dataKey="profit" name="Profit" stackId="stack-1" />
          <ChartBar dataKey="revenue" name="Revenue" stackId="stack-1" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render BarChart with custom colors', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartBar dataKey="sales" color="chart.background.categorical.azure.moderate" />
          <ChartBar dataKey="profit" color="chart.background.categorical.cider.moderate" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render complete chart with all components', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="sales" name="Sales" />
          <ChartBar dataKey="profit" name="Profit" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
