import React from 'react';
import { waitFor } from '@testing-library/react';
import { ChartXAxis, ChartYAxis, ChartCartesianGrid } from '..';
import { ChartBarWrapper, ChartBar } from '../../BarChart';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

// The chart width of each test. recharts measures nothing in jsdom, so the container is fixed.
let mockChartWidth = 800;
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={mockChartWidth} height={240}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

// Failed payments by bank: the horizontal bar of the Chart Display Controls story.
const bankData = [
  { bank: 'State Bank of India', upi: 184200, cards: 62300 },
  { bank: 'HDFC Bank', upi: 142900, cards: 88400 },
  { bank: 'ICICI Bank', upi: 121500, cards: 71200 },
  { bank: 'Kotak Mahindra Bank', upi: 64800, cards: 39700 },
  { bank: 'Axis Bank', upi: 58300, cards: 45100 },
];

// jsdom has no canvas: Blade measures text as 0.55em a character, at 12px.
const textWidth = (text: string): number => text.length * 12 * 0.55;

type LabelBox = { text: string; left: number; right: number };

const xLabelBoxes = (container: HTMLElement): LabelBox[] =>
  Array.from(container.querySelectorAll('.recharts-xAxis-tick-labels > g')).flatMap((group) => {
    const text = group.querySelector('text');
    const label = text?.textContent ?? '';
    if (!text || !label) return [];
    const match = /translate\(([-\d.]+)/.exec(
      group.querySelector('g')?.getAttribute('transform') ?? '',
    );
    const x = Number(match?.[1]);
    const width = textWidth(label);
    const anchor = text.getAttribute('text-anchor');
    const left = anchor === 'start' ? x : anchor === 'end' ? x - width : x - width / 2;
    return [{ text: label, left, right: left + width }];
  });

describe('v2 number X axis ticks', () => {
  it.each([200, 360, 800])(
    'keeps spacing.3 between the X labels and keeps them in the chart at %ipx',
    async (width) => {
      mockChartWidth = width;
      const { container } = renderWithTheme(
        <Box width={`${width}px`} height="240px">
          <ChartBarWrapper
            data={bankData}
            layout="vertical"
            version="v2"
            valueFormat={{ type: 'currency', currency: 'INR' }}
          >
            <ChartCartesianGrid />
            <ChartXAxis type="number" />
            <ChartYAxis type="category" dataKey="bank" />
            <ChartBar dataKey="upi" name="UPI" stackId="bank" />
            <ChartBar dataKey="cards" name="Cards" stackId="bank" />
          </ChartBarWrapper>
        </Box>,
      );
      await waitFor(() => expect(xLabelBoxes(container).length).toBeGreaterThan(1));
      const boxes = xLabelBoxes(container).sort((a, b) => a.left - b.left);
      const clip = container.querySelector('defs clipPath rect');
      const plotRight = Number(clip?.getAttribute('x')) + Number(clip?.getAttribute('width'));

      boxes.slice(1).forEach((box, i) => {
        expect(box.left - boxes[i].right).toBeGreaterThanOrEqual(8);
      });
      expect(boxes[0].left).toBeGreaterThanOrEqual(0);
      expect(boxes[boxes.length - 1].right).toBeLessThanOrEqual(plotRight + 0.01);
      // At most recharts' 5 ticks; fewer in a narrow chart.
      expect(boxes.length).toBeLessThanOrEqual(5);
      if (width === 800) expect(boxes.length).toBe(5);
    },
  );
});
