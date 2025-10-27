import React from 'react';
import { ChartLineWrapper, ChartLine } from '../LineChart';
import {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '../../CommonChartComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
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

describe('<LineChart />', () => {
  it('should render basic LineChart with single line', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with multiple lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" name="Sales" />
          <ChartLine dataKey="profit" name="Profit" />
          <ChartLine dataKey="revenue" name="Revenue" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with different line types', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" type="linear" />
          <ChartLine dataKey="profit" type="monotone" />
          <ChartLine dataKey="revenue" type="step" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with different stroke styles', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" strokeStyle="solid" />
          <ChartLine dataKey="profit" strokeStyle="dashed" />
          <ChartLine dataKey="revenue" strokeStyle="dotted" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with custom colors', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" color="chart.background.categorical.gray.moderate" />
          <ChartLine dataKey="profit" color="chart.background.categorical.cider.moderate" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with dots enabled', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" dot={true} />
          <ChartLine dataKey="profit" dot={false} />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with activeDot disabled', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" activeDot={false} />
          <ChartLine dataKey="profit" activeDot={true} />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with showLegend false', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" showLegend={true} />
          <ChartLine dataKey="profit" showLegend={false} />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with connectNulls true', () => {
    const dataWithNulls = [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: null },
      { name: 'Mar', sales: 2000 },
    ];

    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={dataWithNulls}>
          <ChartLine dataKey="sales" connectNulls={true} />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle empty data array', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={[]}>
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle data with missing properties', () => {
    const incompleteData = [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb' }, // missing sales
      { name: 'Mar', sales: 2000 },
    ];

    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={incompleteData}>
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render complete chart with all components', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartLine dataKey="sales" name="Sales" />
          <ChartLine dataKey="profit" name="Profit" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData} testID="line-chart-test">
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(getByTestId('line-chart-test')).toBeInTheDocument();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="name" />
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    await assertAccessible(container);
  });
});

describe('<Line />', () => {
  it('should render Line with default props', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Line with custom name', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" name="Monthly Sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Line with all line types', () => {
    const lineTypes = ['step', 'stepAfter', 'stepBefore', 'linear', 'monotone'] as const;

    lineTypes.forEach((type) => {
      const { container } = renderWithTheme(
        <Box width="500px" height="500px">
          <ChartLineWrapper data={mockData}>
            <ChartLine dataKey="sales" type={type} />
          </ChartLineWrapper>
        </Box>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render Line with all stroke styles', () => {
    const strokeStyles = ['dotted', 'dashed', 'solid'] as const;

    strokeStyles.forEach((strokeStyle) => {
      const { container } = renderWithTheme(
        <Box width="500px" height="500px">
          <ChartLineWrapper data={mockData}>
            <ChartLine dataKey="sales" strokeStyle={strokeStyle} />
          </ChartLineWrapper>
        </Box>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render Line with custom dot configuration', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" dot={{ fill: 'red', stroke: 'blue', strokeWidth: 2, r: 4 }} />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Line with custom activeDot configuration', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine
            dataKey="sales"
            activeDot={{ fill: 'green', stroke: 'darkgreen', strokeWidth: 2, r: 6 }}
          />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData} testID="line-test">
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(getByTestId('line-test')).toBeInTheDocument();
  });
});

describe('LineChart Integration Tests', () => {
  it('should render with ResponsiveContainer', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle complex data structure', () => {
    const complexData = [
      {
        date: '2023-01-01',
        metrics: { sales: 4000, profit: 2000 },
        category: 'A',
      },
      {
        date: '2023-02-01',
        metrics: { sales: 3000, profit: 1500 },
        category: 'B',
      },
    ];

    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={complexData}>
          <ChartXAxis dataKey="date" />
          <ChartYAxis />
          <ChartLine dataKey="metrics.sales" name="Sales" />
          <ChartLine dataKey="metrics.profit" name="Profit" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle mixed data types', () => {
    const mixedData = [
      { name: 'Jan', value: 100, percentage: 0.25 },
      { name: 'Feb', value: 200, percentage: 0.5 },
      { name: 'Mar', value: 150, percentage: 0.375 },
    ];

    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mixedData}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartLine dataKey="value" name="Value" />
          <ChartLine dataKey="percentage" name="Percentage" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});

describe('LineChart Styling Tests', () => {
  it('should apply correct animation properties for dashed lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" strokeStyle="dashed" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should apply correct animation properties for solid lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" strokeStyle="solid" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
