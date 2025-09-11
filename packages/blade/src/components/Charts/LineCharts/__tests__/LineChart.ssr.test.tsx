import React from 'react';
import { LineChart, Line } from '../lineCharts';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Box } from '~components/Box/Box';

const mockData = [
  { name: 'Jan', sales: 4000, profit: 2000 },
  { name: 'Feb', sales: 3000, profit: 1500 },
  { name: 'Mar', sales: 2000, profit: 1000 },
];

describe('<LineChart /> SSR', () => {
  it('should render basic LineChart with single line', () => {
    // https://github.com/recharts/recharts/issues/727
    beforeAll(() => {
      jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100);
      jest.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(100);
    });

    const { container } = renderWithSSR(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
