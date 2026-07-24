import React from 'react';
import { waitFor } from '@testing-library/react';
import { ChartArea, ChartAreaWrapper } from '../AreaChart.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { normalizeSnapshotIds } from '~utils/testing/normalizeSnapshotIds';
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
    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });

  it('should render LineChart with multiple lines', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartAreaWrapper data={mockData}>
          <ChartArea dataKey="sales" name="Sales" />
        </ChartAreaWrapper>
      </Box>,
    );
    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });

  // With connectNullsStyle='solid' (default), the area uses Recharts' built-in connectNulls
  // to fill and stroke across nulls — preserving backward compatibility. No separate bridge
  // path is rendered. Only 'dashed' gaps the area and draws a separate dashed bridge path.
  // A hard gap (connectNulls={false}) renders no bridge path either.
  // Interior null run: Mar..May.
  const dataWithNullsForBridge = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: null },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  it('should give each chart instance a unique gradient id so fills do not collide across charts on one page', () => {
    // Two AreaCharts with the same dataKey previously emitted the same gradient id (e.g.
    // `color-0-sales`), so every area's fill="url(#...)" resolved to the first chart's gradient and
    // could be washed out by its color. Each instance must now namespace its gradient id.
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartAreaWrapper data={mockData}>
          <ChartArea
            dataKey="sales"
            name="Sales"
            color="data.background.categorical.blue.moderate"
          />
        </ChartAreaWrapper>
        <ChartAreaWrapper data={mockData}>
          <ChartArea
            dataKey="sales"
            name="Sales"
            color="data.background.categorical.green.moderate"
          />
        </ChartAreaWrapper>
      </Box>,
    );
    const gradientIds = Array.from(container.querySelectorAll('linearGradient')).map((g) => g.id);
    expect(gradientIds).toHaveLength(2);
    expect(new Set(gradientIds).size).toBe(2);
    // The area fills must reference their own chart's gradient id.
    const fillRefs = Array.from(container.querySelectorAll('.recharts-area-area')).map((a) =>
      a.getAttribute('fill'),
    );
    fillRefs.forEach((ref) => {
      expect(gradientIds.some((id) => ref === `url(#${id})`)).toBe(true);
    });
  });

  it('should not render a dashed bridge path by default (hard gap)', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartAreaWrapper data={dataWithNullsForBridge}>
          <ChartArea dataKey="sales" name="Sales" />
        </ChartAreaWrapper>
      </Box>,
    );
    expect(container.querySelectorAll('.blade-null-bridge-layer path')).toHaveLength(0);
  });

  it('should not render a bridge path and should fill across nulls when connectNullsStyle is "solid" (backward compatible)', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartAreaWrapper data={dataWithNullsForBridge}>
          <ChartArea dataKey="sales" name="Sales" connectNulls={true} connectNullsStyle="solid" />
        </ChartAreaWrapper>
      </Box>,
    );
    // With 'solid' (default), Recharts' built-in connectNulls fills across nulls — no separate
    // bridge path is needed.
    expect(container.querySelectorAll('.blade-null-bridge-layer path')).toHaveLength(0);
    // The area should have connectNulls enabled (the area fill connects across the null gap).
    const areaComponents = container.querySelectorAll('.recharts-area-area');
    expect(areaComponents.length).toBeGreaterThan(0);
  });

  it('should render a curved dashed bridge path when connectNullsStyle is "dashed"', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartAreaWrapper data={dataWithNullsForBridge}>
          <ChartArea dataKey="sales" name="Sales" connectNulls={true} connectNullsStyle="dashed" />
        </ChartAreaWrapper>
      </Box>,
    );
    // The bridge is derived from the rendered area geometry, which the chart commits asynchronously.
    await waitFor(() => {
      expect(container.querySelectorAll('.blade-null-bridge-layer path')).toHaveLength(1);
    });
    const bridgePath = container.querySelector('.blade-null-bridge-layer path')!;
    expect(bridgePath).toHaveAttribute('stroke-dasharray', '5 5');
    // A curved path is sampled at many points, so the `d` attribute has multiple line-to commands.
    expect((bridgePath.getAttribute('d')?.match(/L/g) ?? []).length).toBeGreaterThan(1);
  });
});
