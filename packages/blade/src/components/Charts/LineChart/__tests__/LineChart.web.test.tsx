import React from 'react';
import { ChartLineWrapper, ChartLine, ChartReferenceBand } from '../LineChart';
import {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '../../CommonChartComponents';
import { waitFor } from '@testing-library/react';
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
          <ChartLine dataKey="sales" color="data.background.categorical.gray.moderate" />
          <ChartLine dataKey="profit" color="data.background.categorical.blue.moderate" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render LineChart with sequential colors', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={mockData}>
          <ChartLine dataKey="sales" color="data.background.sequential.blue.400" />
          <ChartLine dataKey="profit" color="data.background.sequential.green.600" />
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

  // A dashed bridge keeps the main (gapped) line and adds a separate curved dashed path, drawn by
  // the <Customized> NullBridgeLayer as an SVG <path> (not a Recharts line), so it carries a real
  // strokeDasharray. A hard gap / solid bridge renders no such path. Interior null run: Mar..May.
  const dataWithNullsForBridge = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: null },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  it('should not render a dashed bridge path by default (hard gap)', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={dataWithNullsForBridge}>
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container.querySelectorAll('.blade-null-bridge-layer path')).toHaveLength(0);
  });

  it('should not render a dashed bridge path for a solid bridge (connectNulls true)', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={dataWithNullsForBridge}>
          <ChartLine dataKey="sales" connectNulls={true} connectNullsStyle="solid" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container.querySelectorAll('.blade-null-bridge-layer path')).toHaveLength(0);
  });

  it('should render a curved dashed bridge path when connectNullsStyle is "dashed"', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={dataWithNullsForBridge}>
          <ChartLine dataKey="sales" connectNulls={true} connectNullsStyle="dashed" />
        </ChartLineWrapper>
      </Box>,
    );
    // The bridge is derived from the rendered line geometry, which the chart commits asynchronously.
    await waitFor(() => {
      expect(container.querySelectorAll('.blade-null-bridge-layer path')).toHaveLength(1);
    });
    const bridgePath = container.querySelector('.blade-null-bridge-layer path')!;
    expect(bridgePath).toHaveAttribute('stroke-dasharray', '5 5');
    // A curved path is sampled at many points, so the `d` attribute has multiple line-to commands.
    expect((bridgePath.getAttribute('d')?.match(/L/g) ?? []).length).toBeGreaterThan(1);
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

describe('<ChartReferenceBand />', () => {
  const rangeData = [
    { name: 'Jan', sales: 4000, min: 3000, max: 5000 },
    { name: 'Feb', sales: 3000, min: 2200, max: 4200 },
    { name: 'Mar', sales: 2000, min: 1500, max: 3200 },
    { name: 'Apr', sales: 5000, min: 3500, max: 6000 },
  ];

  it('should render a LineChart with a reference band', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={rangeData}>
          <ChartReferenceBand lowerDataKey="min" upperDataKey="max" name="Reference band" />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartLegend />
          <ChartLine dataKey="sales" name="Sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should paint a filled band path between the bounds', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={rangeData}>
          <ChartReferenceBand lowerDataKey="min" upperDataKey="max" />
          <ChartXAxis dataKey="name" />
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    // The band is derived from the rendered bound-line geometry, committed asynchronously.
    await waitFor(() => {
      expect(container.querySelectorAll('.blade-reference-band-layer path')).toHaveLength(1);
    });
    const bandPath = container.querySelector('.blade-reference-band-layer path')!;
    // A closed, filled area — has a fill and closes with Z.
    expect(bandPath).toHaveAttribute('fill');
    expect(bandPath.getAttribute('fill')).not.toBe('none');
    expect(bandPath.getAttribute('d')).toContain('Z');
  });

  it('should not render a band layer when no ChartReferenceBand is present', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={rangeData}>
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
    expect(container.querySelectorAll('.blade-reference-band-layer path')).toHaveLength(0);
  });

  it('should show a legend entry for the range band', async () => {
    const { queryByText } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={rangeData}>
          <ChartReferenceBand lowerDataKey="min" upperDataKey="max" name="Peer range" />
          <ChartXAxis dataKey="name" />
          <ChartLegend />
          <ChartLine dataKey="sales" name="Sales" />
        </ChartLineWrapper>
      </Box>,
    );
    await waitFor(() => {
      expect(queryByText('Peer range')).toBeInTheDocument();
    });
  });
});

describe('LineChart per-line reference bands (range on ChartLine)', () => {
  const multiData = [
    {
      name: 'Jan',
      payments: 62,
      paymentsMin: 50,
      paymentsMax: 74,
      refunds: 50,
      refundsMin: 38,
      refundsMax: 62,
    },
    {
      name: 'Feb',
      payments: 66,
      paymentsMin: 54,
      paymentsMax: 78,
      refunds: 52,
      refundsMin: 40,
      refundsMax: 64,
    },
    {
      name: 'Mar',
      payments: 70,
      paymentsMin: 58,
      paymentsMax: 82,
      refunds: 58,
      refundsMin: 46,
      refundsMax: 70,
    },
    {
      name: 'Apr',
      payments: 74,
      paymentsMin: 62,
      paymentsMax: 86,
      refunds: 60,
      refundsMin: 48,
      refundsMax: 72,
    },
  ];

  it('should paint one band per line that declares a range', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={multiData}>
          <ChartXAxis dataKey="name" />
          <ChartLine
            dataKey="payments"
            name="Payments"
            rangeLowerDataKey="paymentsMin"
            rangeUpperDataKey="paymentsMax"
          />
          <ChartLine
            dataKey="refunds"
            name="Refunds"
            rangeLowerDataKey="refundsMin"
            rangeUpperDataKey="refundsMax"
          />
        </ChartLineWrapper>
      </Box>,
    );
    await waitFor(() => {
      // Two lines with ranges → two filled band paths in the band layer.
      expect(container.querySelectorAll('.blade-reference-band-layer path').length).toBe(2);
    });
    const bandPaths = container.querySelectorAll('.blade-reference-band-layer path');
    expect(bandPaths.length).toBe(2);
    bandPaths.forEach((path) => {
      expect(path.getAttribute('fill')).not.toBe('none');
      expect(path.getAttribute('d')).toContain('Z');
    });
  });

  it('should only paint bands for lines that declare a range', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={multiData}>
          <ChartXAxis dataKey="name" />
          <ChartLine
            dataKey="payments"
            name="Payments"
            rangeLowerDataKey="paymentsMin"
            rangeUpperDataKey="paymentsMax"
          />
          <ChartLine dataKey="refunds" name="Refunds" />
        </ChartLineWrapper>
      </Box>,
    );
    await waitFor(() => {
      expect(container.querySelectorAll('.blade-reference-band-layer path').length).toBe(1);
    });
  });

  it('should render a legend swatch per line band', async () => {
    const { queryByText } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartLineWrapper data={multiData}>
          <ChartXAxis dataKey="name" />
          <ChartLegend />
          <ChartLine
            dataKey="payments"
            name="Payments"
            rangeLowerDataKey="paymentsMin"
            rangeUpperDataKey="paymentsMax"
            rangeName="Payments industry range"
          />
          <ChartLine
            dataKey="refunds"
            name="Refunds"
            rangeLowerDataKey="refundsMin"
            rangeUpperDataKey="refundsMax"
            rangeName="Refunds industry range"
          />
        </ChartLineWrapper>
      </Box>,
    );
    await waitFor(() => {
      expect(queryByText('Payments industry range')).toBeInTheDocument();
      expect(queryByText('Refunds industry range')).toBeInTheDocument();
    });
  });
});
