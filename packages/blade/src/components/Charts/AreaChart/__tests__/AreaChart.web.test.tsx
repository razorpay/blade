import React from 'react';
import { Area, AreaChart } from '../AreaCharts';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

const mockData = [
  { name: 'Jan', sales: 4000, profit: 2000, revenue: 6000 },
  { name: 'Feb', sales: 3000, profit: 1500, revenue: 4500 },
  { name: 'Mar', sales: 2000, profit: 1000, revenue: 3000 },
  { name: 'Apr', sales: 5000, profit: 2500, revenue: 7500 },
];

describe('<AreaChart />', () => {
  it('should render basic LineChart with single line', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <AreaChart data={mockData}>
          <Area dataKey="sales" name="Sales" />
        </AreaChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with multiple lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <AreaChart data={mockData}>
          <Area dataKey="sales" name="Sales" />
        </AreaChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
