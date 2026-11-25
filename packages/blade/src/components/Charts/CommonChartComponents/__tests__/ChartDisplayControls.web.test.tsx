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
const xAxisLine = (container: HTMLElement): Element | null =>
  container.querySelector('.recharts-xAxis .recharts-cartesian-axis-line');
const borderLine = (container: HTMLElement, side: 'left' | 'right' | 'bottom'): Element | null =>
  container.querySelector(`[data-blade-chart-plot-border-side="${side}"]`);

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
  const v2 = (
    props: ChartWrapperDisplayProps,
    options?: { isVerticalBar?: boolean },
  ): ReturnType<typeof resolveChartDisplayOptions> =>
    resolveChartDisplayOptions({ version: 'v2', ...props }, options);

  it('ignores every display prop with v1, the default, and keeps the recharts margin', () => {
    const v1 = resolveChartDisplayOptions({
      showBorder: true,
      yLabelPlacement: 'overlap',
      yGridlines: false,
      gridlineWidth: 'thin',
      legendPlacement: 'top',
    });
    expect(v1).toEqual({
      chartVersion: 'v1',
      showBorder: false,
      isVerticalBar: false,
      yLabelPlacement: 'left',
      yGridlines: true,
    });
    expect(getChartMargin(v1)).toBeUndefined();
  });

  it('has no border, left labels and thinner gridlines with v2 and no other props', () => {
    expect(v2({})).toEqual({
      chartVersion: 'v2',
      showBorder: false,
      isVerticalBar: false,
      yLabelPlacement: 'left',
      yGridlines: true,
      gridlineWidth: 'thinner',
      legendPlacement: undefined,
    });
    expect(getChartMargin(v2({}))).toEqual({ top: 0, right: 0, bottom: 0, left: 0 });
    expect(getChartMargin(v2({ showBorder: true }))).toEqual(getChartMargin(v2({})));
  });

  it('keeps an explicit prop', () => {
    expect(
      v2({ showBorder: true, gridlineWidth: 'thin', yLabelPlacement: 'right' }),
    ).toMatchObject({ showBorder: true, gridlineWidth: 'thin', yLabelPlacement: 'right' });
    expect(v2({ yLabelPlacement: 'overlap' }).yLabelPlacement).toBe('overlap');
  });

  it('shows overlap as left with a border', () => {
    expect(v2({ showBorder: true, yLabelPlacement: 'overlap' }).yLabelPlacement).toBe('left');
    expect(v2({ showBorder: false, yLabelPlacement: 'overlap' }).yLabelPlacement).toBe('overlap');
  });

  it('reads outside as right', () => {
    expect(v2({ yLabelPlacement: 'outside' }).yLabelPlacement).toBe('right');
    expect(v2({ showBorder: true, yLabelPlacement: 'outside' }).yLabelPlacement).toBe('right');
  });

  it('keeps a left column on a vertical bar chart, and takes its border', () => {
    expect(v2({ yLabelPlacement: 'right' }, { isVerticalBar: true })).toMatchObject({
      yLabelPlacement: 'left',
      isVerticalBar: true,
      showBorder: false,
    });
    expect(v2({ yLabelPlacement: 'overlap' }, { isVerticalBar: true }).yLabelPlacement).toBe(
      'left',
    );
    expect(v2({ showBorder: true }, { isVerticalBar: true }).showBorder).toBe(true);
  });
});

describe('a display prop on a v1 chart', () => {
  it('warns in development, and does nothing', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const container = renderWithTheme(
      <Box width="800px" height="400px">
        <ChartLineWrapper data={data} showBorder legendPlacement="top">
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartLegend />
          <ChartLine dataKey="online" name="Online" />
        </ChartLineWrapper>
      </Box>,
    ).container;
    await ready(container);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('showBorder, legendPlacement has no effect with version="v1"'),
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
    // The column starts at the content edge. Labels align towards the axis, spacing.3 before it.
    const gridStart = Math.min(...gridLines(container).map((l) => Number(l.getAttribute('x1'))));
    yTicks(container).forEach((tick) => {
      expect(tick.getAttribute('text-anchor')).toBe('end');
      expect(Number(tick.getAttribute('x'))).toBe(gridStart - 8);
    });
    // jsdom measures no text, so the column is the 8px gap only. Not the old 5px + 60px.
    expect(gridStart).toBe(8);
    // thinner gridlines by default.
    gridLines(container).forEach((line) => expect(line.getAttribute('stroke-width')).toBe('0.5'));
    expect(yTicks(container)[0].getAttribute('font-size')).toBe('12');
    expect(legendWrapper(container)?.style.bottom).not.toBe('');
    expect(container.querySelector('[data-blade-legend-placement]')).toBeNull();
  });

  it('has no border and no axis line by default: the bottom gridline is the baseline', async () => {
    const container = renderChart(kind);
    await ready(container);

    expect(yAxisLine(container)).toBeNull();
    expect(xAxisLine(container)).toBeNull();
    expect(container.querySelector('[data-blade-chart-plot-border]')).toBeNull();
    expect(surface(container)?.hasAttribute('data-blade-chart-border')).toBe(false);
    const gridYs = gridLines(container).map((l) => Number(l.getAttribute('y1')));
    const plotBottom = Math.max(...gridYs);
    expect(gridYs.filter((y) => y === plotBottom)).toHaveLength(1);
  });

  it('draws the border on the left, the right and the bottom, each once, with showBorder', async () => {
    const container = renderChart(kind, { showBorder: true });
    await ready(container);

    expect(yAxisLine(container)).toBeNull();
    expect(xAxisLine(container)).toBeNull();
    expect(surface(container)?.getAttribute('data-blade-chart-border')).toBe('true');
    const left = borderLine(container, 'left');
    const right = borderLine(container, 'right');
    const bottom = borderLine(container, 'bottom');
    const lines = gridLines(container);
    const gridStart = Math.min(...lines.map((l) => Number(l.getAttribute('x1'))));
    const gridEnd = Math.max(...lines.map((l) => Number(l.getAttribute('x2'))));
    expect(Number(left?.getAttribute('x1'))).toBe(gridStart);
    expect(Number(right?.getAttribute('x1'))).toBe(gridEnd);
    expect(Number(bottom?.getAttribute('x1'))).toBe(gridStart);
    expect(Number(bottom?.getAttribute('x2'))).toBe(gridEnd);
    // The gridline at the base is left out, so the bottom line is drawn once.
    const baseY = Number(bottom?.getAttribute('y1'));
    lines.forEach((line) => expect(Number(line.getAttribute('y1'))).toBeLessThan(baseY));
    // The colour and the width of the gridlines.
    [left, right, bottom].forEach((line) => {
      expect(line?.getAttribute('stroke')).toBe(lines[0].getAttribute('stroke'));
      expect(line?.getAttribute('stroke-width')).toBe('0.5');
    });
  });

  it('draws the border at the gridline width, and with no gridlines', async () => {
    const thin = renderChart(kind, { showBorder: true, gridlineWidth: 'thin' });
    await ready(thin);
    expect(borderLine(thin, 'bottom')?.getAttribute('stroke-width')).toBe('1');

    const noGrid = renderChart(kind, { showBorder: true, yGridlines: false });
    await ready(noGrid);
    expect(gridLines(noGrid)).toHaveLength(0);
    expect(borderLine(noGrid, 'bottom')).not.toBeNull();
  });

  it('puts the Y labels in a left column with overlap and a border', async () => {
    const container = renderChart(kind, { showBorder: true, yLabelPlacement: 'overlap' });
    await ready(container);
    expect(surface(container)?.getAttribute('data-blade-chart-y-labels')).toBe('left');
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
    [{}, '0.5'],
    [{ showBorder: true, gridlineWidth: 'thin' as const }, '1'],
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
    // spacing.5, plus the part of the top Y label above the top gridline: ceil(0.615 x 12px).
    [{ legendPlacement: 'top' as const }, 'paddingBottom', '24px'],
    [
      { legendPlacement: 'top' as const, yLabelPlacement: 'right' as const },
      'paddingBottom',
      '24px',
    ],
    // overlap: the top gridline is nearest.
    [
      { legendPlacement: 'top' as const, yLabelPlacement: 'overlap' as const },
      'paddingBottom',
      '16px',
    ],
    // overlap with no gridlines: the top label is nearest, about 5px under the top of the plot.
    [
      { legendPlacement: 'top' as const, yLabelPlacement: 'overlap' as const, yGridlines: false },
      'paddingBottom',
      '12px',
    ],
    // At the bottom: spacing.5 from the X labels.
    [{}, 'paddingTop', '16px'],
  ])(
    'keeps spacing.5 from the legend to the nearest chart element with %p',
    async (display, side, gap) => {
      const container = renderChart(kind, display);
      await ready(container);
      expect(legendWrapper(container)?.style[side as 'paddingTop' | 'paddingBottom']).toBe(gap);
    },
  );
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
  const plotLeft = (container: HTMLElement): number =>
    Number(container.querySelector('defs clipPath rect')?.getAttribute('x'));

  it.each([
    {},
    { showBorder: true },
    { yLabelPlacement: 'right' as const },
    { yLabelPlacement: 'overlap' as const },
  ])('puts the category names in a tight left column with %p', async (display) => {
    const container = renderHorizontalBar(display);
    await ready(container);

    expect(surface(container)?.getAttribute('data-blade-chart-y-labels')).toBe('left');
    expect(yTicks(container).map((tick) => tick.textContent)).toEqual(['UPI', 'Payment links']);
    yTicks(container).forEach((tick) => {
      expect(tick.getAttribute('text-anchor')).toBe('end');
      expect(Number(tick.getAttribute('x'))).toBe(plotLeft(container) - 8);
    });
    // No fixed gutter: jsdom measures no text, so the column is the 8px gap only.
    expect(plotLeft(container)).toBe(8);
  });

  it('takes showBorder', async () => {
    const plain = renderHorizontalBar();
    await ready(plain);
    expect(yAxisLine(plain)).toBeNull();
    expect(plain.querySelector('[data-blade-chart-plot-border]')).toBeNull();

    const framed = renderHorizontalBar({ showBorder: true });
    await ready(framed);
    expect(borderLine(framed, 'left')).not.toBeNull();
    expect(borderLine(framed, 'right')).not.toBeNull();
    expect(borderLine(framed, 'bottom')).not.toBeNull();
  });

  it('writes the X values with valueFormat', async () => {
    const container = renderHorizontalBar({ valueFormat: { type: 'currency', currency: 'INR' } });
    await ready(container);
    const xLabels = Array.from(container.querySelectorAll('.recharts-xAxis-tick-labels text')).map(
      (text) => text.textContent,
    );
    expect(xLabels).toContain('₹0');
    expect(xLabels.some((label) => label?.includes('K') || label?.includes('L'))).toBe(true);
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

  it('spaces the v2 legend items spacing.4 apart, with no side padding', async () => {
    const container = renderDonut();
    await waitFor(() => expect(legendText(container)).not.toBeNull());
    const item = legendWrapper(container)!.querySelector('button')!;
    const row = item.parentElement!;
    expect(window.getComputedStyle(row).columnGap).toBe('12px');
    expect(window.getComputedStyle(row).rowGap).toBe('0px');
    expect(window.getComputedStyle(item).paddingLeft).toBe('0px');
    expect(window.getComputedStyle(item).paddingTop).toBe('4px');
  });

  it('keeps master legend spacing in v1', async () => {
    const container = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut dataKey="value" nameKey="name" data={donutData} />
          <ChartLegend />
        </ChartDonutWrapper>
      </Box>,
    ).container;
    await waitFor(() => expect(legendText(container)).not.toBeNull());
    const item = legendWrapper(container)!.querySelector('button')!;
    expect(window.getComputedStyle(item.parentElement!).gap).toBe('16px');
    expect(window.getComputedStyle(item).paddingLeft).toBe('4px');
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
