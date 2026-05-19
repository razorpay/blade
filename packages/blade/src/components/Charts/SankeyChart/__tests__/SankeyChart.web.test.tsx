/**
 * SankeyChart tests
 *
 * Run with: SHARD='' yarn test:react --testPathPattern=SankeyChart
 */
import React from 'react';
import { fireEvent } from '@testing-library/react';
import { SankeyChart } from '../SankeyChart.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

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

afterEach(() => jest.clearAllMocks());

// ── Rendering ──────────────────────────────────────────────────────────────────

describe('SankeyChart — rendering', () => {
  it('renders without crashing', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} />);
    expect(container).toBeTruthy();
  });

  it('sets data-blade-component attribute for analytics', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} />);
    expect(container.querySelector('[data-blade-component="SankeyChart"]')).toBeTruthy();
  });

  it('renders the correct number of node rects after layout', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} />);
    expect(container.querySelectorAll('svg rect').length).toBeGreaterThanOrEqual(nodes.length);
  });

  it('renders the correct number of link paths', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} />);
    expect(container.querySelectorAll('svg path')).toHaveLength(links.length);
  });

  it('renders label chips with node names when showLabels is true', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} showLabels={true} />);
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    expect(texts).toContain('Total');
    expect(texts).toContain('UPI');
    expect(texts.some((t) => t.includes('Successful'))).toBe(true);
  });

  it('does not render label chips when showLabels is false', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} showLabels={false} />);
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    expect(texts).not.toContain('Total');
  });

  it('appends labelUnit to node value in chip', () => {
    const { container } = renderWithTheme(
      <SankeyChart data={data} showLabels={true} labelUnit="txn" />,
    );
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    expect(texts.some((t) => t.includes('txn'))).toBe(true);
  });

  it('accepts testID and renders it as data-testid', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} testID="sankey-chart" />);
    expect(container.querySelector('[data-testid="sankey-chart"]')).toBeTruthy();
  });
});

// ── Interactivity ──────────────────────────────────────────────────────────────

describe('SankeyChart — interactivity', () => {
  it('calls onNodeClick with the correct node and index when a node rect is clicked', () => {
    const handleNodeClick = jest.fn();
    const { container } = renderWithTheme(
      <SankeyChart data={data} onNodeClick={handleNodeClick} />,
    );

    const rects = container.querySelectorAll('svg rect');
    fireEvent.click(rects[0]);

    expect(handleNodeClick).toHaveBeenCalledTimes(1);
    expect(handleNodeClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
      expect.any(Number),
    );
  });

  it('calls onLinkClick with the correct link and index when a link path is clicked', () => {
    const handleLinkClick = jest.fn();
    const { container } = renderWithTheme(
      <SankeyChart data={data} onLinkClick={handleLinkClick} />,
    );

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
    const { container } = renderWithTheme(<SankeyChart data={data} showTooltip={false} />);
    const firstRect = container.querySelector('svg rect')!;
    fireEvent.mouseEnter(firstRect);
    const tooltipContent = container.querySelector(
      '[data-blade-component="SankeyChart"] > div > div[style*="position: absolute"]',
    );
    expect(tooltipContent).toBeNull();
  });
});

// ── Color resolution ───────────────────────────────────────────────────────────

describe('SankeyChart — color token resolution', () => {
  it('applies nodeColorOverride to all node rects', () => {
    const { container } = renderWithTheme(
      <SankeyChart
        data={data}
        nodeColorOverride="data.background.categorical.blue.intense"
        showLabels={false}
      />,
    );
    const allRects = Array.from(container.querySelectorAll('svg rect'));
    const fills = new Set(allRects.map((r) => r.getAttribute('fill')).filter(Boolean));
    expect(fills.size).toBe(1);
  });

  it('renders with default categorical colors without crashing', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

// ── Edge cases ─────────────────────────────────────────────────────────────────

describe('SankeyChart — edge cases', () => {
  it('renders gracefully with a minimal 2-node graph', () => {
    const { container } = renderWithTheme(
      <SankeyChart
        data={{
          nodes: [
            { id: 'a', name: 'A' },
            { id: 'b', name: 'B' },
          ],
          links: [{ source: 'a', target: 'b', value: 100 }],
        }}
      />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders without crashing when links array is empty', () => {
    expect(() =>
      renderWithTheme(
        <SankeyChart
          data={{
            nodes: [{ id: 'x', name: 'Orphan' }],
            links: [],
          }}
        />,
      ),
    ).not.toThrow();
  });

  it('silently ignores links that reference unknown node ids', () => {
    const { container } = renderWithTheme(
      <SankeyChart
        data={{
          nodes,
          links: [...links, { source: 'nonexistent', target: 'also-missing', value: 999 }],
        }}
      />,
    );
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
