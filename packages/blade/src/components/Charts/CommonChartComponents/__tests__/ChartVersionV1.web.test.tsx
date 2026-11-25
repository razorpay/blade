/**
 * `version="v1"`, the default, renders as Blade master. The snapshot of this file was written by
 * this same file on master (commit 0dc38d46), with no `version` prop. Do not update it with `-u`
 * unless master changes: a v1 change that breaks it is a regression.
 */
import React from 'react';
import { waitFor } from '@testing-library/react';
import {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
  ChartReferenceLine,
} from '..';
import { ChartLineWrapper, ChartLine } from '../../LineChart';
import { ChartAreaWrapper, ChartArea } from '../../AreaChart';
import { ChartBarWrapper, ChartBar } from '../../BarChart';
import { ChartDonutWrapper, ChartDonut } from '../../DonutChart';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={480} height={320}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const monthly = [
  { month: 'Jan', year: '2026', online: 42000, offline: 18000 },
  { month: 'Feb', year: '2026', online: 51000, offline: 21500 },
  { month: 'Mar', year: '2026', online: 47500, offline: 26000 },
  { month: 'Apr', year: '2026', online: 68000, offline: 24000 },
  { month: 'May', year: '2026', online: 74500, offline: 31000 },
  { month: 'Jun', year: '2026', online: 98000, offline: 36500 },
];

const daily = Array.from({ length: 30 }, (_, index) => ({
  day: `${index + 1} November 2026`,
  amount: 1000 + ((index * 37) % 11) * 100,
}));

const categories = [
  { method: 'UPI', amount: 52000 },
  { method: 'Cards', amount: 24000 },
  { method: 'Payment links', amount: 6000 },
];

/** Strips the ids that change from run to run: React ids and gradient namespaces. */
const normalise = (html: string): string =>
  html
    .replace(/:r[0-9a-z]+:/g, ':id:')
    .replace(/color-[A-Za-z0-9]+-(\d+)-/g, 'color-ns-$1-')
    .replace(/recharts\d+-clip/g, 'recharts-clip');

const settle = async (container: HTMLElement): Promise<void> => {
  await waitFor(() => expect(container.querySelector('.recharts-surface')).not.toBeNull());
};

const box = (children: React.ReactElement): React.ReactElement => (
  <Box width="480px" height="320px">
    {children}
  </Box>
);

const fixtures: Array<[string, () => React.ReactElement]> = [
  [
    'line with grid, axes, legend, tooltip, a dashed line and a reference line',
    () =>
      box(
        <ChartLineWrapper data={monthly}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartReferenceLine y={60000} label="Target" />
          <ChartLine dataKey="online" name="Online" />
          <ChartLine dataKey="offline" name="Offline" strokeStyle="dashed" />
        </ChartLineWrapper>,
      ),
  ],
  [
    'line with axis titles and a secondary X label',
    () =>
      box(
        <ChartLineWrapper data={monthly}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" secondaryDataKey="year" label="Month" />
          <ChartYAxis label="Amount" />
          <ChartLine dataKey="online" name="Online" strokeStyle="dotted" />
        </ChartLineWrapper>,
      ),
  ],
  [
    'line with 30 long daily labels',
    () =>
      box(
        <ChartLineWrapper data={daily}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="day" />
          <ChartYAxis />
          <ChartLegend />
          <ChartLine dataKey="amount" name="Amount" />
        </ChartLineWrapper>,
      ),
  ],
  [
    'area with grid, axes and legend',
    () =>
      box(
        <ChartAreaWrapper data={monthly}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartArea dataKey="online" name="Online" />
          <ChartArea dataKey="offline" name="Offline" />
        </ChartAreaWrapper>,
      ),
  ],
  [
    'column bar with grid, axes and legend',
    () =>
      box(
        <ChartBarWrapper data={monthly}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="online" name="Online" />
          <ChartBar dataKey="offline" name="Offline" />
        </ChartBarWrapper>,
      ),
  ],
  [
    'horizontal bar with category names',
    () =>
      box(
        <ChartBarWrapper data={categories} layout="vertical">
          <ChartXAxis type="number" />
          <ChartYAxis type="category" dataKey="method" />
          <ChartLegend />
          <ChartBar dataKey="amount" name="Amount" />
        </ChartBarWrapper>,
      ),
  ],
  [
    'donut with legend',
    () =>
      box(
        <ChartDonutWrapper>
          <ChartDonut dataKey="amount" nameKey="method" data={categories} />
          <ChartTooltip />
          <ChartLegend />
        </ChartDonutWrapper>,
      ),
  ],
];

describe('version v1 renders as Blade master', () => {
  it.each(fixtures)('%s', async (_name, render) => {
    const { container } = renderWithTheme(render());
    await settle(container);
    expect(normalise(container.innerHTML)).toMatchSnapshot();
  });
});
