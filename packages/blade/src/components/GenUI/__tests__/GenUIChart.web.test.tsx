import React from 'react';
import { act, render } from '@testing-library/react';
import { BladeProvider } from '~components/BladeProvider';
import { GenUIProvider } from '../GenUIProvider';
import { GenUISchemaRenderer } from '../GenUISchemaRenderer';
import type { GenUIComponent } from '../GenUIComponents';
import type { GenUIChartVersion } from '../types';
import { NBSP } from '../genUIChartUtils';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { bladeTheme } from '~tokens/theme';

type PartProps = Record<string, unknown>;

/** The props each chart part got, by part name. recharts draws nothing in jsdom. */
const mockPartProps: Record<string, PartProps[]> = {};

jest.mock('~components/Charts', () => {
  const actual = jest.requireActual('~components/Charts');
  const ReactActual = jest.requireActual('react');
  const part = (name: string) => ({
    children,
    ...props
  }: PartProps & { children?: React.ReactNode }) => {
    (mockPartProps[name] = mockPartProps[name] ?? []).push(props);
    return ReactActual.createElement('div', { 'data-part': name }, children);
  };
  return {
    ...actual,
    ChartBarWrapper: part('ChartBarWrapper'),
    ChartBar: part('ChartBar'),
    ChartLineWrapper: part('ChartLineWrapper'),
    ChartLine: part('ChartLine'),
    ChartDonutWrapper: part('ChartDonutWrapper'),
    ChartDonut: part('ChartDonut'),
    ChartXAxis: part('ChartXAxis'),
    ChartYAxis: part('ChartYAxis'),
    ChartLegend: part('ChartLegend'),
    ChartTooltip: part('ChartTooltip'),
    ChartCartesianGrid: part('ChartCartesianGrid'),
  };
});

const lastProps = (name: string): PartProps => {
  const calls = mockPartProps[name] ?? [];
  if (calls.length === 0) throw new Error(`${name} was not drawn`);
  return calls[calls.length - 1];
};
const wasDrawn = (name: string): boolean => (mockPartProps[name] ?? []).length > 0;

/** A colour as jsdom writes it back, so a token and a computed style compare. */
const toRgb = (color: string): string => {
  const element = document.createElement('div');
  element.style.backgroundColor = color;
  return element.style.backgroundColor;
};

const day = (i: number): string => new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10);

const chart = (props: Record<string, unknown>): GenUIComponent[] => [
  ({
    component: 'CHART',
    variant: 'full',
    xAxis: 'date',
    valueFormatter: { type: 'currency', currency: 'INR' },
    ...props,
  } as unknown) as GenUIComponent,
];

const daily = (
  count: number,
  keys: string[],
  value = (i: number): number => 100000 + i * 1000,
): Array<Record<string, string | number>> =>
  Array.from({ length: count }, (_, i) => ({
    date: day(i),
    ...Object.fromEntries(keys.map((key) => [key, value(i)])),
  }));

const renderAtWidth = (
  width: number,
  components: GenUIComponent[],
  config: { chartVersion?: GenUIChartVersion } = {},
): ReturnType<typeof renderWithTheme> => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(({
    width,
    height: 0,
    top: 0,
    left: 0,
    right: width,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as unknown) as DOMRect);
  return renderWithTheme(
    <GenUIProvider config={config}>
      <GenUISchemaRenderer components={components} isAnimating={false} />
    </GenUIProvider>,
  );
};

beforeEach(() => {
  Object.keys(mockPartProps).forEach((key) => {
    mockPartProps[key] = [];
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('<GenUI /> CHART in a narrow box', () => {
  describe('X labels (B2)', () => {
    it('labels a 30-day line every 7 days at 360px, thinned once, as "1 Oct"', () => {
      renderAtWidth(360, chart({ chartType: 'line', data: daily(30, ['Collected']) }));
      const xAxis = lastProps('ChartXAxis');

      // A number interval: ChartXAxis sizes each tick from the visible labels.
      expect(xAxis.interval).toBe(6);
      expect(xAxis).not.toHaveProperty('ticks');
      expect((xAxis.tickFormatter as (value: string) => string)(day(0))).toBe(`1${NBSP}Oct`);
    });

    it('gives a category axis no interval, so the v2 X axis shows the labels that fit', () => {
      renderAtWidth(
        360,
        chart({
          chartType: 'bar',
          xAxis: 'quarter',
          data: [
            { quarter: 'Q1', revenue: 100 },
            { quarter: 'Q2', revenue: 200 },
          ],
        }),
      );
      const xAxis = lastProps('ChartXAxis');

      expect(xAxis.interval).toBeUndefined();
      expect(xAxis.tickFormatter).toBeUndefined();
    });

    it('gives a centred last bar label room inside the plot', () => {
      renderAtWidth(
        360,
        chart({ chartType: 'bar', showBorder: true, data: daily(30, ['Collected']) }),
      );

      expect(lastProps('ChartXAxis').padding).toEqual({ left: 0, right: 8 });
    });

    it('gives the last bar label less room when the Y axis is inside the plot (no border)', () => {
      renderAtWidth(
        360,
        chart({ chartType: 'bar', yLabelPlacement: 'overlap', data: daily(30, ['Collected']) }),
      );

      expect(lastProps('ChartXAxis').padding).toEqual({ left: 0, right: 5 });
    });
  });

  describe('Y ticks (B3)', () => {
    it('writes INR in lakh, with at most 1 decimal, on an auto-width axis', () => {
      renderAtWidth(
        360,
        chart({ chartType: 'bar', showBorder: true, data: daily(7, ['Collected']) }),
      );
      const yAxis = lastProps('ChartYAxis');
      const format = yAxis.tickFormatter as (value: number) => string;

      // The v2 chart sets the width: a column as wide as the ticks.
      expect(yAxis).not.toHaveProperty('width');
      expect([0, 50000, 100000, 150000, 200000].map(format)).toEqual([
        '₹0',
        '₹50K',
        '₹1L',
        '₹1.5L',
        '₹2L',
      ]);
    });

    it('asks for whole ticks on a count chart', () => {
      renderAtWidth(
        360,
        chart({
          chartType: 'bar',
          valueFormatter: { type: 'number' },
          data: daily(7, ['Payments'], (i) => i % 4),
        }),
      );

      expect(lastProps('ChartYAxis').allowDecimals).toBe(false);
    });

    it('keeps decimals for amounts', () => {
      renderAtWidth(360, chart({ chartType: 'bar', data: daily(7, ['Collected']) }));

      expect(lastProps('ChartYAxis').allowDecimals).toBe(true);
    });
  });

  describe('legend and donut (B6)', () => {
    // The CHART composes a ChartLegend for 2 or more series (or slices) and none for one. The
    // node's showLegend wins. The wrappers take no legend prop.
    it('composes no ChartLegend for one series', () => {
      renderAtWidth(360, chart({ chartType: 'bar', data: daily(7, ['Collected']) }));
      expect(wasDrawn('ChartLegend')).toBe(false);
      expect(lastProps('ChartBarWrapper')).not.toHaveProperty('showLegend');
    });

    it('composes a ChartLegend for two series', () => {
      renderAtWidth(360, chart({ chartType: 'bar', data: daily(7, ['Collected', 'Refunded']) }));
      expect(wasDrawn('ChartLegend')).toBe(true);
      expect(lastProps('ChartBarWrapper')).not.toHaveProperty('showLegend');
    });

    it('composes a ChartLegend for one series with the node showLegend true', () => {
      renderAtWidth(
        360,
        chart({ chartType: 'line', showLegend: true, data: daily(7, ['Collected']) }),
      );
      expect(wasDrawn('ChartLegend')).toBe(true);
    });

    it('composes no ChartLegend for two series with the node showLegend false', () => {
      renderAtWidth(
        360,
        chart({ chartType: 'bar', showLegend: false, data: daily(7, ['Collected', 'Refunded']) }),
      );
      expect(wasDrawn('ChartLegend')).toBe(false);
    });

    it('composes no ChartLegend on a tiny chart', () => {
      renderAtWidth(
        360,
        chart({ chartType: 'line', variant: 'tiny', data: daily(7, ['Collected', 'Refunded']) }),
      );
      expect(wasDrawn('ChartLegend')).toBe(false);
    });

    it('composes no ChartLegend for a pie of one slice', () => {
      renderAtWidth(
        800,
        chart({ chartType: 'pie', xAxis: 'method', data: [{ method: 'UPI', value: 60 }] }),
      );
      expect(wasDrawn('ChartLegend')).toBe(false);
      expect(lastProps('ChartDonutWrapper')).not.toHaveProperty('showLegend');
    });

    it('composes a ChartLegend for a pie of two slices', () => {
      renderAtWidth(
        800,
        chart({
          chartType: 'pie',
          xAxis: 'method',
          data: [
            { method: 'UPI', value: 60 },
            { method: 'Card', value: 40 },
          ],
        }),
      );
      expect(wasDrawn('ChartLegend')).toBe(true);
    });

    it('takes the small donut radius in a 300px box, and a box of at least 260px', () => {
      renderAtWidth(
        300,
        chart({
          chartType: 'pie',
          xAxis: 'method',
          data: [
            { method: 'UPI', value: 60 },
            { method: 'Card', value: 30 },
            { method: 'Netbanking', value: 10 },
          ],
        }),
      );

      expect(lastProps('ChartDonut').radius).toBe('small');
      expect(lastProps('ChartDonutWrapper').height).toBe('260px');
    });

    it('keeps the medium radius in a wide box', () => {
      renderAtWidth(
        800,
        chart({
          chartType: 'pie',
          xAxis: 'method',
          data: [
            { method: 'UPI', value: 60 },
            { method: 'Card', value: 40 },
          ],
        }),
      );

      expect(lastProps('ChartDonut').radius).toBe('medium');
      expect(lastProps('ChartDonutWrapper').height).toBe('350px');
    });
  });

  describe('height from width (B1)', () => {
    it.each([
      [256, '200px'],
      [400, '250px'],
      [1100, '350px'],
    ])('a %ipx box gives the chart wrapper %s', (width, height) => {
      renderAtWidth(width, chart({ chartType: 'line', data: daily(7, ['Collected']) }));

      expect(lastProps('ChartLineWrapper').height).toBe(height);
    });

    it('keeps the tiny chart at 100px with no axes', () => {
      renderAtWidth(
        360,
        chart({ chartType: 'bar', variant: 'tiny', data: daily(7, ['Collected']) }),
      );

      expect(lastProps('ChartBarWrapper').height).toBe('100px');
      expect(wasDrawn('ChartXAxis')).toBe(false);
    });
  });

  describe('showBorder', () => {
    it.each([
      [360, false],
      [640, false],
      [800, true],
    ])('a %ipx box with no showBorder gives the grid %s', (width, showBorder) => {
      renderAtWidth(width, chart({ chartType: 'line', data: daily(7, ['Collected']) }));

      expect(lastProps('ChartCartesianGrid').showBorder).toBe(showBorder);
      expect(lastProps('ChartLineWrapper')).not.toHaveProperty('showBorder');
    });

    it('keeps a border until the box is measured', () => {
      renderAtWidth(0, chart({ chartType: 'line', data: daily(7, ['Collected']) }));

      expect(lastProps('ChartCartesianGrid').showBorder).toBe(true);
    });

    it('gives a chart with a border a left Y label column', () => {
      renderAtWidth(800, chart({ chartType: 'line', data: daily(7, ['Collected']) }));

      expect(lastProps('ChartYAxis').labelPlacement).toBe('left');
    });

    it('leaves the Y axis width to the v2 chart, with and without a border', () => {
      renderAtWidth(800, chart({ chartType: 'bar', data: daily(7, ['Collected']) }));
      expect(lastProps('ChartYAxis')).not.toHaveProperty('width');

      renderAtWidth(360, chart({ chartType: 'bar', data: daily(7, ['Collected']) }));
      expect(lastProps('ChartYAxis')).not.toHaveProperty('width');
    });

    it('takes the showBorder of the node over the width', () => {
      renderAtWidth(
        360,
        chart({ chartType: 'bar', showBorder: true, data: daily(7, ['Collected']) }),
      );
      expect(lastProps('ChartCartesianGrid').showBorder).toBe(true);

      renderAtWidth(
        800,
        chart({ chartType: 'bar', showBorder: false, data: daily(7, ['Collected']) }),
      );
      expect(lastProps('ChartCartesianGrid').showBorder).toBe(false);
    });

    it('ignores a showBorder that is not a boolean', () => {
      renderAtWidth(
        800,
        chart({ chartType: 'line', showBorder: 'yes', data: daily(7, ['Collected']) }),
      );

      expect(lastProps('ChartCartesianGrid').showBorder).toBe(true);
    });

    it('gives ChartYAxis labelPlacement left by default, and the node value', () => {
      renderAtWidth(360, chart({ chartType: 'line', data: daily(7, ['Collected']) }));
      expect(lastProps('ChartYAxis').labelPlacement).toBe('left');
      expect(lastProps('ChartLineWrapper')).not.toHaveProperty('yLabelPlacement');

      (['left', 'right', 'overlap'] as const).forEach((placement) => {
        renderAtWidth(
          360,
          chart({ chartType: 'bar', yLabelPlacement: placement, data: daily(7, ['Collected']) }),
        );
        expect(lastProps('ChartYAxis').labelPlacement).toBe(placement);
      });

      // An old `outside` from a model is `right`. An unknown value is `left`.
      renderAtWidth(
        360,
        chart({ chartType: 'bar', yLabelPlacement: 'outside', data: daily(7, ['Collected']) }),
      );
      expect(lastProps('ChartYAxis').labelPlacement).toBe('right');
      renderAtWidth(
        360,
        chart({ chartType: 'line', yLabelPlacement: 'middle', data: daily(7, ['Collected']) }),
      );
      expect(lastProps('ChartYAxis').labelPlacement).toBe('left');
    });

    it('draws no border on a tiny chart, which has no axes', () => {
      renderAtWidth(
        800,
        chart({ chartType: 'line', variant: 'tiny', data: daily(7, ['Collected']) }),
      );

      expect(wasDrawn('ChartCartesianGrid')).toBe(false);
    });
  });

  describe('tooltip values', () => {
    const tooltipText = (value: number): string =>
      (lastProps('ChartTooltip').formatter as (value: number) => string)(value);

    it('writes amounts in full, in Indian format, while the ticks stay compact', () => {
      renderAtWidth(360, chart({ chartType: 'line', data: daily(7, ['Collected']) }));

      expect(tooltipText(123450)).toBe('₹1,23,450.00');
      expect((lastProps('ChartYAxis').tickFormatter as (value: number) => string)(123450)).toBe(
        '₹1.2L',
      );
    });

    // `count` and `percent` are the names. `number` and `percentage` are older names for them.
    it.each([
      ['count', 'percent'],
      ['number', 'percentage'],
    ])('writes %s with grouping and %s with 1 decimal', (countType, percentType) => {
      renderAtWidth(
        360,
        chart({ chartType: 'bar', valueFormatter: { type: countType }, data: daily(7, ['Count']) }),
      );
      expect(tooltipText(123450)).toBe('1,23,450');
      expect((lastProps('ChartYAxis').tickFormatter as (value: number) => string)(1234)).toBe(
        '1,234',
      );
      expect(lastProps('ChartYAxis').allowDecimals).toBe(false);

      renderAtWidth(
        360,
        chart({
          chartType: 'bar',
          valueFormatter: { type: percentType },
          data: daily(7, ['Rate'], () => 12.34),
        }),
      );
      expect(tooltipText(12.34)).toBe('12.3%');
      expect((lastProps('ChartYAxis').tickFormatter as (value: number) => string)(12.5)).toBe(
        '12.5%',
      );
    });

    it('writes a date heading as the X labels do, "4 Oct"', () => {
      renderAtWidth(360, chart({ chartType: 'line', data: daily(30, ['Collected']) }));
      const labelFormatter = lastProps('ChartTooltip').labelFormatter as (label: string) => string;

      expect(labelFormatter(day(3))).toBe(`4${NBSP}Oct`);
      expect(labelFormatter(day(3))).toBe(
        (lastProps('ChartXAxis').tickFormatter as (value: string) => string)(day(3)),
      );
    });

    it('keeps a category heading as it is', () => {
      renderAtWidth(
        360,
        chart({
          chartType: 'bar',
          xAxis: 'quarter',
          data: [
            { quarter: 'Q1', revenue: 100 },
            { quarter: 'Q2', revenue: 200 },
          ],
        }),
      );

      expect(lastProps('ChartTooltip').labelFormatter).toBeUndefined();
    });

    it('formats the donut tooltip too', () => {
      renderAtWidth(
        800,
        chart({
          chartType: 'pie',
          xAxis: 'method',
          data: [
            { method: 'UPI', value: 520000 },
            { method: 'Card', value: 250000 },
          ],
        }),
      );

      expect(tooltipText(520000)).toBe('₹5,20,000.00');
    });
  });

  describe('bar list in place of a pie', () => {
    const methods = [
      { method: 'UPI', value: 520000 },
      { method: 'Card', value: 250000 },
      { method: 'Netbanking', value: 80000 },
      { method: 'Wallet', value: 40000 },
      { method: 'EMI', value: 15000 },
    ];

    it('shows a pie of 5 slices as a Total row and one row a slice, in order', () => {
      const { getByTestId, container } = renderAtWidth(
        800,
        chart({ chartType: 'pie', xAxis: 'method', title: 'By method', data: methods }),
      );

      expect(container.querySelector('[data-part="ChartDonut"]')).toBeNull();
      const list = getByTestId('genui-chart-bar-list');
      const text = list.textContent ?? '';
      expect(text.indexOf('Total')).toBe(0);
      expect(text).toContain('₹9,05,000.00');
      expect(text).toContain('₹5,20,000.00 · 57.5%');
      expect(text).toContain('₹15,000.00 · 1.7%');
      expect(text.indexOf('UPI')).toBeLessThan(text.indexOf('EMI'));
    });

    it('draws the Total bar in categorical blue strong and each row bar in blue subtle', () => {
      const { getByTestId } = renderAtWidth(
        800,
        chart({ chartType: 'pie', xAxis: 'method', data: methods }),
      );
      const bars = Array.from(
        getByTestId('genui-chart-bar-list').querySelectorAll('[data-genui-bar-share]'),
      ).map((bar) => getComputedStyle(bar).backgroundColor);
      const colors = bladeTheme.colors.onLight;

      expect(bars).toHaveLength(methods.length + 1);
      expect(bars[0]).toBe(toRgb(colors.data.background.categorical.blue.strong));
      bars
        .slice(1)
        .forEach((color) =>
          expect(color).toBe(toRgb(colors.data.background.categorical.blue.subtle)),
        );
    });

    it('shows a pie of 3 slices as a bar list in a box under 300px', () => {
      const { getByTestId, container } = renderAtWidth(
        256,
        chart({ chartType: 'pie', xAxis: 'method', data: methods.slice(0, 3) }),
      );

      // The first render, before the box is measured, draws the donut. The measured one does not.
      expect(getByTestId('genui-chart-bar-list')).toBeInTheDocument();
      expect(container.querySelector('[data-part="ChartDonut"]')).toBeNull();
    });

    it.each(['percent', 'percentage'])('shows the value only on a %s pie', (type) => {
      const { getByTestId } = renderAtWidth(
        800,
        chart({
          chartType: 'pie',
          xAxis: 'method',
          valueFormatter: { type },
          data: methods.map((row, i) => ({ method: row.method, value: [50, 20, 15, 10, 5][i] })),
        }),
      );

      const text = getByTestId('genui-chart-bar-list').textContent ?? '';
      expect(text).toContain('UPI50.0%');
      expect(text).not.toContain('·');
    });

    it('keeps the donut for a tiny pie', () => {
      renderAtWidth(
        800,
        chart({ chartType: 'pie', variant: 'tiny', xAxis: 'method', data: methods }),
      );

      expect(wasDrawn('ChartDonut')).toBe(true);
    });
  });

  describe('chart versions', () => {
    it('draws the v2 charts with no config', () => {
      renderAtWidth(360, chart({ chartType: 'line', data: daily(7, ['Collected']) }));
      expect(lastProps('ChartLineWrapper').version).toBe('v2');
    });

    it.each([
      [{ chartVersion: 'v1' as const }, undefined],
      [{ chartVersion: 'v2' as const }, 'v2'],
    ])('reads %p as version %p', (config, version) => {
      renderAtWidth(360, chart({ chartType: 'line', data: daily(7, ['Collected']) }), config);
      expect(lastProps('ChartLineWrapper').version).toBe(version);
    });

    it('lets the v2 X axis thin a category axis', () => {
      renderAtWidth(
        360,
        chart({
          chartType: 'bar',
          xAxis: 'method',
          data: ['UPI', 'Card', 'Netbanking'].map((method, i) => ({ method, value: 10 + i })),
        }),
      );
      expect(lastProps('ChartXAxis').interval).toBeUndefined();
    });
  });

  describe('chartVersion v1', () => {
    const fixedAt = (width: number, props: Record<string, unknown>): void => {
      renderAtWidth(width, chart(props), { chartVersion: 'v1' });
    };

    it('draws a line chart as before in a 360px box', () => {
      fixedAt(360, { chartType: 'line', data: daily(30, ['Collected']) });

      expect(lastProps('ChartLineWrapper').height).toBe('350px');
      expect(lastProps('ChartLineWrapper')).not.toHaveProperty('showBorder');
      expect(lastProps('ChartXAxis')).not.toHaveProperty('interval');
      expect(lastProps('ChartXAxis')).not.toHaveProperty('tickFormatter');
      expect(lastProps('ChartYAxis')).not.toHaveProperty('width');
      expect(lastProps('ChartYAxis')).not.toHaveProperty('allowDecimals');
      expect(lastProps('ChartTooltip')).not.toHaveProperty('formatter');
      expect(lastProps('ChartTooltip')).not.toHaveProperty('labelFormatter');
      // A legend for one series, as before.
      expect(wasDrawn('ChartLegend')).toBe(true);
    });

    it('writes INR ticks as before, through formatNumber', () => {
      fixedAt(360, { chartType: 'bar', data: daily(7, ['Collected']) });
      const format = lastProps('ChartYAxis').tickFormatter as (value: number) => string;

      expect(format(150000)).not.toBe('₹1.5L');
    });

    it('draws a pie of 5 slices as a medium donut, with no bar list', () => {
      const { queryByTestId } = renderAtWidth(
        256,
        chart({
          chartType: 'pie',
          xAxis: 'method',
          data: ['UPI', 'Card', 'Netbanking', 'Wallet', 'EMI'].map((method, i) => ({
            method,
            value: 100 - i * 10,
          })),
        }),
        { chartVersion: 'v1' },
      );

      expect(queryByTestId('genui-chart-bar-list')).toBeNull();
      expect(lastProps('ChartDonut').radius).toBe('medium');
      expect(lastProps('ChartDonutWrapper').height).toBe('350px');
    });

    it('ignores the showBorder field', () => {
      fixedAt(360, { chartType: 'bar', showBorder: true, data: daily(7, ['Collected']) });

      expect(lastProps('ChartBarWrapper')).not.toHaveProperty('showBorder');
    });
  });

  describe('box width after loading', () => {
    // A fake ResizeObserver: the test sends a new width to the box each observer watches.
    type FakeObserver = { callback: ResizeObserverCallback; elements: Set<Element> };
    const observers: FakeObserver[] = [];
    const resizeTo = (width: number): void => {
      observers.forEach((observer) => {
        observer.elements.forEach((element) => {
          if (!element.isConnected) return;
          act(() => {
            observer.callback(
              [({ target: element, contentRect: { width } } as unknown) as ResizeObserverEntry],
              (observer as unknown) as ResizeObserver,
            );
          });
        });
      });
    };

    beforeEach(() => {
      observers.length = 0;
      window.ResizeObserver = class {
        private record: FakeObserver;
        constructor(callback: ResizeObserverCallback) {
          this.record = { callback, elements: new Set() };
          observers.push(this.record);
        }
        observe(element: Element): void {
          this.record.elements.add(element);
        }
        unobserve(element: Element): void {
          this.record.elements.delete(element);
        }
        disconnect(): void {
          this.record.elements.clear();
        }
      } as typeof ResizeObserver;
    });

    it('follows the chart box from the skeleton to the chart, and a resize after', () => {
      jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(({
        width: 360,
        height: 0,
        top: 0,
        left: 0,
        right: 360,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as unknown) as DOMRect);
      const tree = (components: GenUIComponent[]): JSX.Element => (
        <BladeProvider themeTokens={bladeTheme} colorScheme="light">
          <GenUIProvider config={{}}>
            <GenUISchemaRenderer components={components} isAnimating={false} />
          </GenUIProvider>
        </BladeProvider>
      );
      // Loading: no valueFormatter yet, so the skeleton renders in its own box.
      // The same tree each time, so React keeps the GenUI chart and only its inner box changes.
      const { rerender } = render(
        tree(
          chart({ chartType: 'line', valueFormatter: undefined, data: daily(7, ['Collected']) }),
        ),
      );
      expect(wasDrawn('ChartLineWrapper')).toBe(false);

      // Loaded: the chart renders in a new box.
      rerender(tree(chart({ chartType: 'line', data: daily(7, ['Collected']) })));
      expect(lastProps('ChartLineWrapper').height).toBe('225px');

      // The observer watches the new box: a resize to 800px gives the 800px height.
      resizeTo(800);
      expect(lastProps('ChartLineWrapper').height).toBe('350px');
    });
  });
});
