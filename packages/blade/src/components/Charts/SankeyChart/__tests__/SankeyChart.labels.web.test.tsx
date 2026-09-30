/**
 * SankeyChart label tests — density, colour indicator, single-line truncation, share format,
 * and right-margin behaviour.
 *
 * jsdom has no canvas, so `calculateTextWidth` is mocked with a character-count measurer.
 * That makes chip widths deterministic and lets truncation be asserted exactly.
 *
 * Run with: SHARD='' yarn test:react --testPathPattern=SankeyChart.labels
 */
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { ChartSankeyWrapper, ChartSankey } from '../SankeyChart';
import type { ChartSankeyProps, SankeyDataLink, SankeyDataNode } from '../types';
import { LABEL_COLUMN_CLEARANCE, LABEL_MAX_WIDTH } from '../tokens';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// The chart width ResponsiveContainer would measure; a test may narrow it and must restore it.
let mockContainerWidth = 800;
jest.mock('recharts', () => {
  const Recharts = jest.requireActual('recharts');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { cloneElement, Children } = require('react');
  return {
    ...Recharts,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ResponsiveContainer: ({ children, height }: { children: any; height?: number }) =>
      cloneElement(Children.only(children), { width: mockContainerWidth, height: height ?? 400 }),
  };
});

// 7px per character regardless of weight — close to Inter at 12px and, crucially, monotonic.
const CHAR_WIDTH = 7;
jest.mock('../../CommonChartComponents/utils', () => ({
  calculateTextWidth: (text: string) => ({ width: text.length * CHAR_WIDTH, displayText: text }),
}));

const nodes: SankeyDataNode[] = [
  { id: 'total', name: 'Total' },
  { id: 'upi', name: 'UPI' },
  { id: 'card', name: 'Card' },
  { id: 'successful', name: 'Successful' },
  { id: 'failed', name: 'Failed' },
];

const links: SankeyDataLink[] = [
  { source: 'total', target: 'upi', value: 4000 },
  { source: 'total', target: 'card', value: 3200 },
  { source: 'upi', target: 'successful', value: 3500 },
  { source: 'upi', target: 'failed', value: 500 },
  { source: 'card', target: 'successful', value: 2800 },
  { source: 'card', target: 'failed', value: 400 },
];

const renderSankey = (
  sankeyProps: Partial<ChartSankeyProps> = {},
  data: ChartSankeyProps['data'] = { nodes, links },
): ReturnType<typeof renderWithTheme> =>
  renderWithTheme(
    <ChartSankeyWrapper>
      <ChartSankey data={data} labelUnit="txn" {...sankeyProps} />
    </ChartSankeyWrapper>,
  );

// Chip backgrounds are the only rects with a stroke; node bars have none.
const getChipRects = (container: HTMLElement): SVGRectElement[] =>
  Array.from(container.querySelectorAll<SVGRectElement>('svg rect[stroke]'));

const getTspanTexts = (container: HTMLElement): string[] =>
  Array.from(container.querySelectorAll('tspan')).map((t) => t.textContent ?? '');

describe('SankeyChart — label density', () => {
  it('renders 28px chips by default (27px rect inside a 1px border)', () => {
    const { container } = renderSankey();
    const heights = new Set(getChipRects(container).map((r) => r.getAttribute('height')));
    expect(heights).toEqual(new Set(['27']));
  });

  it('renders 20px chips for labelDensity="compact"', () => {
    const { container } = renderSankey({ labelDensity: 'compact' });
    const heights = new Set(getChipRects(container).map((r) => r.getAttribute('height')));
    expect(heights).toEqual(new Set(['19']));
  });

  it('keeps every label on a single line', () => {
    const longNames: SankeyDataNode[] = nodes.map((node) =>
      node.id === 'card' ? { ...node, name: 'Credit and debit cards issued abroad' } : node,
    );
    const { container } = renderSankey({}, { nodes: longNames, links });
    // A two-line label would render two positioned tspans (each with its own x/y attribute).
    const positionedTspans = container.querySelectorAll('tspan[x]');
    expect(positionedTspans).toHaveLength(0);
    const chipHeights = new Set(getChipRects(container).map((r) => r.getAttribute('height')));
    expect(chipHeights).toEqual(new Set(['27']));
  });
});

describe('SankeyChart — colour indicator', () => {
  it('renders no indicator dot by default', () => {
    const { container } = renderSankey();
    expect(container.querySelectorAll('svg circle')).toHaveLength(0);
  });

  it('renders one dot per node, filled with that node bar colour', () => {
    const { container } = renderSankey({ showColorIndicator: true });
    const groups = Array.from(container.querySelectorAll('svg g[opacity]'));
    expect(groups).toHaveLength(nodes.length);
    groups.forEach((group) => {
      const bar = group.querySelector('rect:not([stroke])');
      const dot = group.querySelector('circle');
      expect(dot).not.toBeNull();
      expect(dot?.getAttribute('fill')).toBe(bar?.getAttribute('fill'));
      expect(dot?.getAttribute('r')).toBe('4');
    });
  });

  it('renders the dot in plain-text mode too', () => {
    const { container } = renderSankey({ showColorIndicator: true, showLabelChip: false });
    expect(container.querySelectorAll('svg circle')).toHaveLength(nodes.length);
    expect(getChipRects(container)).toHaveLength(0);
  });
});

describe('SankeyChart — single-line truncation', () => {
  it('truncates a long name with an ellipsis and keeps the value text whole', () => {
    const longName = 'Netbanking through corporate current accounts';
    const longNames: SankeyDataNode[] = nodes.map((node) =>
      node.id === 'card' ? { ...node, name: longName } : node,
    );
    const { container } = renderSankey({}, { nodes: longNames, links });
    const texts = getTspanTexts(container);

    // The rendered name is a proper prefix of the full name followed by an ellipsis.
    const truncated = texts.find((t) => t.endsWith('…') && longName.startsWith(t.slice(0, -1)));
    expect(truncated).toBeDefined();
    expect(truncated?.length).toBeLessThan(longName.length);
    expect(texts).not.toContain(longName);
    // The value text for the card node (3200 of 7200) is intact next to the truncated name.
    expect(texts).toContain('3.2k txn  (44%)');
  });

  it('never renders a chip wider than the 200px label budget', () => {
    const longNames: SankeyDataNode[] = nodes.map((node) => ({
      ...node,
      name: `${node.name} with an unreasonably long descriptive suffix`,
    }));
    const { container } = renderSankey({}, { nodes: longNames, links });
    getChipRects(container).forEach((rect) => {
      // width attribute is chipW - 1px border
      expect(parseFloat(rect.getAttribute('width') ?? '0')).toBeLessThanOrEqual(199);
    });
  });
});

describe('SankeyChart — share formatting', () => {
  it('renders a share between 0 and 1 percent as <1%', () => {
    const skewed: ChartSankeyProps['data'] = {
      nodes: [
        { id: 'total', name: 'Total' },
        { id: 'big', name: 'Big' },
        { id: 'tiny', name: 'Tiny' },
      ],
      links: [
        { source: 'total', target: 'big', value: 9950 },
        { source: 'total', target: 'tiny', value: 50 },
      ],
    };
    const { container } = renderSankey({}, skewed);
    const texts = getTspanTexts(container);
    expect(texts.some((t) => t.includes('(<1%)'))).toBe(true);
    expect(texts.some((t) => t.includes('(0%)'))).toBe(false);
  });
});

describe('SankeyChart — right margin', () => {
  // Node x = depth * (chartWidth - nodeWidth) / maxDepth, and chartWidth shrinks with the
  // right margin. So a wide label in the LAST column must pull the last column left, while
  // the same wide label in the FIRST column must not.
  const lastColumnX = (container: HTMLElement): number => {
    const bars = Array.from(container.querySelectorAll<SVGRectElement>('svg rect:not([stroke])'));
    return Math.max(...bars.map((r) => parseFloat(r.getAttribute('x') ?? '0')));
  };
  // Wider than "Successful" yet short enough (without a unit) to fit the label budget, so the
  // chip genuinely grows instead of being truncated back to the same width.
  const widerName = 'Successful pa';

  it('reserves right margin for last-column labels only', () => {
    const wideLast: SankeyDataNode[] = nodes.map((node) =>
      node.id === 'successful' ? { ...node, name: widerName } : node,
    );
    const wideFirst: SankeyDataNode[] = nodes.map((node) =>
      node.id === 'total' ? { ...node, name: widerName } : node,
    );
    const noUnit = { labelUnit: undefined };
    const { container: lastContainer } = renderSankey(noUnit, { nodes: wideLast, links });
    const { container: firstContainer } = renderSankey(noUnit, { nodes: wideFirst, links });
    const { container: baseContainer } = renderSankey(noUnit);

    expect(lastColumnX(lastContainer)).toBeLessThan(lastColumnX(baseContainer));
    expect(lastColumnX(firstContainer)).toBe(lastColumnX(baseContainer));
  });

  it('uses only the bar gap as right margin when labels are hidden', () => {
    const { container: withLabels } = renderSankey();
    const { container: withoutLabels } = renderSankey({ showLabels: false });
    expect(lastColumnX(withoutLabels)).toBeGreaterThan(lastColumnX(withLabels));
  });
});

describe('SankeyChart — the full name of a truncated label', () => {
  const longName = 'Netbanking through corporate current accounts';
  const longNames: SankeyDataNode[] = nodes.map((node) =>
    node.id === 'card' ? { ...node, name: longName } : node,
  );

  it('gives assistive tech the full name and value on the label group', () => {
    const { container } = renderSankey({}, { nodes: longNames, links });
    const label = container.querySelector('svg [role="img"][aria-label^="Netbanking through"]');
    expect(label?.getAttribute('aria-label')).toBe(`${longName}, 3.2k txn (44%)`);
  });

  it('opens the node tooltip with the full name when the label itself is hovered', () => {
    const { container } = renderSankey({}, { nodes: longNames, links });
    const truncated = Array.from(container.querySelectorAll('tspan')).find((t) =>
      t.textContent?.endsWith('…'),
    )!;
    fireEvent.mouseEnter(truncated.closest('text')!);
    // The node's own tooltip: the full name with the node's value, not a ribbon's.
    expect(container.textContent).toContain(`${longName}: 3,200 txn`);
    // And the node's hover state: the other nodes dim.
    const opacities = Array.from(container.querySelectorAll('svg g[opacity]')).map((g) =>
      g.getAttribute('opacity'),
    );
    expect(opacities.some((o) => o !== '1')).toBe(true);
  });
});

describe('SankeyChart — labels stay clear of the next column', () => {
  const longNames: SankeyDataNode[] = nodes.map((node) => ({
    ...node,
    name: `${node.name} with an unreasonably long descriptive suffix`,
  }));
  const chipBoxes = (container: HTMLElement): Array<{ left: number; right: number }> =>
    getChipRects(container).map((rect) => {
      const left = parseFloat(rect.getAttribute('x') ?? '0');
      return { left, right: left + parseFloat(rect.getAttribute('width') ?? '0') };
    });
  const columnXs = (container: HTMLElement): number[] =>
    Array.from(
      new Set(
        Array.from(container.querySelectorAll<SVGRectElement>('svg rect:not([stroke])')).map((r) =>
          Math.round(parseFloat(r.getAttribute('x') ?? '0')),
        ),
      ),
    ).sort((a, b) => a - b);

  it('keeps the full 200px budget when the gap before the next column is wide enough', () => {
    const { container } = renderSankey({}, { nodes: longNames, links });
    const widest = Math.max(...chipBoxes(container).map((chip) => chip.right - chip.left));
    expect(widest).toBeGreaterThan(LABEL_MAX_WIDTH - 12);
  });

  it('shrinks middle-column labels to the gap on a narrow chart instead of overlapping', () => {
    mockContainerWidth = 600;
    try {
      const { container } = renderSankey({}, { nodes: longNames, links });
      const columns = columnXs(container);
      const chips = chipBoxes(container);
      chips.forEach((chip) => {
        const nextColumn = columns.find((x) => x > chip.left);
        // Every chip that has a column to its right ends before that column, clearance included.
        if (nextColumn !== undefined) {
          expect(chip.right).toBeLessThanOrEqual(nextColumn - LABEL_COLUMN_CLEARANCE + 1);
        }
      });
      const middle = chips.filter((chip) => columns.some((x) => x > chip.left));
      expect(middle.length).toBeGreaterThan(0);
      middle.forEach((chip) => expect(chip.right - chip.left).toBeLessThan(LABEL_MAX_WIDTH - 1));
    } finally {
      mockContainerWidth = 800;
    }
  });

  it('drops the share before the name when the gap leaves the name almost nothing', () => {
    mockContainerWidth = 560;
    try {
      const { container } = renderSankey({}, { nodes: longNames, links });
      const labels = Array.from(container.querySelectorAll('svg text')).map((text) =>
        Array.from(text.querySelectorAll('tspan')).map((t) => t.textContent ?? ''),
      );
      const middle = labels.filter(([name]) => name.startsWith('UPI') || name.startsWith('Card'));
      expect(middle).toHaveLength(2);
      middle.forEach(([name, value]) => {
        // A readable start of the name survives, the share is gone, the value is intact.
        expect(name.length).toBeGreaterThan(4);
        expect(value).not.toContain('%');
        expect(value).toMatch(/^[\d.]+k? txn$/);
      });
      // The last column still has the full budget, so it keeps its share.
      const last = labels.find(([name]) => name.startsWith('Successf'));
      expect(last?.[1]).toContain('%');
      // Assistive tech still gets the share.
      expect(
        container
          .querySelector('svg [role="img"][aria-label^="UPI with"]')
          ?.getAttribute('aria-label'),
      ).toContain('(56%)');
    } finally {
      mockContainerWidth = 800;
    }
  });
});
