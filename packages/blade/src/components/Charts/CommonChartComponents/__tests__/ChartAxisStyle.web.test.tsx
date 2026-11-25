import React from 'react';
import { waitFor } from '@testing-library/react';
import { ChartXAxis, ChartYAxis, ChartCartesianGrid, ChartTooltip } from '..';
import { ChartLineWrapper, ChartLine } from '../../LineChart';
import { ChartAreaWrapper, ChartArea } from '../../AreaChart';
import { ChartBarWrapper, ChartBar } from '../../BarChart';
import type { ChartAxisStyle, ChartYLabelPlacement } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

const data = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 123450 },
  { month: 'Apr', sales: 5000 },
];

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={800} height={400}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

// An array, not a fragment: the wrappers read their direct children.
const axes = [
  <ChartCartesianGrid key="grid" />,
  <ChartXAxis key="x" dataKey="month" />,
  <ChartYAxis key="y" />,
];

const renderChart = (
  kind: 'line' | 'area' | 'bar' | 'vertical-bar',
  axisStyle?: ChartAxisStyle,
  yLabelPlacement?: ChartYLabelPlacement,
): ReturnType<typeof renderWithTheme> => {
  if (kind === 'line') {
    return renderWithTheme(
      <Box width="800px" height="400px">
        <ChartLineWrapper data={data} axisStyle={axisStyle} yLabelPlacement={yLabelPlacement}>
          {axes}
          <ChartLine dataKey="sales" />
        </ChartLineWrapper>
      </Box>,
    );
  }
  if (kind === 'area') {
    return renderWithTheme(
      <Box width="800px" height="400px">
        <ChartAreaWrapper data={data} axisStyle={axisStyle} yLabelPlacement={yLabelPlacement}>
          {axes}
          <ChartArea dataKey="sales" name="Sales" />
        </ChartAreaWrapper>
      </Box>,
    );
  }
  return renderWithTheme(
    <Box width="800px" height="400px">
      <ChartBarWrapper
        data={data}
        axisStyle={axisStyle}
        yLabelPlacement={yLabelPlacement}
        layout={kind === 'vertical-bar' ? 'vertical' : 'horizontal'}
      >
        {kind === 'vertical-bar'
          ? [
              <ChartCartesianGrid key="grid" />,
              <ChartXAxis key="x" type="number" />,
              <ChartYAxis key="y" type="category" dataKey="month" />,
            ]
          : axes}
        <ChartBar dataKey="sales" />
      </ChartBarWrapper>
    </Box>,
  );
};

const axisLine = (container: HTMLElement, axis: 'xAxis' | 'yAxis'): Element | null =>
  container.querySelector(`.recharts-${axis} .recharts-cartesian-axis-line`);

const yTicks = (container: HTMLElement): Element[] =>
  Array.from(
    container.querySelectorAll('.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value'),
  );

const firstGridLineX = (container: HTMLElement): number =>
  Number(
    container.querySelector('.recharts-cartesian-grid-horizontal line')?.getAttribute('x') ??
      container.querySelector('.recharts-cartesian-grid-horizontal line')?.getAttribute('x1'),
  );

describe('axisStyle on the chart wrappers', () => {
  it.each(['line', 'area', 'bar'] as const)(
    'draws both axis lines on a %s chart by default (lines)',
    async (kind) => {
      const { container } = renderChart(kind);
      await waitFor(() => expect(yTicks(container).length).toBeGreaterThan(0));

      expect(axisLine(container, 'xAxis')).not.toBeNull();
      expect(axisLine(container, 'yAxis')).not.toBeNull();
      expect(container.querySelector('[data-blade-chart-axis-style]')).toBeNull();
    },
  );

  it.each(['line', 'area', 'bar'] as const)(
    'draws no axis line and puts the Y ticks in a left column on a minimal %s chart',
    async (kind) => {
      const { container } = renderChart(kind, 'minimal');
      await waitFor(() => expect(yTicks(container).length).toBeGreaterThan(0));

      expect(axisLine(container, 'xAxis')).toBeNull();
      expect(axisLine(container, 'yAxis')).toBeNull();
      // The default `left` column: the labels align towards the plot, spacing.3 before it.
      const gridStart = firstGridLineX(container);
      yTicks(container).forEach((tick) => {
        expect(tick.getAttribute('text-anchor')).toBe('end');
        expect(Number(tick.getAttribute('x'))).toBe(gridStart - 8);
      });
      expect(container.querySelector('[data-blade-chart-y-labels="left"]')).not.toBeNull();
      expect(container.querySelector('[data-blade-chart-axis-style="minimal"]')).not.toBeNull();
    },
  );

  it.each(['line', 'area', 'bar'] as const)(
    'draws no axis line and puts the Y ticks inside the plot on a minimal %s chart with overlap',
    async (kind) => {
      const { container } = renderChart(kind, 'minimal', 'overlap');
      await waitFor(() => expect(yTicks(container).length).toBeGreaterThan(0));

      expect(axisLine(container, 'xAxis')).toBeNull();
      expect(axisLine(container, 'yAxis')).toBeNull();
      const tick = yTicks(container)[0];
      // Mirrored into the plot, from its left edge, with a halo.
      expect(tick.getAttribute('text-anchor')).toBe('start');
      expect(tick.getAttribute('paint-order')).toBe('stroke');
      expect(container.querySelector('[data-blade-chart-axis-style="minimal"]')).not.toBeNull();
    },
  );

  // recharts draws no axis of width 0. A minimal Y axis of width 0 lost every tick label.
  it('draws every Y tick label of a minimal overlap chart, each on its own gridline', async () => {
    const lines = renderChart('line', 'lines');
    await waitFor(() => expect(yTicks(lines.container).length).toBeGreaterThan(0));
    const linesLabels = yTicks(lines.container).map((tick) => tick.textContent);
    lines.unmount();

    const minimal = renderChart('line', 'minimal', 'overlap');
    await waitFor(() => expect(yTicks(minimal.container).length).toBeGreaterThan(0));
    const labels = yTicks(minimal.container).map((tick) => tick.textContent);

    expect(labels).toEqual(linesLabels);
    expect(labels.every((label) => Boolean(label))).toBe(true);
    const gridYs = Array.from(
      minimal.container.querySelectorAll('.recharts-cartesian-grid-horizontal line'),
    ).map((line) => Number(line.getAttribute('y1')));
    // The top of each label sits 8px (spacing.3) below its gridline. The y of the text is its
    // middle: half the 0.71em cap height of the 12px text lower.
    yTicks(minimal.container).forEach((tick) => {
      const gridY = Number(tick.getAttribute('y')) - (8 + 0.355 * 12);
      expect(gridYs.some((y) => Math.abs(y - gridY) < 0.01)).toBe(true);
    });
  });

  it('runs the gridlines the full width of a minimal overlap chart', async () => {
    const lines = renderChart('line', 'lines');
    await waitFor(() => expect(yTicks(lines.container).length).toBeGreaterThan(0));
    const linesStart = firstGridLineX(lines.container);
    lines.unmount();

    const minimal = renderChart('line', 'minimal', 'overlap');
    await waitFor(() => expect(yTicks(minimal.container).length).toBeGreaterThan(0));

    // `lines` starts the grid after the Y axis. `overlap` gives the Y axis no width.
    expect(firstGridLineX(minimal.container)).toBeLessThan(linesStart);
    expect(firstGridLineX(minimal.container)).toBe(0);
  });

  it('keeps the axis lines on a vertical bar chart', async () => {
    const { container } = renderChart('vertical-bar', 'minimal');
    await waitFor(() => expect(yTicks(container).length).toBeGreaterThan(0));

    expect(axisLine(container, 'xAxis')).not.toBeNull();
    expect(axisLine(container, 'yAxis')).not.toBeNull();
  });
});

describe('ChartTooltip formatter', () => {
  it('shows the value the formatter returns', async () => {
    const { getByText } = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartBarWrapper data={data}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip
            defaultIndex={2}
            formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
          />
          <ChartBar dataKey="sales" name="Sales" />
        </ChartBarWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText('Sales')).toBeInTheDocument());
    expect(getByText('₹1,23,450')).toBeInTheDocument();
  });

  it('shows the name from a [value, name] pair', async () => {
    const { getByText } = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartBarWrapper data={data}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip
            defaultIndex={2}
            formatter={(value) => [`${String(value)} units`, 'Units']}
          />
          <ChartBar dataKey="sales" name="Sales" />
        </ChartBarWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText('Units')).toBeInTheDocument());
    expect(getByText('123450 units')).toBeInTheDocument();
  });

  it('shows the heading that labelFormatter returns', async () => {
    const { getByText, queryByText } = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartBarWrapper data={data}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip defaultIndex={2} labelFormatter={(label) => `Month: ${String(label)}`} />
          <ChartBar dataKey="sales" name="Sales" />
        </ChartBarWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText('Month: Mar')).toBeInTheDocument());
    expect(queryByText('Mar', { selector: 'h1,h2,h3,h4,h5,h6' })).toBeNull();
  });

  it('shows the raw value with no formatter, as before', async () => {
    const { getByText } = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartBarWrapper data={data}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip defaultIndex={2} />
          <ChartBar dataKey="sales" name="Sales" />
        </ChartBarWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText('Sales')).toBeInTheDocument());
    expect(getByText('123450')).toBeInTheDocument();
  });
});
