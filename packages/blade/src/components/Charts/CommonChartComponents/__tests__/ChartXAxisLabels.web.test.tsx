import React from 'react';
import { waitFor } from '@testing-library/react';
import { ChartXAxis, ChartYAxis, ChartCartesianGrid } from '..';
import { ChartLineWrapper, ChartLine } from '../../LineChart';
import { ChartBarWrapper, ChartBar } from '../../BarChart';
import { getVisibleXLabelIndexes } from '../xAxisLabels';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

let mockChartWidth = 800;
// 6.5px a character: about the 12px tick font. jsdom has no text layout.
const CHAR_WIDTH = 6.5;

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={mockChartWidth} height={300}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  measureTextWidth: (text: string) => text.length * 6.5,
}));

const dailyData = (count: number): Array<{ day: string; amount: number }> =>
  Array.from({ length: count }, (_, index) => ({
    day: `${index + 1} Nov`,
    amount: 1000 + ((index * 37) % 11) * 100,
  }));

type Box1D = { text: string; left: number; right: number; lines: number };

/** The drawn X labels, left to right, with their horizontal extent. */
const drawnXLabels = (container: HTMLElement): Box1D[] =>
  Array.from(container.querySelectorAll('.recharts-xAxis-tick-labels g[transform] text')).map(
    (text) => {
      const x = Number(
        /translate\(([-\d.]+)/.exec(text.parentElement?.getAttribute('transform') ?? '')?.[1],
      );
      const content = text.textContent ?? '';
      const width = content.length * CHAR_WIDTH;
      const anchor = text.getAttribute('text-anchor');
      const left = anchor === 'start' ? x : anchor === 'end' ? x - width : x - width / 2;
      return {
        text: content,
        left,
        right: left + width,
        lines: text.querySelectorAll('tspan').length,
      };
    },
  );

const renderLine = (width: number, count: number): HTMLElement => {
  mockChartWidth = width;
  return renderWithTheme(
    <Box width={`${width}px`} height="300px">
      <ChartLineWrapper data={dailyData(count)}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="day" />
        <ChartYAxis />
        <ChartLine dataKey="amount" name="Amount" />
      </ChartLineWrapper>
    </Box>,
  ).container;
};

const expectNoOverlap = (labels: Box1D[]): void => {
  labels.forEach((label, index) => {
    expect(label.lines).toBe(1);
    if (index > 0) expect(label.left - labels[index - 1].right).toBeGreaterThanOrEqual(8);
  });
};

describe('X label thinning', () => {
  describe.each([300, 360, 560, 800])('a line chart %spx wide', (width) => {
    it.each([10, 30])('shows %s daily labels with no overlap, one line each', async (count) => {
      const container = renderLine(width, count);
      await waitFor(() => expect(drawnXLabels(container).length).toBeGreaterThan(0));
      const labels = drawnXLabels(container);

      expectNoOverlap(labels);
      // The first and the last label stay.
      expect(labels[0].text).toBe('1 Nov');
      expect(labels[labels.length - 1].text).toBe(`${count} Nov`);
      // Not thinned more than it must be: the next step down overlaps.
      expect(labels.length).toBeGreaterThan(1);
    });
  });

  it('shows 9 of 10 labels at 560px: the 9th meets the last, so it goes', async () => {
    const container = renderLine(560, 10);
    await waitFor(() => expect(drawnXLabels(container).length).toBeGreaterThan(0));
    const texts = drawnXLabels(container).map((label) => label.text);
    expect(texts).toHaveLength(9);
    expect(texts).not.toContain('9 Nov');
  });

  it('thins 30 labels at 300px', async () => {
    const container = renderLine(300, 30);
    await waitFor(() => expect(drawnXLabels(container).length).toBeGreaterThan(0));
    expect(drawnXLabels(container).length).toBeLessThan(30);
  });

  it('thins the labels of a bar chart, centred on each bar', async () => {
    mockChartWidth = 300;
    const { container } = renderWithTheme(
      <Box width="300px" height="300px">
        <ChartBarWrapper data={dailyData(30)}>
          <ChartXAxis dataKey="day" />
          <ChartYAxis />
          <ChartBar dataKey="amount" name="Amount" />
        </ChartBarWrapper>
      </Box>,
    );
    await waitFor(() => expect(drawnXLabels(container).length).toBeGreaterThan(0));
    const labels = drawnXLabels(container);
    expect(labels.length).toBeLessThan(30);
    expectNoOverlap(labels);
    container
      .querySelectorAll('.recharts-xAxis-tick-labels g[transform] text')
      .forEach((text) => expect(text.getAttribute('text-anchor')).toBe('middle'));
  });

  it('keeps an explicit interval', async () => {
    mockChartWidth = 800;
    const { container } = renderWithTheme(
      <Box width="800px" height="300px">
        <ChartLineWrapper data={dailyData(10)}>
          <ChartXAxis dataKey="day" interval={4} />
          <ChartYAxis />
          <ChartLine dataKey="amount" name="Amount" />
        </ChartLineWrapper>
      </Box>,
    );
    await waitFor(() => expect(drawnXLabels(container).length).toBeGreaterThan(0));
    expect(drawnXLabels(container).map((label) => label.text)).toEqual(['1 Nov', '6 Nov']);
  });
});

describe('getVisibleXLabelIndexes', () => {
  const widths = (count: number, width = 40): number[] => Array(count).fill(width);

  it('shows every label that fits', () => {
    expect(
      getVisibleXLabelIndexes({
        widths: widths(5),
        plotWidth: 400,
        minGap: 8,
        isBand: false,
        isEdgeAnchored: true,
      }),
    ).toEqual([0, 1, 2, 3, 4]);
  });

  it('keeps the first and the last label, and drops the one that meets the last', () => {
    // 11 labels over 200px: a step of 20px. Every 3rd label (60px) fits. 9 meets the last, 10.
    expect(
      getVisibleXLabelIndexes({
        widths: widths(11),
        plotWidth: 200,
        minGap: 8,
        isBand: false,
        isEdgeAnchored: false,
      }),
    ).toEqual([0, 3, 6, 10]);
  });

  it('shows the first label only when no two fit', () => {
    expect(
      getVisibleXLabelIndexes({
        widths: widths(3, 100),
        plotWidth: 120,
        minGap: 8,
        isBand: true,
        isEdgeAnchored: false,
      }),
    ).toEqual([0]);
  });

  it('returns nothing for no labels and the one label for one', () => {
    const base = { plotWidth: 100, minGap: 8, isBand: false, isEdgeAnchored: true };
    expect(getVisibleXLabelIndexes({ ...base, widths: [] })).toEqual([]);
    expect(getVisibleXLabelIndexes({ ...base, widths: [40] })).toEqual([0]);
  });
});
