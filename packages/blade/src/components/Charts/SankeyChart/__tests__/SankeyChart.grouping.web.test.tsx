/**
 * SankeyChart grouping tests — folding small nodes into "Other", expanding in place at a
 * locked scale, keyboard access, controlled state, and the group tooltip.
 *
 * Run with: SHARD='' yarn test:react --testPathPattern=SankeyChart.grouping
 */
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { ChartSankeyWrapper, ChartSankey } from '../SankeyChart';
import type { ChartSankeyProps, SankeyDataLink, SankeyDataNode } from '../types';
import { getGroupId } from '../grouping';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

const CONTAINER_RECT = {
  width: 800,
  height: 400,
  top: 0,
  left: 0,
  right: 800,
  bottom: 400,
  x: 0,
  y: 0,
  toJSON: () => ({}),
} as DOMRect;
beforeAll(() => {
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(CONTAINER_RECT);
});
afterAll(() => {
  jest.restoreAllMocks();
});

// 7px per character regardless of weight — deterministic, monotonic text measurement.
jest.mock('../../CommonChartComponents/utils', () => ({
  calculateTextWidth: (text: string) => ({ width: text.length * 7, displayText: text }),
}));

// Total (10 000) → 8 methods → 2 outcomes. Six methods share 6% of the volume between them.
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

const data = { nodes, links };
const GROUP_ID = getGroupId(1);

const renderSankey = (
  sankeyProps: Partial<ChartSankeyProps> = {},
): ReturnType<typeof renderWithTheme> =>
  renderWithTheme(
    <ChartSankeyWrapper>
      <ChartSankey data={data} labelUnit="txn" groupNodesBelow={2} {...sankeyProps} />
    </ChartSankeyWrapper>,
  );

const getLabelTexts = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll('svg text')).map((t) => t.textContent ?? '');

const getGroupButton = (container: HTMLElement): SVGGElement =>
  container.querySelector<SVGGElement>('svg [role="button"][aria-expanded="false"]')!;

const getRevealedButtons = (container: HTMLElement): SVGGElement[] =>
  Array.from(container.querySelectorAll<SVGGElement>('svg [role="button"][aria-expanded="true"]'));

/** Height of the bar drawn for a node, found through the label text that follows it. */
const getBarHeight = (container: HTMLElement, name: string): number => {
  const text = Array.from(container.querySelectorAll('svg text')).find((t) =>
    t.textContent?.startsWith(name),
  )!;
  const bar = text.closest('g[opacity]')!.querySelector('rect:not([stroke])')!;
  return parseFloat(bar.getAttribute('height') ?? '0');
};

describe('SankeyChart — grouping: folded state', () => {
  it('folds the six small methods into one "Other" node with a chevron', () => {
    const { container } = renderSankey();
    const texts = getLabelTexts(container);
    expect(texts.some((t) => t.startsWith('Other (6)'))).toBe(true);
    ['Wallet', 'Netbanking', 'EMI', 'BNPL', 'Pay Later', 'Cash on delivery'].forEach((name) =>
      expect(texts.some((t) => t.startsWith(name))).toBe(false),
    );
    // UPI, Card and the two outcomes stay; the group is the only interactive label.
    expect(texts.some((t) => t.startsWith('UPI'))).toBe(true);
    const groupButton = getGroupButton(container);
    expect(groupButton).not.toBeNull();
    expect(groupButton.getAttribute('aria-label')).toBe('Other (6), 6 grouped nodes');
    // The chevron is a Blade icon: a nested <svg> inside the label.
    expect(groupButton.querySelector('svg')).not.toBeNull();
  });

  it('shows the group share and value in its label', () => {
    const { container } = renderSankey();
    const groupText = getLabelTexts(container).find((t) => t.startsWith('Other (6)'));
    // 600 of 10 000 → 6%
    expect(groupText).toBe('Other (6)600 txn  (6%)');
  });

  it('does not group when every node clears the threshold', () => {
    const { container } = renderSankey({ groupNodesBelow: 0.2 });
    expect(container.querySelectorAll('svg [role="button"]')).toHaveLength(0);
    expect(getLabelTexts(container).some((t) => t.startsWith('Other'))).toBe(false);
  });

  it('lets getGroupLabel name the group', () => {
    const { container } = renderSankey({
      getGroupLabel: ({ members }) => `Other methods (${members.length})`,
    });
    // The chip may truncate a long label; the accessible name always carries it in full.
    expect(getGroupButton(container).getAttribute('aria-label')).toBe(
      'Other methods (6), 6 grouped nodes',
    );
    expect(getLabelTexts(container).some((t) => t.startsWith('Other met'))).toBe(true);
  });

  it('has no accessibility violations', async () => {
    const { container } = renderSankey();
    await assertAccessible(container);
  });
});

describe('SankeyChart — grouping: expand and fold', () => {
  it('reveals the members in place when the group label is clicked and reports the change', () => {
    const onExpandChange = jest.fn();
    const { container } = renderSankey({ onExpandChange });

    fireEvent.click(getGroupButton(container));

    expect(onExpandChange).toHaveBeenCalledTimes(1);
    expect(onExpandChange).toHaveBeenCalledWith({
      expandedGroupIds: [GROUP_ID],
      groupId: GROUP_ID,
      isExpanded: true,
      memberIds: ['wallet', 'netbanking', 'emi', 'bnpl', 'paylater', 'cod'],
    });
    expect(getLabelTexts(container).some((t) => t.startsWith('Other'))).toBe(false);
    // Every revealed member's label is a button (named after the member) that folds the group again.
    const revealedNames = getRevealedButtons(container).map((b) => b.getAttribute('aria-label'));
    expect(revealedNames).toEqual(
      ['Wallet', 'Netbanking', 'EMI', 'BNPL', 'Pay Later', 'Cash on delivery'].map(
        (name) => `${name}, grouped node`,
      ),
    );
  });

  it('keeps the bars of untouched nodes at exactly the same size after expanding', () => {
    const { container } = renderSankey();
    const before = ['UPI', 'Card', 'Captured', 'Failed'].map((n) => getBarHeight(container, n));

    fireEvent.click(getGroupButton(container));

    const after = ['UPI', 'Card', 'Captured', 'Failed'].map((n) => getBarHeight(container, n));
    expect(after).toEqual(before);
  });

  it('gives every revealed member room for its label and grows the drawing', () => {
    const { container } = renderSankey();
    fireEvent.click(getGroupButton(container));

    const svg = container.querySelector('svg')!;
    // 10 nodes in the method column need 10 chips + 9 gaps; that is more than 400px allows at
    // the folded scale, so the drawing grows below the 400px container.
    expect(parseFloat(svg.getAttribute('height') ?? '0')).toBeGreaterThan(400);

    // Chips in the method column never overlap: sort by y and check each starts below the previous.
    const chips = Array.from(container.querySelectorAll<SVGRectElement>('svg rect[stroke]'))
      .map((rect) => ({
        x: parseFloat(rect.getAttribute('x') ?? '0'),
        y: parseFloat(rect.getAttribute('y') ?? '0'),
        height: parseFloat(rect.getAttribute('height') ?? '0'),
      }))
      .filter(
        (chip, _, all) =>
          Math.abs(chip.x - all.map((c) => c.x).sort((a, b) => a - b)[Math.floor(all.length / 2)]) <
          1,
      )
      .sort((a, b) => a.y - b.y);
    for (let i = 1; i < chips.length; i++) {
      expect(chips[i].y).toBeGreaterThanOrEqual(chips[i - 1].y + chips[i - 1].height - 1e-6);
    }
  });

  it('folds the group again when a revealed member label is clicked', () => {
    const onExpandChange = jest.fn();
    const { container } = renderSankey({ onExpandChange });
    fireEvent.click(getGroupButton(container));
    fireEvent.click(getRevealedButtons(container)[0]);

    expect(onExpandChange).toHaveBeenLastCalledWith({
      expandedGroupIds: [],
      groupId: GROUP_ID,
      isExpanded: false,
      memberIds: ['wallet', 'netbanking', 'emi', 'bnpl', 'paylater', 'cod'],
    });
    expect(getLabelTexts(container).some((t) => t.startsWith('Other (6)'))).toBe(true);
  });

  it('toggles with Enter and Space on the keyboard', () => {
    const { container } = renderSankey();
    fireEvent.keyDown(getGroupButton(container), { key: 'Enter' });
    expect(getRevealedButtons(container)).toHaveLength(6);
    fireEvent.keyDown(getRevealedButtons(container)[0], { key: ' ' });
    expect(getRevealedButtons(container)).toHaveLength(0);
  });

  it('starts expanded with defaultExpandedGroupIds', () => {
    const { container } = renderSankey({ defaultExpandedGroupIds: [GROUP_ID] });
    expect(getRevealedButtons(container)).toHaveLength(6);
  });

  it('stays folded in controlled mode until the parent updates expandedGroupIds', () => {
    const onExpandChange = jest.fn();
    // A parent that reports the change but keeps its own state — the chart must follow the prop.
    const Frozen = (): React.ReactElement => (
      <ChartSankeyWrapper>
        <ChartSankey
          data={data}
          groupNodesBelow={2}
          expandedGroupIds={[]}
          onExpandChange={onExpandChange}
        />
      </ChartSankeyWrapper>
    );
    const frozen = renderWithTheme(<Frozen />);
    fireEvent.click(getGroupButton(frozen.container));
    expect(onExpandChange).toHaveBeenCalledWith(expect.objectContaining({ isExpanded: true }));
    expect(getRevealedButtons(frozen.container)).toHaveLength(0);
    frozen.unmount();

    // A parent that applies the reported ids — the chart expands on the next render.
    const Applied = (): React.ReactElement => {
      const [ids, setIds] = React.useState<string[]>([]);
      return (
        <ChartSankeyWrapper>
          <ChartSankey
            data={data}
            groupNodesBelow={2}
            expandedGroupIds={ids}
            onExpandChange={(event) => setIds(event.expandedGroupIds)}
          />
        </ChartSankeyWrapper>
      );
    };
    const applied = renderWithTheme(<Applied />);
    fireEvent.click(getGroupButton(applied.container));
    expect(getRevealedButtons(applied.container)).toHaveLength(6);
  });

  it('does not fire onNodeClick for a group but does for a revealed member bar', () => {
    const onNodeClick = jest.fn();
    const { container } = renderSankey({ onNodeClick });
    const groupBar = getGroupButton(container)
      .closest('g[opacity]')!
      .querySelector('rect:not([stroke])')!;
    fireEvent.click(groupBar);
    expect(onNodeClick).not.toHaveBeenCalled();
    // The group expanded on that click; now click Wallet's bar.
    const walletText = Array.from(container.querySelectorAll('svg text')).find((t) =>
      t.textContent?.startsWith('Wallet'),
    )!;
    fireEvent.click(walletText.closest('g[opacity]')!.querySelector('rect:not([stroke])')!);
    expect(onNodeClick).toHaveBeenCalledWith(nodes[3], 3);
  });

  it('reports an aggregated link with the group id and its first constituent index', () => {
    const onLinkClick = jest.fn();
    const { container } = renderSankey({ onLinkClick });
    // Ribbons only — the group's chevron icon is a path too, tagged as a Blade svg-path.
    const paths = Array.from(container.querySelectorAll('svg path:not([data-blade-component])'));
    // Folded: Total→UPI, Total→Card, Total→Other, UPI→…, Card→…, Other→Captured, Other→Failed = 9
    expect(paths).toHaveLength(9);
    fireEvent.click(paths[2]);
    expect(onLinkClick).toHaveBeenCalledWith({ source: 'total', target: GROUP_ID, value: 600 }, 2);
  });
});

describe('SankeyChart — grouping: tooltip', () => {
  it('lists the members and their shares when the group is hovered', () => {
    const { container } = renderSankey();
    fireEvent.mouseEnter(getGroupButton(container).closest('g[opacity]')!);
    const tooltip = container.querySelector('[data-blade-component="ChartSankeyTooltip"]')!;
    expect(tooltip).not.toBeNull();
    const text = tooltip.textContent ?? '';
    expect(text).toContain('Other (6)');
    expect(text).toContain('600 txn · 6%');
    expect(text).toContain('Wallet  1.9%');
    expect(text).toContain('Cash on delivery  0.3%');
    expect(text).not.toContain('more');
  });

  it('collapses a long member list into "and n more"', () => {
    const many: SankeyDataNode[] = [
      { id: 'total', name: 'Total' },
      { id: 'big', name: 'Big' },
      ...Array.from({ length: 8 }, (_, i) => ({ id: `s${i}`, name: `Small ${i}` })),
    ];
    const manyLinks: SankeyDataLink[] = [
      { source: 'total', target: 'big', value: 9200 },
      ...Array.from({ length: 8 }, (_, i) => ({ source: 'total', target: `s${i}`, value: 100 })),
    ];
    const { container } = renderWithTheme(
      <ChartSankeyWrapper>
        <ChartSankey data={{ nodes: many, links: manyLinks }} groupNodesBelow={2} />
      </ChartSankeyWrapper>,
    );
    fireEvent.mouseEnter(getGroupButton(container).closest('g[opacity]')!);
    const text =
      container.querySelector('[data-blade-component="ChartSankeyTooltip"]')?.textContent ?? '';
    expect(text).toContain('Small 5  1%');
    expect(text).not.toContain('Small 6');
    expect(text).toContain('and 2 more');
  });
});
