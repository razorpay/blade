import React from 'react';
import { waitFor } from '@testing-library/react';
import { ChartXAxis, ChartYAxis, ChartCartesianGrid, ChartLegend } from '..';
import { ChartLineWrapper, ChartLine } from '../../LineChart';
import { ChartAreaWrapper, ChartArea } from '../../AreaChart';
import { ChartBarWrapper, ChartBar } from '../../BarChart';
import { ChartDonutWrapper, ChartDonut } from '../../DonutChart';
import { border } from '~tokens/global';
import { bladeTheme, bladeNeutralTheme, createTheme } from '~tokens/theme';
import type { ChartWrapperDisplayProps } from '../types';
import { getChartMargin, resolveChartDisplayOptions } from '../chartDisplayOptions';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

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

const data = [
  { month: 'Jan', online: 4000, offline: 2400 },
  { month: 'Feb', online: 3000, offline: 1398 },
  { month: 'Mar', online: 9800, offline: 2000 },
  { month: 'Apr', online: 3908, offline: 2780 },
];

type Kind = 'line' | 'area' | 'bar';

const renderChart = (
  kind: Kind,
  display: ChartWrapperDisplayProps = {},
  { strokeStyle = 'solid' }: { strokeStyle?: 'solid' | 'dashed' | 'dotted' } = {},
  version: 'v1' | 'v2' = 'v2',
): HTMLElement => {
  // An array, not a fragment: the wrappers read their direct children.
  const common = [
    <ChartCartesianGrid key="grid" />,
    <ChartXAxis key="x" dataKey="month" />,
    <ChartYAxis key="y" />,
    <ChartLegend key="legend" />,
  ];
  if (kind === 'line') {
    return renderWithTheme(
      <Box width="800px" height="400px">
        <ChartLineWrapper data={data} version={version} {...display}>
          {common}
          <ChartLine dataKey="online" name="Online" />
          <ChartLine dataKey="offline" name="Offline" strokeStyle={strokeStyle} />
        </ChartLineWrapper>
      </Box>,
    ).container;
  }
  if (kind === 'area') {
    return renderWithTheme(
      <Box width="800px" height="400px">
        <ChartAreaWrapper data={data} version={version} {...display}>
          {common}
          <ChartArea dataKey="online" name="Online" />
          <ChartArea dataKey="offline" name="Offline" />
        </ChartAreaWrapper>
      </Box>,
    ).container;
  }
  return renderWithTheme(
    <Box width="800px" height="400px">
      <ChartBarWrapper data={data} version={version} {...display}>
        {common}
        <ChartBar dataKey="online" name="Online" />
        <ChartBar dataKey="offline" name="Offline" />
      </ChartBarWrapper>
    </Box>,
  ).container;
};

const yTicks = (container: HTMLElement): Element[] =>
  Array.from(
    container.querySelectorAll('.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value'),
  );
const gridLines = (container: HTMLElement): Element[] =>
  Array.from(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'));
const yAxisLine = (container: HTMLElement): Element | null =>
  container.querySelector('.recharts-yAxis .recharts-cartesian-axis-line');
const frameLine = (container: HTMLElement): Element | null =>
  container.querySelector('[data-blade-y-axis-frame-line]');
const legendWrapper = (container: HTMLElement): HTMLElement | null =>
  container.querySelector<HTMLElement>('.recharts-legend-wrapper');
const legendSwatches = (container: HTMLElement, style: string): Element[] =>
  Array.from(
    legendWrapper(container)?.querySelectorAll(`[data-blade-legend-swatch="${style}"]`) ?? [],
  );
const surface = (container: HTMLElement): HTMLElement | null =>
  container.querySelector<HTMLElement>('[data-blade-chart-y-labels]');

const ready = async (container: HTMLElement): Promise<void> => {
  await waitFor(() => expect(yTicks(container).length).toBeGreaterThan(0));
  await waitFor(() => expect(legendWrapper(container)?.textContent).toContain('Online'));
};

/** True when a CSS rule on the page, for a selector under the element's class, sets `declaration`. */
const hasRule = (element: Element | null, declaration: string, selector: string): boolean => {
  const classes = Array.from(element?.classList ?? []);
  return Array.from(document.styleSheets)
    .flatMap((sheet) => Array.from(sheet.cssRules).map((rule) => rule.cssText))
    .some((rule) => {
      const [head, body] = rule.split('{');
      return (
        classes.some((name) => head.includes(`.${name}`)) &&
        head.includes(selector) &&
        body.includes(declaration)
      );
    });
};

describe('resolveChartDisplayOptions', () => {
  const v2 = (props: ChartWrapperDisplayProps, options?: { isVerticalBar?: boolean }) =>
    resolveChartDisplayOptions({ version: 'v2', ...props }, options);

  it('ignores every display prop with v1, the default, and keeps the recharts margin', () => {
    const v1 = resolveChartDisplayOptions({
      axisStyle: 'minimal',
      yAxisLine: false,
      yLabelPlacement: 'overlap',
      yGridlines: false,
      gridlineWidth: 'thinner',
      legendPlacement: 'top',
    });
    expect(v1).toEqual({
      chartVersion: 'v1',
      axisStyle: 'lines',
      yAxisLine: true,
      yLabelPlacement: 'left',
      yGridlines: true,
    });
    expect(getChartMargin(v1)).toBeUndefined();
  });

  it('puts the Y labels in a left column with v2 and no other props, with no margin', () => {
    expect(v2({})).toEqual({
      chartVersion: 'v2',
      axisStyle: 'lines',
      yAxisLine: true,
      yLabelPlacement: 'left',
      yGridlines: true,
      gridlineWidth: undefined,
      legendPlacement: undefined,
    });
    expect(getChartMargin(v2({}))).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    expect(getChartMargin(v2({ axisStyle: 'minimal' }))).toEqual(getChartMargin(v2({})));
  });

  it('sets the defaults of minimal: no Y axis line, left labels, thinner gridlines', () => {
    expect(v2({ axisStyle: 'minimal' })).toMatchObject({
      yAxisLine: false,
      yLabelPlacement: 'left',
      gridlineWidth: 'thinner',
    });
  });

  it('keeps overlap as an explicit option', () => {
    expect(v2({ axisStyle: 'minimal', yLabelPlacement: 'overlap' }).yLabelPlacement).toBe(
      'overlap',
    );
    expect(v2({ axisStyle: 'lines', yLabelPlacement: 'overlap' }).yLabelPlacement).toBe('overlap');
  });

  it('lets an explicit prop win over axisStyle', () => {
    expect(
      v2({ axisStyle: 'minimal', yAxisLine: true, yLabelPlacement: 'left', gridlineWidth: 'thin' }),
    ).toMatchObject({ yAxisLine: true, yLabelPlacement: 'left', gridlineWidth: 'thin' });
    expect(v2({ axisStyle: 'lines', yAxisLine: false, gridlineWidth: 'thinner' })).toMatchObject({
      yAxisLine: false,
      gridlineWidth: 'thinner',
    });
  });

  it('reads outside as right', () => {
    expect(v2({ yLabelPlacement: 'outside' }).yLabelPlacement).toBe('right');
  });

  it('keeps lines and a left column on a vertical bar chart', () => {
    expect(
      v2({ axisStyle: 'minimal', yLabelPlacement: 'right' }, { isVerticalBar: true }),
    ).toMatchObject({ axisStyle: 'lines', yLabelPlacement: 'left' });
    expect(v2({ yLabelPlacement: 'overlap' }, { isVerticalBar: true }).yLabelPlacement).toBe(
      'left',
    );
  });
});

describe('a display prop on a v1 chart', () => {
  it('warns in development, and does nothing', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const container = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartLineWrapper data={data} axisStyle="minimal" legendPlacement="top">
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartLegend />
          <ChartLine dataKey="online" name="Online" />
        </ChartLineWrapper>
      </Box>,
    ).container;
    await ready(container);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('axisStyle, legendPlacement has no effect with version="v1"'),
    );
    expect(surface(container)).toBeNull();
    expect(container.querySelector('[data-blade-legend-placement]')).toBeNull();
    // recharts' fixed 60px Y axis after its 5px margin, as on master.
    expect(Number(yAxisLine(container)?.getAttribute('x1'))).toBe(65);
    warn.mockRestore();
  });

  it('does not warn with no display prop', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const container = renderChart('line', {}, {}, 'v1');
    await ready(container);
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('has no effect'));
    warn.mockRestore();
  });
});

describe.each(['line', 'area', 'bar'] as const)('display controls on a %s chart', (kind) => {
  it('puts the Y labels in a left column with no display props, and no fixed gutter', async () => {
    const container = renderChart(kind);
    await ready(container);

    expect(surface(container)?.getAttribute('data-blade-chart-y-labels')).toBe('left');
    expect(yAxisLine(container)).not.toBeNull();
    // The column starts at the content edge. Labels align towards the axis, spacing.3 before it.
    const gridStart = Math.min(...gridLines(container).map((l) => Number(l.getAttribute('x1'))));
    yTicks(container).forEach((tick) => {
      expect(tick.getAttribute('text-anchor')).toBe('end');
      expect(Number(tick.getAttribute('x'))).toBe(gridStart - 8);
    });
    // jsdom measures no text, so the column is the 8px gap only. Not the old 5px + 60px.
    expect(gridStart).toBe(8);
    gridLines(container).forEach((line) =>
      expect(line.getAttribute('stroke-width') ?? '1').toBe('1'),
    );
    expect(yTicks(container)[0].getAttribute('font-size')).toBe('12');
    expect(legendWrapper(container)?.style.bottom).not.toBe('');
    expect(container.querySelector('[data-blade-legend-placement]')).toBeNull();
  });

  it('frames the plot with a Y axis line on both sides when yAxisLine is on', async () => {
    const container = renderChart(kind);
    await ready(container);

    const axis = yAxisLine(container);
    const frame = frameLine(container);
    expect(axis).not.toBeNull();
    expect(frame?.getAttribute('data-blade-y-axis-frame-line')).toBe('right');
    const gridEnd = Math.max(...gridLines(container).map((l) => Number(l.getAttribute('x2'))));
    expect(Number(frame?.getAttribute('x1'))).toBe(gridEnd);
    expect(Number(frame?.getAttribute('x2'))).toBe(gridEnd);
    // The same colour, width and height as the axis line.
    expect(frame?.getAttribute('stroke')).toBe(axis?.getAttribute('stroke'));
    expect(frame?.getAttribute('stroke-width')).toBe('1');
    expect(frame?.getAttribute('y1')).toBe(axis?.getAttribute('y1'));
    expect(frame?.getAttribute('y2')).toBe(axis?.getAttribute('y2'));
  });

  it('puts the second Y axis line on the left with yLabelPlacement right', async () => {
    const container = renderChart(kind, { yLabelPlacement: 'right' });
    await ready(container);
    const gridStart = Math.min(...gridLines(container).map((l) => Number(l.getAttribute('x1'))));
    expect(frameLine(container)?.getAttribute('data-blade-y-axis-frame-line')).toBe('left');
    expect(Number(frameLine(container)?.getAttribute('x1'))).toBe(gridStart);
  });

  it('draws neither Y axis line with yAxisLine false, and both on minimal with true', async () => {
    const hidden = renderChart(kind, { yAxisLine: false });
    await ready(hidden);
    expect(yAxisLine(hidden)).toBeNull();
    expect(frameLine(hidden)).toBeNull();

    const minimal = renderChart(kind, { axisStyle: 'minimal' });
    await ready(minimal);
    expect(yAxisLine(minimal)).toBeNull();
    expect(frameLine(minimal)).toBeNull();

    const shown = renderChart(kind, { axisStyle: 'minimal', yAxisLine: true });
    await ready(shown);
    expect(yAxisLine(shown)).not.toBeNull();
    expect(frameLine(shown)).not.toBeNull();
  });

  it('puts the Y labels in a column left of the plot with yLabelPlacement left', async () => {
    const container = renderChart(kind, { yLabelPlacement: 'left' });
    await ready(container);

    expect(surface(container)?.getAttribute('data-blade-chart-y-labels')).toBe('left');
    const gridStart = Math.min(...gridLines(container).map((l) => Number(l.getAttribute('x1'))));
    yTicks(container).forEach((tick) => {
      // Aligned towards the axis, spacing.3 before the plot.
      expect(tick.getAttribute('text-anchor')).toBe('end');
      expect(Number(tick.getAttribute('x'))).toBe(gridStart - 8);
    });
    expect(hasRule(surface(container), 'font-variant-numeric: tabular-nums', 'tick-value')).toBe(
      true,
    );
  });

  it('puts the Y labels in a column right of the plot with yLabelPlacement right', async () => {
    const container = renderChart(kind, { yLabelPlacement: 'right' });
    await ready(container);

    expect(surface(container)?.getAttribute('data-blade-chart-y-labels')).toBe('right');
    const gridEnd = Math.max(...gridLines(container).map((l) => Number(l.getAttribute('x2'))));
    const gridYs = gridLines(container).map((l) => Number(l.getAttribute('y1')));
    yTicks(container).forEach((tick) => {
      expect(tick.getAttribute('text-anchor')).toBe('start');
      expect(Number(tick.getAttribute('x'))).toBe(gridEnd + 8);
      expect(gridYs).toContain(Number(tick.getAttribute('y')));
    });
    expect(hasRule(surface(container), 'font-variant-numeric: tabular-nums', 'tick-value')).toBe(
      true,
    );
  });

  it('puts the Y labels inside the plot, with a halo, with yLabelPlacement overlap', async () => {
    const container = renderChart(kind, { yLabelPlacement: 'overlap' });
    await ready(container);

    expect(surface(container)?.getAttribute('data-blade-chart-y-labels')).toBe('overlap');
    yTicks(container).forEach((tick) => {
      expect(tick.getAttribute('text-anchor')).toBe('start');
      expect(tick.getAttribute('paint-order')).toBe('stroke');
    });
  });

  it('hides the horizontal gridlines with yGridlines false', async () => {
    const container = renderChart(kind, { yGridlines: false });
    await ready(container);
    expect(gridLines(container)).toHaveLength(0);
  });

  it.each([
    [{ gridlineWidth: 'thinner' as const }, '0.5'],
    [{ gridlineWidth: 'thin' as const }, '1'],
    [{ axisStyle: 'minimal' as const }, '0.5'],
    [{ axisStyle: 'minimal' as const, gridlineWidth: 'thin' as const }, '1'],
  ])('draws the gridlines of %p at %spx', async (display, width) => {
    const container = renderChart(kind, display);
    await ready(container);
    gridLines(container).forEach((line) => expect(line.getAttribute('stroke-width')).toBe(width));
  });

  it('puts the legend on top, left-aligned, with legendPlacement top', async () => {
    const container = renderChart(kind, { legendPlacement: 'top' });
    await ready(container);

    const wrapper = legendWrapper(container);
    expect(wrapper?.style.top).not.toBe('');
    expect(wrapper?.style.bottom).toBe('');
    expect(wrapper?.style.left).toBe('0px');
    expect(container.querySelector('[data-blade-legend-placement="top"]')).not.toBeNull();
  });
});

describe('horizontal bar chart (layout vertical)', () => {
  const categoryData = [
    { method: 'UPI', amount: 98000 },
    { method: 'Payment links', amount: 18000 },
  ];
  const renderHorizontalBar = (display: ChartWrapperDisplayProps = {}): HTMLElement =>
    renderWithTheme(
      <Box width="800px" height="400px">
        <ChartBarWrapper data={categoryData} layout="vertical" version="v2" {...display}>
          <ChartXAxis type="number" />
          <ChartYAxis type="category" dataKey="method" />
          <ChartLegend />
          <ChartBar dataKey="amount" name="Online" />
        </ChartBarWrapper>
      </Box>,
    ).container;
  const axisLineX = (container: HTMLElement): number =>
    Number(yAxisLine(container)?.getAttribute('x1'));

  it.each([
    {},
    { axisStyle: 'minimal' as const },
    { yLabelPlacement: 'right' as const },
    { yLabelPlacement: 'overlap' as const },
  ])('puts the category names in a tight left column with %p', async (display) => {
    const container = renderHorizontalBar(display);
    await ready(container);

    expect(surface(container)?.getAttribute('data-blade-chart-y-labels')).toBe('left');
    expect(yTicks(container).map((tick) => tick.textContent)).toEqual(['UPI', 'Payment links']);
    yTicks(container).forEach((tick) => {
      expect(tick.getAttribute('text-anchor')).toBe('end');
      expect(Number(tick.getAttribute('x'))).toBe(axisLineX(container) - 8);
    });
    // No fixed gutter: jsdom measures no text, so the column is the 8px gap only.
    expect(axisLineX(container)).toBe(8);
  });

  it('frames the bars with a Y axis line on both sides', async () => {
    const container = renderHorizontalBar();
    await ready(container);
    expect(yAxisLine(container)).not.toBeNull();
    expect(frameLine(container)?.getAttribute('data-blade-y-axis-frame-line')).toBe('right');
  });
});

describe('legend swatch follows the mark', () => {
  it.each(['dashed', 'dotted'] as const)(
    'shows a line swatch for each series of a line chart, %s for the %s series',
    async (strokeStyle) => {
      const container = renderChart('line', {}, { strokeStyle });
      await ready(container);

      const solid = legendSwatches(container, 'solid');
      const styled = legendSwatches(container, strokeStyle);
      expect(solid).toHaveLength(1);
      expect(styled).toHaveLength(1);
      expect(solid[0].querySelector('line')?.getAttribute('stroke-dasharray')).toBeNull();
      expect(styled[0].querySelector('line')?.getAttribute('stroke-dasharray')).toBe(
        border.dash[strokeStyle].join(' '),
      );
      // No square swatch in a line chart.
      expect(legendWrapper(container)?.querySelectorAll('span')).toHaveLength(0);
    },
  );

  it('shows two solid line swatches when both lines are solid', async () => {
    const container = renderChart('line');
    await ready(container);
    expect(legendSwatches(container, 'solid')).toHaveLength(2);
  });

  it.each(['area', 'bar'] as const)('keeps square swatches on a %s chart', async (kind) => {
    const container = renderChart(kind);
    await ready(container);
    expect(legendWrapper(container)?.querySelectorAll('[data-blade-legend-swatch]')).toHaveLength(
      0,
    );
    expect(legendWrapper(container)?.querySelectorAll('span')).toHaveLength(2);
  });
});

describe('legend controls on a donut chart', () => {
  const donutData = [
    { name: 'UPI', value: 52000 },
    { name: 'Cards', value: 24000 },
  ];
  const renderDonut = (props: { legendPlacement?: 'top' | 'bottom' } = {}): HTMLElement =>
    renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper version="v2" {...props}>
          <ChartDonut dataKey="value" nameKey="name" data={donutData} />
          <ChartLegend />
        </ChartDonutWrapper>
      </Box>,
    ).container;
  const legendText = (container: HTMLElement): Element | null =>
    container.querySelector('.recharts-legend-wrapper p');

  it('keeps the legend at the bottom, centred, with no props', async () => {
    const container = renderDonut();
    await waitFor(() => expect(legendText(container)).not.toBeNull());
    expect(legendWrapper(container)?.style.bottom).not.toBe('');
    expect(container.querySelector('[data-blade-legend-placement]')).toBeNull();
    expect(window.getComputedStyle(legendText(container)!).fontSize).toBe('0.875rem');
  });

  it('puts the legend on top, left-aligned, with legendPlacement top', async () => {
    const container = renderDonut({ legendPlacement: 'top' });
    await waitFor(() => expect(legendText(container)).not.toBeNull());
    expect(legendWrapper(container)?.style.top).not.toBe('');
    expect(legendWrapper(container)?.style.left).toBe('0px');
    expect(container.querySelector('[data-blade-legend-placement="top"]')).not.toBeNull();
  });

  it('keeps square swatches', async () => {
    const container = renderDonut();
    await waitFor(() => expect(legendText(container)).not.toBeNull());
    expect(legendWrapper(container)?.querySelectorAll('[data-blade-legend-swatch]')).toHaveLength(
      0,
    );
    expect(legendWrapper(container)?.querySelectorAll('span')).toHaveLength(2);
  });
});

describe('border.dash token', () => {
  it('holds the dashed and dotted patterns, in every theme', () => {
    expect(border.dash).toEqual({ dashed: [5, 5], dotted: [2, 2] });
    expect(bladeTheme.border.dash).toEqual(border.dash);
    expect(bladeNeutralTheme.border.dash).toEqual(border.dash);
    expect(createTheme({ brandColor: '#83003D' }).theme.border.dash).toEqual(border.dash);
  });

  it('sets the dash of a dashed ChartLine and its legend swatch', async () => {
    const container = renderChart('line', {}, { strokeStyle: 'dashed' });
    await ready(container);
    const swatch = container.querySelector('[data-blade-legend-swatch="dashed"] line');
    expect(swatch?.getAttribute('stroke-dasharray')).toBe(border.dash.dashed.join(' '));
  });
});
