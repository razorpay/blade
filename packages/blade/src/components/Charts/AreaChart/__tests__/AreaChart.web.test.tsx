import React from 'react';
import { ChartArea, ChartAreaWrapper } from '../AreaChart.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

const mockData = [
  { name: 'Jan', sales: 4000, profit: 2000, revenue: 6000 },
  { name: 'Feb', sales: 3000, profit: 1500, revenue: 4500 },
  { name: 'Mar', sales: 2000, profit: 1000, revenue: 3000 },
  { name: 'Apr', sales: 5000, profit: 2500, revenue: 7500 },
];
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

describe('<AreaChart />', () => {
  it('should render basic LineChart with single line', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartAreaWrapper data={mockData}>
          <ChartArea dataKey="sales" name="Sales" />
        </ChartAreaWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with multiple lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartAreaWrapper data={mockData}>
          <ChartArea dataKey="sales" name="Sales" />
        </ChartAreaWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
