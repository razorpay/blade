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

  // With the backward-compatible 'solid' style, connectNulls={true} is passed through to
  // RechartsArea so the area fill + stroke bridge across nulls natively — no separate
  // NullBridgeLayer path is drawn. Only 'dashed' uses the custom overlay layer.
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

  it('should bridge area fill natively via Recharts connectNulls when connectNullsStyle is "solid" (backward compatible)', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartAreaWrapper data={dataWithNullsForBridge}>
          <ChartArea dataKey="sales" name="Sales" connectNulls={true} connectNullsStyle="solid" />
        </ChartAreaWrapper>
      </Box>,
    );
    // The solid bridge is handled natively by Recharts (connectNulls={true} passed through to
    // RechartsArea), so no separate NullBridgeLayer path is drawn.
    await waitFor(() => {
      expect(container.querySelectorAll('.blade-null-bridge-layer path')).toHaveLength(0);
    });
    // The area curve should be a single continuous path (Recharts' native connectNulls bridges
    // the gap in both the fill and the stroke).
    const areaCurves = container.querySelectorAll('.recharts-area-curve');
    expect(areaCurves.length).toBeGreaterThan(0);
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
