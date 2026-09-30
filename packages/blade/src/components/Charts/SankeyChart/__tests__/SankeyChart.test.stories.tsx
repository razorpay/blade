/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react-vite';
import { within, userEvent, expect, fn, waitFor } from 'storybook/test';
import React from 'react';
import { ChartSankeyWrapper, ChartSankey } from '../SankeyChart';
import type { SankeyDataLink, SankeyDataNode } from '../types';
import { Box } from '~components/Box';

// Total (10 000) → 8 methods → 2 outcomes. Six methods share 6% of the volume between them,
// so `groupNodesBelow={2}` folds them into "Other (6)".
const nodes: SankeyDataNode[] = [
  { id: 'total', name: 'Total' },
  { id: 'upi', name: 'UPI' },
  { id: 'card', name: 'Card' },
  { id: 'wallet', name: 'Wallet' },
  { id: 'netbanking', name: 'Netbanking' },
  { id: 'emi', name: 'EMI' },
  { id: 'bnpl', name: 'BNPL' },
  { id: 'paylater', name: 'Pay Later' },
  { id: 'cod', name: 'Cash on delivery' },
  { id: 'captured', name: 'Captured', isGroupable: false },
  { id: 'failed', name: 'Failed', isGroupable: false },
];
const tail: Array<[string, number]> = [
  ['wallet', 190],
  ['netbanking', 150],
  ['emi', 110],
  ['bnpl', 70],
  ['paylater', 50],
  ['cod', 30],
];
const links: SankeyDataLink[] = [
  { source: 'total', target: 'upi', value: 6400 },
  { source: 'total', target: 'card', value: 3000 },
  ...tail.map(([id, value]) => ({ source: 'total', target: id, value })),
  { source: 'upi', target: 'captured', value: 5900 },
  { source: 'upi', target: 'failed', value: 500 },
  { source: 'card', target: 'captured', value: 2700 },
  { source: 'card', target: 'failed', value: 300 },
  ...tail.map(([id, value]) => ({
    source: id,
    target: 'captured',
    value: Math.round(value * 0.9),
  })),
  ...tail.map(([id, value]) => ({
    source: id,
    target: 'failed',
    value: value - Math.round(value * 0.9),
  })),
];

const onExpandChange = fn();

const GroupedChart = (): React.ReactElement => (
  <Box width="900px" height="360px" overflowY="auto">
    <ChartSankeyWrapper>
      <ChartSankey
        data={{ nodes, links }}
        labelUnit="txn"
        labelDensity="compact"
        showColorIndicator
        groupNodesBelow={2}
        onExpandChange={onExpandChange}
      />
    </ChartSankeyWrapper>
  </Box>
);

const barHeightOf = (root: HTMLElement, name: string): number => {
  const text = Array.from(root.querySelectorAll('svg text')).find((t) =>
    t.textContent?.startsWith(name),
  );
  const bar = text?.closest('g[opacity]')?.querySelector('rect:not([stroke])');
  return parseFloat(bar?.getAttribute('height') ?? '0');
};

export const TestGroupExpandAndFold: StoryFn<typeof ChartSankey> = () => {
  onExpandChange.mockReset();
  return <GroupedChart />;
};

TestGroupExpandAndFold.play = async () => {
  const root = document.body;
  const { getByRole, getAllByRole, queryByRole } = within(root);
  await waitFor(() => expect(getByRole('button', { name: /Other \(6\)/ })).toBeVisible());

  const upiBefore = barHeightOf(root, 'UPI');
  const capturedBefore = barHeightOf(root, 'Captured');

  await userEvent.click(getByRole('button', { name: /Other \(6\)/ }));
  await waitFor(() => expect(onExpandChange).toHaveBeenCalledTimes(1));
  await expect(onExpandChange.mock.calls[0][0]).toMatchObject({ isExpanded: true });

  // Members are revealed in place; their labels fold the group again.
  const revealed = getAllByRole('button', { expanded: true });
  await expect(revealed).toHaveLength(6);
  await expect(queryByRole('button', { name: /Other \(6\)/ })).toBeNull();

  // The scale is locked: untouched bars keep their exact height.
  await expect(barHeightOf(root, 'UPI')).toBe(upiBefore);
  await expect(barHeightOf(root, 'Captured')).toBe(capturedBefore);

  // Revealed labels never overlap: every chip in the method column starts below the previous one.
  const chips = Array.from(root.querySelectorAll<SVGRectElement>('svg rect[stroke]'))
    .map((r) => r.getBoundingClientRect())
    .filter((r) => r.left > 250 && r.left < 600)
    .sort((a, b) => a.top - b.top);
  const overlaps = chips.some((chip, i) => i > 0 && chip.top < chips[i - 1].bottom - 0.5);
  await expect(overlaps).toBe(false);

  await userEvent.click(revealed[0]);
  await waitFor(() => expect(getByRole('button', { name: /Other \(6\)/ })).toBeVisible());
  await expect(onExpandChange).toHaveBeenCalledTimes(2);
  await expect(onExpandChange.mock.calls[1][0]).toMatchObject({ isExpanded: false });
};

export const TestGroupKeyboard: StoryFn<typeof ChartSankey> = () => {
  onExpandChange.mockReset();
  return <GroupedChart />;
};

TestGroupKeyboard.play = async () => {
  const { getByRole, getAllByRole } = within(document.body);
  await waitFor(() => expect(getByRole('button', { name: /Other \(6\)/ })).toBeVisible());

  const group = getByRole('button', { name: /Other \(6\)/ });
  (group as HTMLElement).focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(getAllByRole('button', { expanded: true })).toHaveLength(6));

  // Focus follows the toggle: a revealed member holds it — no re-focusing needed. (The ring is
  // `:focus-visible`, which needs trusted keyboard input Storybook cannot synthesise; the jest
  // suite covers it.)
  const revealed = getAllByRole('button', { expanded: true });
  await expect(revealed).toContain(document.activeElement);

  await userEvent.keyboard(' ');
  await waitFor(() => expect(getByRole('button', { name: /Other \(6\)/ })).toBeVisible());
  await expect(document.activeElement).toBe(getByRole('button', { name: /Other \(6\)/ }));
};

export const TestGroupTooltip: StoryFn<typeof ChartSankey> = () => <GroupedChart />;

TestGroupTooltip.play = async () => {
  const { getByRole } = within(document.body);
  await waitFor(() => expect(getByRole('button', { name: /Other \(6\)/ })).toBeVisible());

  await userEvent.hover(getByRole('button', { name: /Other \(6\)/ }));
  await waitFor(() => {
    const tooltip = document.querySelector('[data-blade-component="ChartSankeyTooltip"]');
    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent).toContain('Wallet');
    expect(tooltip?.textContent).toContain('Cash on delivery');
  });

  await userEvent.unhover(getByRole('button', { name: /Other \(6\)/ }));
  await waitFor(() =>
    expect(document.querySelector('[data-blade-component="ChartSankeyTooltip"]')).toBeNull(),
  );
};

export default {
  title: 'Components/Interaction Tests/SankeyChart',
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
  },
};
