import React from 'react';
import { ChartDonutWrapper, ChartDonut, ChartDonutCell } from '../DonutChart';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Box } from '~components/Box/Box';

const mockData = [
  { name: 'Desktop', value: 400, color: '#0088FE' },
  { name: 'Mobile', value: 300, color: '#00C49F' },
  { name: 'Tablet', value: 300, color: '#FFBB28' },
  { name: 'Desktop', value: 200, color: '#FF8042' },
];

const mockDataWithNulls = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: null },
  { name: 'Tablet', value: 300 },
  { name: 'Desktop', value: 200 },
];

// Mock recharts ResponsiveContainer to have fixed dimensions for testing
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={400} height={400}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

describe('<DonutChart />', () => {
  it('should render basic DonutChart with single data series', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render DonutChart with center text', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper content={{ value: 'Total: 1000' }}>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render DonutChart with different radius sizes', () => {
    const radiusSizes = ['small', 'medium', 'large'] as const;

    radiusSizes.forEach((radius) => {
      const { container } = renderWithTheme(
        <Box width="500px" height="500px">
          <ChartDonutWrapper>
            <ChartDonut data={mockData} dataKey="value" nameKey="name" radius={radius} />
          </ChartDonutWrapper>
        </Box>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render DonutChart with different chart types', () => {
    const chartTypes = ['circle', 'semicircle'] as const;

    chartTypes.forEach((type) => {
      const { container } = renderWithTheme(
        <Box width="500px" height="500px">
          <ChartDonutWrapper>
            <ChartDonut data={mockData} dataKey="value" nameKey="name" type={type} />
          </ChartDonutWrapper>
        </Box>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render DonutChart with custom colors', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={mockData} dataKey="value" nameKey="name">
            <ChartDonutCell color="data.background.categorical.gray.moderate" />
            <ChartDonutCell color="data.background.categorical.blue.moderate" />
          </ChartDonut>
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render DonutChart with custom center position', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" cx="60%" cy="40%" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle empty data array', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={[]} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle data with null values', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={mockDataWithNulls} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should handle data with missing properties', () => {
    const incompleteData = [
      { name: 'Desktop', value: 400 },
      { name: 'Mobile' }, // missing value
      { name: 'Tablet', value: 300 },
    ];

    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={incompleteData} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    await assertAccessible(container);
  });
});

describe('<ChartDonut />', () => {
  it('should render ChartDonut with default props', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render ChartDonut with custom dataKey and nameKey', () => {
    const customData = [
      { category: 'Desktop', count: 400 },
      { category: 'Mobile', count: 300 },
      { category: 'Tablet', count: 300 },
    ];

    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={customData} dataKey="count" nameKey="category" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render ChartDonut with all radius sizes', () => {
    const radiusSizes = ['small', 'medium', 'large'] as const;

    radiusSizes.forEach((radius) => {
      const { container } = renderWithTheme(
        <Box width="500px" height="500px">
          <ChartDonutWrapper>
            <ChartDonut data={mockData} dataKey="value" nameKey="name" radius={radius} />
          </ChartDonutWrapper>
        </Box>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render ChartDonut with all chart types', () => {
    const chartTypes = ['circle', 'semicircle'] as const;

    chartTypes.forEach((type) => {
      const { container } = renderWithTheme(
        <Box width="500px" height="500px">
          <ChartDonutWrapper>
            <ChartDonut data={mockData} dataKey="value" nameKey="name" type={type} />
          </ChartDonutWrapper>
        </Box>,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render ChartDonut with custom center coordinates', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartDonutWrapper>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" cx="40%" cy="60%" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
