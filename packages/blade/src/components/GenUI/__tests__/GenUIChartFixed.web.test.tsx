/**
 * The GenUI CHART with no `chartLayout` must draw as the release before it. The snapshots in this
 * file were written by running this same file on Blade master (2001d10), with no change to it.
 * Any change to the default output fails here.
 */
import React from 'react';
import { GenUIProvider } from '../GenUIProvider';
import { GenUISchemaRenderer } from '../GenUISchemaRenderer';
import type { GenUIComponent } from '../GenUIComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={360} height={350}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const day = (i: number): string => new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10);

const daily = (count: number): Array<Record<string, string | number>> =>
  Array.from({ length: count }, (_, i) => ({ date: day(i), Collected: 100000 + i * 7000 }));

const methods = ['UPI', 'Card', 'Netbanking', 'Wallet', 'EMI', 'Paylater'].map((method, i) => ({
  method,
  value: 600 - i * 90,
}));

const nodes: Array<[string, Record<string, unknown>]> = [
  ['bar, 30 days, INR', { chartType: 'bar', xAxis: 'date', data: daily(30) }],
  ['line, 30 days, INR', { chartType: 'line', xAxis: 'date', data: daily(30) }],
  ['area, 7 days, INR', { chartType: 'area', xAxis: 'date', data: daily(7) }],
  [
    'bar, counts',
    {
      chartType: 'bar',
      xAxis: 'date',
      valueFormatter: { type: 'number' },
      data: daily(7).map((row, i) => ({ ...row, Collected: i % 4 })),
    },
  ],
  ['pie, 6 slices', { chartType: 'pie', xAxis: 'method', data: methods }],
  ['tiny line', { chartType: 'line', variant: 'tiny', xAxis: 'date', data: daily(7) }],
  ['empty data, finished', { chartType: 'bar', xAxis: 'date', data: [] }],
  ['no valueFormatter', { chartType: 'bar', xAxis: 'date', data: daily(7), valueFormatter: null }],
];

/** The page HTML with per-instance ids made stable, so only the drawing is compared. */
const stableHtml = (container: HTMLElement): string =>
  container.innerHTML
    // Area gradient ids: React.useId on master, Blade's useId on the branch (B5).
    .replace(/color-[A-Za-z0-9]+-(\d+)-/g, 'color-ID-$1-')
    // recharts and Blade ids from React.useId or counters.
    .replace(/:r[0-9a-z]+:/g, ':rID:')
    .replace(/recharts\d+-clip/g, 'rechartsID-clip');

describe('<GenUI /> CHART with no chartLayout draws as before', () => {
  it.each(nodes)('%s', (_name, props) => {
    const component = ({
      component: 'CHART',
      title: 'Chart',
      valueFormatter: { type: 'currency', currency: 'INR' },
      ...props,
    } as unknown) as GenUIComponent;
    if ((component as { valueFormatter?: unknown }).valueFormatter === null) {
      delete (component as { valueFormatter?: unknown }).valueFormatter;
    }

    const { container } = renderWithTheme(
      <GenUIProvider>
        <GenUISchemaRenderer components={[component]} isAnimating={false} />
      </GenUIProvider>,
    );

    expect(stableHtml(container)).toMatchSnapshot();
  });
});
