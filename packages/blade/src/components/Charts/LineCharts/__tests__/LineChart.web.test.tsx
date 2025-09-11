import React from 'react';
import { LineChart, Line } from '../lineCharts';
import { XAxis, YAxis, CartesianGrid, ChartTooltip, Legend } from '../../BaseChartComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Box } from '~components/Box/Box';

const mockData = [
  { name: 'Jan', sales: 4000, profit: 2000, revenue: 6000 },
  { name: 'Feb', sales: 3000, profit: 1500, revenue: 4500 },
  { name: 'Mar', sales: 2000, profit: 1000, revenue: 3000 },
  { name: 'Apr', sales: 5000, profit: 2500, revenue: 7500 },
];

describe('<LineChart />', () => {
  it('should render basic LineChart with single line', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with multiple lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" name="Sales" />
          <Line dataKey="profit" name="Profit" />
          <Line dataKey="revenue" name="Revenue" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with different line types', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" type="linear" />
          <Line dataKey="profit" type="monotone" />
          <Line dataKey="revenue" type="step" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with different stroke styles', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" strokeStyle="solid" />
          <Line dataKey="profit" strokeStyle="dashed" />
          <Line dataKey="revenue" strokeStyle="dotted" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with custom colors', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" color="chart.background.categorical.gray.moderate" />
          <Line dataKey="profit" color="chart.background.categorical.cider.moderate" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with dots enabled', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" dot={true} />
          <Line dataKey="profit" dot={false} />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with activeDot disabled', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" activeDot={false} />
          <Line dataKey="profit" activeDot={true} />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with showLegend false', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" showLegend={true} />
          <Line dataKey="profit" showLegend={false} />
        </LineChart>
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
        <LineChart data={dataWithNulls}>
          <Line dataKey="sales" connectNulls={true} />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with informational color theme', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData} colorTheme="informational">
          <Line dataKey="sales" />
          <Line dataKey="profit" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle empty data array', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={[]}>
          <Line dataKey="sales" />
        </LineChart>
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
        <LineChart data={incompleteData}>
          <Line dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render complete chart with all components', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip />
          <Legend />
          <Line dataKey="sales" name="Sales" />
          <Line dataKey="profit" name="Profit" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData} testID="line-chart-test">
          <Line dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(getByTestId('line-chart-test')).toBeInTheDocument();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line dataKey="sales" />
        </LineChart>
      </Box>,
    );
    await assertAccessible(container);
  });
});

describe('<Line />', () => {
  it('should render Line with default props', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Line with custom name', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" name="Monthly Sales" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Line with all line types', () => {
    const lineTypes = ['step', 'stepAfter', 'stepBefore', 'linear', 'monotone'] as const;

    lineTypes.forEach((type) => {
      const { container } = renderWithTheme(
        <Box width="500px" height="500px">
          <LineChart data={mockData}>
            <Line dataKey="sales" type={type} />
          </LineChart>
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
          <LineChart data={mockData}>
            <Line dataKey="sales" strokeStyle={strokeStyle} />
          </LineChart>
        </Box>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render Line with custom dot configuration', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" dot={{ fill: 'red', stroke: 'blue', strokeWidth: 2, r: 4 }} />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Line with custom activeDot configuration', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line
            dataKey="sales"
            activeDot={{ fill: 'green', stroke: 'darkgreen', strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData} testID="line-test">
          <Line dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(getByTestId('line-test')).toBeInTheDocument();
  });
});

describe('LineChart Error Handling', () => {
  it('should throw error when too many lines are configured in development', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    // Create 11 lines (exceeds MAX_LINES = 10)
    const manyLines = Array.from({ length: 11 }, (_, index) => (
      <Line key={index} dataKey={`data${index}`} />
    ));

    expect(() => {
      renderWithTheme(<LineChart data={mockData}>{manyLines}</LineChart>);
    }).toThrow('Too many lines configured. Maximum allowed is 10.');

    mockConsoleError.mockRestore();
  });

  it('should not throw error when exactly MAX_LINES are configured', () => {
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    // Create exactly 10 lines (MAX_LINES)
    const maxLines = Array.from({ length: 10 }, (_, index) => (
      <Line key={index} dataKey={`data${index}`} />
    ));

    expect(() => {
      renderWithTheme(<LineChart data={mockData}>{maxLines}</LineChart>);
    }).not.toThrow();

    mockConsoleError.mockRestore();
  });
});

describe('LineChart Integration Tests', () => {
  it('should render with ResponsiveContainer', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line dataKey="sales" />
        </LineChart>
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
        <LineChart data={complexData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Line dataKey="metrics.sales" name="Sales" />
          <Line dataKey="metrics.profit" name="Profit" />
        </LineChart>
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
        <LineChart data={mixedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Line dataKey="value" name="Value" />
          <Line dataKey="percentage" name="Percentage" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});

describe('LineChart Styling Tests', () => {
  it('should apply correct animation properties for dashed lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" strokeStyle="dashed" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should apply correct animation properties for solid lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <Line dataKey="sales" strokeStyle="solid" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
