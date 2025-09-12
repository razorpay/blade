import React from 'react';
import {
  LineChart,
  LineChartLine,
  LineChartXAxis,
  LineChartYAxis,
  LineChartCartesianGrid,
  LineChartChartTooltip,
  LineChartLegend,
  LineChartResponsiveContainer,
  LineChartReferenceLine,
} from '../LineChart';
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
          <LineChartLine dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with multiple lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" name="Sales" />
          <LineChartLine dataKey="profit" name="Profit" />
          <LineChartLine dataKey="revenue" name="Revenue" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with different line types', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" type="linear" />
          <LineChartLine dataKey="profit" type="monotone" />
          <LineChartLine dataKey="revenue" type="step" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with different stroke styles', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" strokeStyle="solid" />
          <LineChartLine dataKey="profit" strokeStyle="dashed" />
          <LineChartLine dataKey="revenue" strokeStyle="dotted" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with custom colors', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" color="chart.background.categorical.gray.moderate" />
          <LineChartLine dataKey="profit" color="chart.background.categorical.cider.moderate" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with dots enabled', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" dot={true} />
          <LineChartLine dataKey="profit" dot={false} />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with activeDot disabled', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" activeDot={false} />
          <LineChartLine dataKey="profit" activeDot={true} />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with showLegend false', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" showLegend={true} />
          <LineChartLine dataKey="profit" showLegend={false} />
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
          <LineChartLine dataKey="sales" connectNulls={true} />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with informational color theme', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData} colorTheme="informational">
          <LineChartLine dataKey="sales" />
          <LineChartLine dataKey="profit" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle empty data array', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={[]}>
          <LineChartLine dataKey="sales" />
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
          <LineChartLine dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render complete chart with all components', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartCartesianGrid />
          <LineChartXAxis dataKey="name" />
          <LineChartYAxis />
          <LineChartChartTooltip />
          <LineChartLegend />
          <LineChartLine dataKey="sales" name="Sales" />
          <LineChartLine dataKey="profit" name="Profit" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData} testID="line-chart-test">
          <LineChartLine dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(getByTestId('line-chart-test')).toBeInTheDocument();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartXAxis dataKey="name" />
          <LineChartYAxis />
          <LineChartLine dataKey="sales" />
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
          <LineChartLine dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Line with custom name', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" name="Monthly Sales" />
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
            <LineChartLine dataKey="sales" type={type} />
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
            <LineChartLine dataKey="sales" strokeStyle={strokeStyle} />
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
          <LineChartLine
            dataKey="sales"
            dot={{ fill: 'red', stroke: 'blue', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render Line with custom activeDot configuration', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine
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
          <LineChartLine dataKey="sales" />
        </LineChart>
      </Box>,
    );
    expect(getByTestId('line-test')).toBeInTheDocument();
  });
});

describe('LineChart Integration Tests', () => {
  it('should render with ResponsiveContainer', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartXAxis dataKey="name" />
          <LineChartYAxis />
          <LineChartLine dataKey="sales" />
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
          <LineChartXAxis dataKey="date" />
          <LineChartYAxis />
          <LineChartLine dataKey="metrics.sales" name="Sales" />
          <LineChartLine dataKey="metrics.profit" name="Profit" />
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
          <LineChartXAxis dataKey="name" />
          <LineChartYAxis />
          <LineChartLine dataKey="value" name="Value" />
          <LineChartLine dataKey="percentage" name="Percentage" />
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
          <LineChartLine dataKey="sales" strokeStyle="dashed" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should apply correct animation properties for solid lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <LineChart data={mockData}>
          <LineChartLine dataKey="sales" strokeStyle="solid" />
        </LineChart>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
