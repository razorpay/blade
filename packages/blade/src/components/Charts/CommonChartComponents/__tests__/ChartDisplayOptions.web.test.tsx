import React from 'react';
import { waitFor } from '@testing-library/react';
import { ChartXAxis, ChartYAxis, ChartCartesianGrid, ChartTooltip } from '..';
import { ChartLineWrapper, ChartLine } from '../../LineChart';
import { ChartBarWrapper, ChartBar } from '../../BarChart';
import { ChartDonutWrapper, ChartDonut } from '../../DonutChart';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';
import { boxesOverlap } from '../ChartSurface';

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

const monthly = [
  { month: 'Jan', amount: 40000 },
  { month: 'Feb', amount: 90000 },
  { month: 'Mar', amount: 123450 },
  { month: 'Apr', amount: 150000 },
];

const yLabels = (container: HTMLElement): string[] =>
  Array.from(
    container.querySelectorAll('.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value'),
  ).map((tick) => tick.textContent ?? '');
/** The CSS rules on the page whose selector names one of the element's classes. */
const rulesOf = (element: Element | null | undefined): string[] => {
  const classes = Array.from(element?.classList ?? []);
  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText))
    .filter((rule) => classes.some((name) => rule.split('{')[0].includes(`.${name}`)));
};
/** True when a rule on the element, for `selector` under it (or itself), sets `declaration`. */
const hasRule = (
  element: Element | null | undefined,
  declaration: string,
  selector = '',
): boolean =>
  rulesOf(element).some((rule) => {
    const [head, body] = rule.split('{');
    return head.includes(selector) && body.includes(declaration);
  });

describe('valueFormat', () => {
  it('writes compact en-IN ticks and full tooltip values', async () => {
    const { container, getByText } = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartBarWrapper data={monthly} valueFormat={{ type: 'currency', currency: 'INR' }}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip defaultIndex={2} />
          <ChartBar dataKey="amount" name="Collected" />
        </ChartBarWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText('Collected')).toBeInTheDocument());
    expect(getByText('₹1,23,450.00')).toBeInTheDocument();
    expect(yLabels(container)).toEqual(['₹0', '₹40K', '₹80K', '₹1.2L', '₹1.6L']);
  });

  it.each([
    [{ type: 'count' as const }, '1,23,450', '1.2L'],
    [{ type: 'percent' as const }, '1,23,450.0%', '1,20,000%'],
  ])('writes %p values in full in the tooltip', async (valueFormat, full, tick) => {
    const { container, getByText } = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartLineWrapper data={monthly} valueFormat={valueFormat}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip defaultIndex={2} />
          <ChartLine dataKey="amount" name="Value" />
        </ChartLineWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText(full)).toBeInTheDocument());
    expect(yLabels(container)).toContain(tick);
  });

  it('formats the donut tooltip', async () => {
    const { getByText } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper valueFormat={{ type: 'currency' }}>
          <ChartDonut
            dataKey="amount"
            nameKey="month"
            data={monthly}
            radius="medium"
            type="circle"
          />
          <ChartTooltip defaultIndex={2} />
        </ChartDonutWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText('₹1,23,450.00')).toBeInTheDocument());
  });

  it('lets the axis and the tooltip keep their own formatters', async () => {
    const { container, getByText } = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartBarWrapper data={monthly} valueFormat={{ type: 'currency' }}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis tickFormatter={(value: number) => `${value / 1000}k`} />
          <ChartTooltip defaultIndex={2} formatter={(value) => `${String(value)} raw`} />
          <ChartBar dataKey="amount" name="Collected" />
        </ChartBarWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText('123450 raw')).toBeInTheDocument());
    expect(yLabels(container)).toContain('120k');
  });

  it('keeps raw values by default, as before', async () => {
    const { container, getByText } = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartBarWrapper data={monthly}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip defaultIndex={2} />
          <ChartBar dataKey="amount" name="Collected" />
        </ChartBarWrapper>
      </Box>,
    );

    await waitFor(() => expect(getByText('123450')).toBeInTheDocument());
    expect(yLabels(container)).toContain('120000');
  });
});

describe('minimal axis polish', () => {
  const plotHeight = (container: HTMLElement): number =>
    Number(container.querySelector('clipPath rect')?.getAttribute('height'));

  const render = (
    axisStyle: 'lines' | 'minimal',
    label?: string,
    yLabelPlacement?: 'overlap',
  ): HTMLElement =>
    renderWithTheme(
      <Box width="800px" height="400px">
        <ChartLineWrapper data={monthly} axisStyle={axisStyle} yLabelPlacement={yLabelPlacement}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" label={label} />
          <ChartYAxis />
          <ChartLine dataKey="amount" />
        </ChartLineWrapper>
      </Box>,
    ).container;

  it('keeps no space under the X labels when there is no X label', async () => {
    const lines = render('lines');
    await waitFor(() => expect(yLabels(lines).length).toBeGreaterThan(0));
    const minimal = render('minimal');
    await waitFor(() => expect(yLabels(minimal).length).toBeGreaterThan(0));

    // 24px kept for an axis label and the 5px bottom margin come back to the plot.
    expect(plotHeight(minimal) - plotHeight(lines)).toBe(24 + 5);
  });

  it('keeps the space for an X label that is there', async () => {
    const lines = render('lines', 'Month');
    await waitFor(() => expect(yLabels(lines).length).toBeGreaterThan(0));
    const minimal = render('minimal', 'Month');
    await waitFor(() => expect(yLabels(minimal).length).toBeGreaterThan(0));

    expect(plotHeight(minimal) - plotHeight(lines)).toBe(5);
  });

  it('starts overlap Y labels at the left edge of the chart, under their gridlines, with a halo', async () => {
    const container = render('minimal', undefined, 'overlap');
    await waitFor(() => expect(yLabels(container).length).toBeGreaterThan(0));
    const surface = container.querySelector<HTMLElement>('[data-blade-chart-axis-style]');
    const ticks = Array.from(
      container.querySelectorAll('.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value'),
    );
    const gridYs = Array.from(
      container.querySelectorAll('.recharts-cartesian-grid-horizontal line'),
    ).map((line) => Number(line.getAttribute('y1')));

    ticks.forEach((tick) => {
      // The left edge of the chart: where a title above it starts.
      expect(Number(tick.getAttribute('x'))).toBe(0);
      // Its top 8px (spacing.3) below its gridline. The y of the text is its middle: half the
      // 0.71em cap height of the 12px text lower.
      const gridY = Number(tick.getAttribute('y')) - (8 + 0.355 * 12);
      expect(gridYs.some((y) => Math.abs(y - gridY) < 0.01)).toBe(true);
      expect(tick.getAttribute('paint-order')).toBe('stroke');
      expect(tick.getAttribute('stroke-width')).toBe('2');
    });
    // The gridlines start at the same edge.
    expect(
      Math.min(
        ...Array.from(
          container.querySelectorAll('.recharts-cartesian-grid-horizontal line'),
        ).map((line) => Number(line.getAttribute('x1'))),
      ),
    ).toBe(0);
    expect(hasRule(surface, 'display: none', '.recharts-yAxis-tick-labels > g:first-of-type')).toBe(
      true,
    );
    expect(hasRule(surface, 'overflow: visible', '.recharts-surface')).toBe(true);
  });
});

describe('minimal gridlines', () => {
  const render = (axisStyle: 'lines' | 'minimal'): HTMLElement =>
    renderWithTheme(
      <Box width="800px" height="400px">
        <ChartLineWrapper data={monthly} axisStyle={axisStyle}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartLine dataKey="amount" />
        </ChartLineWrapper>
      </Box>,
    ).container;
  const strokeWidths = (container: HTMLElement): (string | null)[] =>
    Array.from(container.querySelectorAll('.recharts-cartesian-grid-horizontal line')).map((line) =>
      line.getAttribute('stroke-width'),
    );

  it('draws 0.5px gridlines with minimal', async () => {
    const container = render('minimal');
    await waitFor(() => expect(yLabels(container).length).toBeGreaterThan(0));
    expect(strokeWidths(container).length).toBeGreaterThan(0);
    strokeWidths(container).forEach((width) => expect(width).toBe('0.5'));
  });

  it('keeps the gridlines as before with lines', async () => {
    const container = render('lines');
    await waitFor(() => expect(yLabels(container).length).toBeGreaterThan(0));
    strokeWidths(container).forEach((width) => expect(width).not.toBe('0.5'));
  });
});

describe('minimal yLabelPlacement="outside"', () => {
  const render = (): HTMLElement =>
    renderWithTheme(
      <Box width="800px" height="400px">
        <ChartLineWrapper data={monthly} axisStyle="minimal" yLabelPlacement="outside">
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartLine dataKey="amount" />
        </ChartLineWrapper>
      </Box>,
    ).container;

  it('puts the Y labels in a column right of the plot, each centred on its gridline', async () => {
    const container = render();
    await waitFor(() => expect(yLabels(container).length).toBeGreaterThan(0));
    const surface = container.querySelector<HTMLElement>('[data-blade-chart-y-labels]');
    // `outside` is an alias of `right`.
    expect(surface?.getAttribute('data-blade-chart-y-labels')).toBe('right');
    const ticks = Array.from(
      container.querySelectorAll('.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value'),
    );
    const gridLines = Array.from(
      container.querySelectorAll('.recharts-cartesian-grid-horizontal line'),
    );
    const gridYs = gridLines.map((line) => Number(line.getAttribute('y1')));
    const gridEnd = Math.max(...gridLines.map((line) => Number(line.getAttribute('x2'))));

    ticks.forEach((tick) => {
      // Centred on its gridline: no shift down.
      expect(gridYs).toContain(Number(tick.getAttribute('y')));
      // Left-aligned in the column, 8px (spacing.3) past the end of the gridlines.
      expect(tick.getAttribute('text-anchor')).toBe('start');
      expect(Number(tick.getAttribute('x'))).toBe(gridEnd + 8);
      // No halo: nothing overlaps the column.
      expect(tick.getAttribute('paint-order')).toBeNull();
    });
  });

  it('shows the bottom label, and hides it only when it meets an X label', async () => {
    const container = render();
    await waitFor(() => expect(yLabels(container).length).toBeGreaterThan(0));
    const surface = container.querySelector<HTMLElement>('[data-blade-chart-axis-style]');
    expect(yLabels(container)).toContain('0');
    expect(hasRule(surface, 'display: none', '.recharts-yAxis-tick-labels > g:first-of-type')).toBe(
      false,
    );
    expect(
      hasRule(surface, 'visibility: hidden', '.recharts-yAxis-tick-labels > g[data-blade-y-label'),
    ).toBe(true);
  });
});

describe('boxesOverlap', () => {
  it('is true for boxes that share area, and false for boxes that only touch', () => {
    const a = { left: 0, right: 10, top: 0, bottom: 10 };
    expect(boxesOverlap(a, { left: 5, right: 15, top: 5, bottom: 15 })).toBe(true);
    expect(boxesOverlap(a, { left: 10, right: 20, top: 0, bottom: 10 })).toBe(false);
    expect(boxesOverlap(a, { left: 0, right: 10, top: 11, bottom: 20 })).toBe(false);
  });
});
