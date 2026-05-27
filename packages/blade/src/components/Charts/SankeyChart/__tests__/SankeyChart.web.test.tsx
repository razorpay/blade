/**
 * SankeyChart tests
 *
 * Run with: SHARD='' yarn test:react --testPathPattern=SankeyChart
 */
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { ChartSankeyWrapper, ChartSankey } from '../SankeyChart';
import type { SankeyDataNode } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

// ── ResponsiveContainer mock ───────────────────────────────────────────────────
// Recharts' ResponsiveContainer uses ResizeObserver internally, which jsdom
// does not support. Bypassing it by passing fixed dimensions directly to the
// Sankey component makes rendering fully synchronous — no waitFor needed,
// no open handles, Jest exits cleanly.
jest.mock('recharts', () => {
  const Recharts = jest.requireActual('recharts');
  // require('react') inside the factory runs after jest.mock hoisting,
  // so React is available at call time.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { cloneElement, Children } = require('react');
  return {
    ...Recharts,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ResponsiveContainer: ({ children, height }: { children: any; height?: number }) =>
      cloneElement(Children.only(children), { width: 800, height: height ?? 400 }),
  };
});

// ── Test data ──────────────────────────────────────────────────────────────────

const nodes = [
  { id: 'total', name: 'Total' },
  { id: 'upi', name: 'UPI' },
  { id: 'card', name: 'Card' },
  { id: 'successful', name: 'Successful' },
  { id: 'failed', name: 'Failed' },
];

const links = [
  { source: 'total', target: 'upi', value: 4000 },
  { source: 'total', target: 'card', value: 3200 },
  { source: 'upi', target: 'successful', value: 3500 },
  { source: 'upi', target: 'failed', value: 500 },
  { source: 'card', target: 'successful', value: 2800 },
  { source: 'card', target: 'failed', value: 400 },
];

const data = { nodes, links };

// ── Helpers ────────────────────────────────────────────────────────────────────

const renderSankey = (wrapperProps = {}, sankeyProps = {}): ReturnType<typeof renderWithTheme> =>
  renderWithTheme(
    <ChartSankeyWrapper {...wrapperProps}>
      <ChartSankey data={data} {...sankeyProps} />
    </ChartSankeyWrapper>,
  );

afterEach(() => jest.clearAllMocks());

// ── Rendering ──────────────────────────────────────────────────────────────────

describe('SankeyChart — rendering', () => {
  it('renders without crashing', () => {
    const { container } = renderSankey();
    expect(container).toBeTruthy();
  });

  it('sets data-blade-component attribute on wrapper for analytics', () => {
    const { container } = renderSankey();
    expect(container.querySelector('[data-blade-component="ChartSankeyWrapper"]')).toBeTruthy();
  });

  it('renders the correct number of node rects after layout', () => {
    const { container } = renderSankey();
    expect(container.querySelectorAll('svg rect').length).toBeGreaterThanOrEqual(nodes.length);
  });

  it('renders the correct number of link paths', () => {
    const { container } = renderSankey();
    expect(container.querySelectorAll('svg path')).toHaveLength(links.length);
  });

  it('renders label chips with node names when showLabels is true', () => {
    const { container } = renderSankey({}, { showLabels: true });
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    expect(texts).toContain('Total');
    expect(texts).toContain('UPI');
    expect(texts.some((t) => t.includes('Successful'))).toBe(true);
  });

  it('does not render label chips when showLabels is false', () => {
    const { container } = renderSankey({}, { showLabels: false });
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    expect(texts).not.toContain('Total');
  });

  it('appends labelUnit to node value in chip', () => {
    const { container } = renderSankey({}, { showLabels: true, labelUnit: 'txn' });
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    expect(texts.some((t) => t.includes('txn'))).toBe(true);
  });

  it('accepts testID and renders it as data-testid', () => {
    const { container } = renderSankey({ testID: 'sankey-chart' });
    expect(container.querySelector('[data-testid="sankey-chart"]')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { container } = renderSankey();
    expect(container).toMatchSnapshot();
  });

  it('has no accessibility violations', async () => {
    const { container } = renderSankey();
    await assertAccessible(container);
  });

  it('does not show percentage when showPercentage is false', () => {
    const { container } = renderSankey(
      {},
      { showLabels: true, showPercentage: false, labelUnit: 'txn' },
    );
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    // When showPercentage is false, no text should contain a '%' character
    expect(texts.every((t) => !t.includes('%'))).toBe(true);
  });

  it('renders plain SVG text labels when showLabelChip is false', () => {
    const { container } = renderSankey({}, { showLabels: true, showLabelChip: false });
    // Plain text mode renders <text> elements, not foreignObject chip cards
    const foreignObjects = container.querySelectorAll('foreignObject');
    expect(foreignObjects).toHaveLength(0);
    // Node names still appear as SVG text
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    expect(texts.some((t) => t.includes('Total') || t.includes('UPI'))).toBe(true);
  });
});

// ── Interactivity ──────────────────────────────────────────────────────────────

describe('SankeyChart — interactivity', () => {
  it('calls onNodeClick with the correct node and index when a node rect is clicked', () => {
    const handleNodeClick = jest.fn();
    const { container } = renderSankey({}, { onNodeClick: handleNodeClick });

    const rects = container.querySelectorAll('svg rect');
    fireEvent.click(rects[0]);

    expect(handleNodeClick).toHaveBeenCalledTimes(1);
    // Validate correctness: the returned node must exist in our test dataset,
    // not just have the right shape. expect.any(String) would pass for any node.
    const [clickedNode, clickedIndex] = handleNodeClick.mock.calls[0] as [SankeyDataNode, number];
    const matchingNode = nodes.find((n) => n.id === clickedNode.id);
    expect(matchingNode).toBeDefined();
    expect(clickedNode.name).toBe(matchingNode?.name);
    expect(clickedIndex).toBeGreaterThanOrEqual(0);
    expect(clickedIndex).toBeLessThan(nodes.length);
  });

  it('calls onLinkClick with the correct link and index when a link path is clicked', () => {
    const handleLinkClick = jest.fn();
    const { container } = renderSankey({}, { onLinkClick: handleLinkClick });

    const paths = container.querySelectorAll('svg path');
    fireEvent.click(paths[0]);

    expect(handleLinkClick).toHaveBeenCalledTimes(1);
    expect(handleLinkClick).toHaveBeenCalledWith(
      expect.objectContaining({
        source: expect.any(String),
        target: expect.any(String),
        value: expect.any(Number),
      }),
      0,
    );
  });

  it('does not show tooltip when showTooltip is false', () => {
    const { container } = renderSankey({ showTooltip: false });
    const firstRect = container.querySelector('svg rect')!;
    fireEvent.mouseEnter(firstRect);
    const tooltipContent = container.querySelector(
      '[data-blade-component="ChartSankeyWrapper"] > div > div[style*="position: absolute"]',
    );
    expect(tooltipContent).toBeNull();
  });

  it('renders node groups with opacity attribute wired up for hover dimming', () => {
    const { container } = renderSankey();
    // Node groups carry an `opacity` attribute that the hover handler mutates.
    // At rest, all groups should be fully opaque (opacity === 1).
    const groups = Array.from(container.querySelectorAll('svg g[opacity]'));
    expect(groups.length).toBeGreaterThan(0);
    groups.forEach((g) => {
      expect(parseFloat(g.getAttribute('opacity') ?? '1')).toBe(1);
    });
  });
});

// ── Color resolution ───────────────────────────────────────────────────────────

describe('SankeyChart — color token resolution', () => {
  it('applies nodeColorOverride to all node rects with a single resolved color', () => {
    const { container } = renderSankey(
      { nodeColorOverride: 'data.background.categorical.blue.intense' },
      { showLabels: false },
    );
    const allRects = Array.from(container.querySelectorAll('svg rect'));
    const fills = new Set(allRects.map((r) => r.getAttribute('fill')).filter(Boolean));
    // All nodes should share the same single resolved fill color
    expect(fills.size).toBe(1);
    // The resolved fill should be a real CSS color (not a Blade token string like 'data.background...')
    const [fill] = fills;
    expect(fill).toMatch(/^#|^rgb|^hsl/);
  });

  it('applies linkColorOverride to all link paths with a single resolved color', () => {
    const { container } = renderSankey(
      { linkColorOverride: 'data.background.categorical.blue.subtle' },
      { showLabels: false },
    );
    const allPaths = Array.from(container.querySelectorAll('svg path'));
    const fills = new Set(allPaths.map((p) => p.getAttribute('fill')).filter(Boolean));
    expect(fills.size).toBe(1);
    const [fill] = fills;
    expect(fill).toMatch(/^#|^rgb|^hsl/);
  });

  it('applies per-node color from node.color field when no nodeColorOverride is set', () => {
    const coloredNodes = [
      { id: 'a', name: 'A', color: 'data.background.categorical.green.moderate' as const },
      { id: 'b', name: 'B' },
    ];
    const { container } = renderWithTheme(
      <ChartSankeyWrapper>
        <ChartSankey
          data={{ nodes: coloredNodes, links: [{ source: 'a', target: 'b', value: 100 }] }}
          showLabels={false}
        />
      </ChartSankeyWrapper>,
    );
    const rects = Array.from(container.querySelectorAll('svg rect'));
    const fills = new Set(rects.map((r) => r.getAttribute('fill')).filter(Boolean));
    // Node A has a custom color, node B gets a palette color — so fills should differ
    expect(fills.size).toBeGreaterThan(1);
  });

  it('renders with default categorical colors without crashing', () => {
    const { container } = renderSankey();
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

// ── Layout ─────────────────────────────────────────────────────────────────────

describe('SankeyChart — layout', () => {
  it('renders scroll wrapper with minWidth constraint via styled-component class', () => {
    const { container } = renderSankey();
    // BaseBox applies minWidth as a CSS class (styled-components), not inline style.
    // We verify it is present in the computed styles of one of the wrapper divs.
    const divs = Array.from(container.querySelectorAll('div'));
    const hasMinWidth = divs.some((div) => {
      const computed = window.getComputedStyle(div).minWidth;
      return computed && computed !== '0px' && computed !== '';
    });
    expect(hasMinWidth).toBe(true);
  });
});

// ── Edge cases ─────────────────────────────────────────────────────────────────

describe('SankeyChart — edge cases', () => {
  it('renders gracefully with a minimal 2-node graph', () => {
    const { container } = renderWithTheme(
      <ChartSankeyWrapper>
        <ChartSankey
          data={{
            nodes: [
              { id: 'a', name: 'A' },
              { id: 'b', name: 'B' },
            ],
            links: [{ source: 'a', target: 'b', value: 100 }],
          }}
        />
      </ChartSankeyWrapper>,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders without crashing when links array is empty', () => {
    expect(() =>
      renderWithTheme(
        <ChartSankeyWrapper>
          <ChartSankey
            data={{
              nodes: [{ id: 'x', name: 'Orphan' }],
              links: [],
            }}
          />
        </ChartSankeyWrapper>,
      ),
    ).not.toThrow();
  });

  it('silently ignores links that reference unknown node ids', () => {
    const { container } = renderWithTheme(
      <ChartSankeyWrapper>
        <ChartSankey
          data={{
            nodes,
            links: [...links, { source: 'nonexistent', target: 'also-missing', value: 999 }],
          }}
        />
      </ChartSankeyWrapper>,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('throws a Blade error when ChartSankey is rendered outside ChartSankeyWrapper', () => {
    // Suppress the expected console.error from React's error boundary during the throw
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderWithTheme(<ChartSankey data={{ nodes, links }} />)).toThrow();
    consoleError.mockRestore();
  });
});
