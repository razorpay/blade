import React from 'react';
import { waitFor } from '@testing-library/react';
import { ChartXAxis, ChartYAxis, ChartCartesianGrid, ChartLegend } from '..';
import { ChartLineWrapper, ChartLine } from '../../LineChart';
import { ChartAreaWrapper, ChartArea } from '../../AreaChart';
import { ChartBarWrapper, ChartBar } from '../../BarChart';
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
  { dashed = false }: { dashed?: boolean } = {},
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
        <ChartLineWrapper data={data} {...display}>
          {common}
          <ChartLine dataKey="online" name="Online" />
          <ChartLine dataKey="offline" name="Offline" strokeStyle={dashed ? 'dashed' : 'solid'} />
        </ChartLineWrapper>
      </Box>,
    ).container;
  }
  if (kind === 'area') {
    return renderWithTheme(
      <Box width="800px" height="400px">
        <ChartAreaWrapper data={data} {...display}>
          {common}
          <ChartArea dataKey="online" name="Online" />
          <ChartArea dataKey="offline" name="Offline" />
        </ChartAreaWrapper>
      </Box>,
    ).container;
  }
  return renderWithTheme(
    <Box width="800px" height="400px">
      <ChartBarWrapper data={data} {...display}>
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
const xTicks = (container: HTMLElement): Element[] =>
  Array.from(container.querySelectorAll('.recharts-xAxis-tick-labels text'));
const gridLines = (container: HTMLElement): Element[] =>
  Array.from(container.querySelectorAll('.recharts-cartesian-grid-horizontal line'));
const yAxisLine = (container: HTMLElement): Element | null =>
  container.querySelector('.recharts-yAxis .recharts-cartesian-axis-line');
const legendWrapper = (container: HTMLElement): HTMLElement | null =>
  container.querySelector<HTMLElement>('.recharts-legend-wrapper');
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
  it('keeps the classic look with no props', () => {
    expect(resolveChartDisplayOptions({})).toEqual({
      axisStyle: 'lines',
      yAxisLine: true,
      yLabelPlacement: 'legacy',
      yGridlines: true,
      gridlineWidth: undefined,
      legendPlacement: undefined,
      labelSize: undefined,
    });
    expect(getChartMargin(resolveChartDisplayOptions({}))).toBeUndefined();
  });

  it('sets the defaults of minimal: no Y axis line, overlap labels, thinner gridlines', () => {
    expect(resolveChartDisplayOptions({ axisStyle: 'minimal' })).toMatchObject({
      yAxisLine: false,
      yLabelPlacement: 'overlap',
      gridlineWidth: 'thinner',
    });
  });

  it('lets an explicit prop win over axisStyle', () => {
    expect(
      resolveChartDisplayOptions({
        axisStyle: 'minimal',
        yAxisLine: true,
        yLabelPlacement: 'left',
        gridlineWidth: 'thin',
      }),
    ).toMatchObject({ yAxisLine: true, yLabelPlacement: 'left', gridlineWidth: 'thin' });
    expect(
      resolveChartDisplayOptions({
        axisStyle: 'lines',
        yAxisLine: false,
        gridlineWidth: 'thinner',
      }),
    ).toMatchObject({ yAxisLine: false, gridlineWidth: 'thinner' });
  });

  it('reads outside as right', () => {
    expect(resolveChartDisplayOptions({ yLabelPlacement: 'outside' }).yLabelPlacement).toBe(
      'right',
    );
  });

  it('keeps lines and the classic gutter on a vertical bar chart', () => {
    expect(
      resolveChartDisplayOptions(
        { axisStyle: 'minimal', yLabelPlacement: 'right' },
        { isVerticalBar: true },
      ),
    ).toMatchObject({ axisStyle: 'lines', yLabelPlacement: 'legacy' });
  });

  it('sets the margin on the side of a label column to 0', () => {
    expect(getChartMargin({ axisStyle: 'lines', yLabelPlacement: 'left' })).toEqual({
      top: 5,
      right: 5,
      bottom: 5,
      left: 0,
    });
    expect(getChartMargin({ axisStyle: 'lines', yLabelPlacement: 'right' })).toEqual({
      top: 5,
      right: 0,
      bottom: 5,
      left: 5,
    });
  });
});

describe.each(['line', 'area', 'bar'] as const)('display controls on a %s chart', (kind) => {
  it('looks as before with no display props', async () => {
    const container = renderChart(kind);
    await ready(container);

    expect(surface(container)).toBeNull();
    expect(yAxisLine(container)).not.toBeNull();
    // recharts' fixed 60px gutter after its 5px margin, labels aligned towards the axis.
    yTicks(container).forEach((tick) => expect(tick.getAttribute('text-anchor')).toBe('end'));
    expect(Number(gridLines(container)[0].getAttribute('x1'))).toBe(65);
    gridLines(container).forEach((line) =>
      expect(line.getAttribute('stroke-width') ?? '1').toBe('1'),
    );
    expect(yTicks(container)[0].getAttribute('font-size')).toBe('12');
    expect(legendWrapper(container)?.style.bottom).not.toBe('');
    expect(container.querySelector('[data-blade-legend-placement]')).toBeNull();
    expect(container.querySelector('[data-blade-legend-swatch]')).toBeNull();
  });

  it('hides the Y axis line with yAxisLine false, and shows it on minimal with true', async () => {
    const hidden = renderChart(kind, { yAxisLine: false });
    await ready(hidden);
    expect(yAxisLine(hidden)).toBeNull();

    const shown = renderChart(kind, { axisStyle: 'minimal', yAxisLine: true });
    await ready(shown);
    expect(yAxisLine(shown)).not.toBeNull();
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

  it.each([
    ['s' as const, '12'],
    ['m' as const, '14'],
    ['l' as const, '16'],
  ])('sizes the axis labels with labelSize %s', async (labelSize, fontSize) => {
    const container = renderChart(kind, { labelSize });
    await ready(container);
    yTicks(container).forEach((tick) => expect(tick.getAttribute('font-size')).toBe(fontSize));
    xTicks(container).forEach((tick) => expect(tick.getAttribute('font-size')).toBe(fontSize));
  });
});

describe('labelSize on the legend', () => {
  it('sizes the legend text with the axis labels', async () => {
    const medium = renderChart('line');
    await ready(medium);
    const large = renderChart('line', { labelSize: 'l' });
    await ready(large);

    const legendText = (container: HTMLElement): Element | null =>
      container.querySelector('.recharts-legend-wrapper p');
    // A different Text size gives the legend text a different class.
    expect(legendText(large)?.className).not.toBe(legendText(medium)?.className);
    expect(window.getComputedStyle(legendText(large)!).fontSize).toBe('1rem');
  });
});

describe('strokeStyle dashed on ChartLine', () => {
  it('shows a dashed line in the legend for the dashed series', async () => {
    const container = renderChart('line', {}, { dashed: true });
    await ready(container);

    const swatches = container.querySelectorAll('[data-blade-legend-swatch="dashed"]');
    expect(swatches).toHaveLength(1);
    expect(swatches[0].querySelector('line')?.getAttribute('stroke-dasharray')).toBe('5 5');
    // The solid series keeps its square swatch.
    expect(legendWrapper(container)?.querySelectorAll('span')).toHaveLength(1);
  });
});
