/**
 * SankeyChart tests
 *
 * Run with: SHARD='' yarn test:react --testPathPattern=SankeyChart
 */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { SankeyChart } from '../SankeyChart.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// ── Snapshot normaliser ────────────────────────────────────────────────────────
function normalizeSnapshotIds(html: string): string {
  return html
    .replace(/id="[^"]*"/g, 'id="NORMALIZED"')
    .replace(/clip-path="[^"]*"/g, 'clip-path="NORMALIZED"')
    .replace(/url\([^)]*\)/g, 'url(NORMALIZED)');
}

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

// ── ResizeObserver mock ────────────────────────────────────────────────────────
// jsdom has no ResizeObserver; fire callback with 800px width so the SVG renders.
beforeAll(() => {
  global.ResizeObserver = class {
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
    constructor(cb: ResizeObserverCallback) {
      setTimeout(() => {
        cb([{ contentRect: { width: 800, height: 400 } } as ResizeObserverEntry], this);
      }, 0);
    }
  };
});

afterEach(() => jest.clearAllMocks());

// ── Helpers ────────────────────────────────────────────────────────────────────

/** waitFor that actually waits — throws until the element exists. */
const waitForSvg = (container: HTMLElement): Promise<void> =>
  waitFor(() => {
    expect(container.querySelector('svg')).toBeTruthy();
  });

const waitForRects = (container: HTMLElement): Promise<void> =>
  waitFor(() => {
    expect(container.querySelector('svg rect')).toBeTruthy();
  });

const waitForPaths = (container: HTMLElement): Promise<void> =>
  waitFor(() => {
    expect(container.querySelector('svg path')).toBeTruthy();
  });

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

  it('renders the correct number of node rects after layout', async () => {
    const { container } = renderWithTheme(<SankeyChart data={data} />);
    await waitFor(() => {
      expect(container.querySelectorAll('svg rect').length).toBeGreaterThanOrEqual(nodes.length);
    });
  });

  it('renders the correct number of link paths', async () => {
    const { container } = renderWithTheme(<SankeyChart data={data} />);
    await waitFor(() => {
      expect(container.querySelectorAll('svg path')).toHaveLength(links.length);
    });
  });

  it('renders label chips with node names when showLabels is true', async () => {
    const { container } = renderWithTheme(<SankeyChart data={data} showLabels={true} />);
    // Labels are SVG <tspan> elements — query by textContent
    await waitFor(() => {
      const tspans = Array.from(container.querySelectorAll('tspan'));
      const texts = tspans.map((t) => t.textContent ?? '');
      expect(texts).toContain('Total');
      expect(texts).toContain('UPI');
      expect(texts.some((t) => t.includes('Successful'))).toBe(true);
    });
  });

  it('does not render label chips when showLabels is false', async () => {
    const { container } = renderWithTheme(<SankeyChart data={data} showLabels={false} />);
    await waitForSvg(container);
    // No tspan elements should contain node names
    const tspans = Array.from(container.querySelectorAll('tspan'));
    const texts = tspans.map((t) => t.textContent ?? '');
    expect(texts).not.toContain('Total');
  });

  it('appends labelUnit to node value in chip', async () => {
    const { container } = renderWithTheme(
      <SankeyChart data={data} showLabels={true} labelUnit="txn" />,
    );
    await waitFor(() => {
      // tspan elements should include the unit text
      const tspans = Array.from(container.querySelectorAll('tspan'));
      const texts = tspans.map((t) => t.textContent ?? '');
      expect(texts.some((t) => t.includes('txn'))).toBe(true);
    });
  });

  it('accepts testID and renders it as data-testid', () => {
    const { container } = renderWithTheme(<SankeyChart data={data} testID="sankey-chart" />);
    expect(container.querySelector('[data-testid="sankey-chart"]')).toBeTruthy();
  });
});

// ── Interactivity ──────────────────────────────────────────────────────────────

describe('SankeyChart — interactivity', () => {
  it('calls onNodeClick with the correct node and index when a node rect is clicked', async () => {
    const handleNodeClick = jest.fn();
    const { container } = renderWithTheme(
      <SankeyChart data={data} onNodeClick={handleNodeClick} />,
    );

    await waitForRects(container);

    const rects = container.querySelectorAll('svg rect');
    fireEvent.click(rects[0]);

    expect(handleNodeClick).toHaveBeenCalledTimes(1);
    expect(handleNodeClick).toHaveBeenCalledWith(
      expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
      expect.any(Number),
    );
  });

  it('calls onLinkClick with the correct link and index when a link path is clicked', async () => {
    const handleLinkClick = jest.fn();
    const { container } = renderWithTheme(
      <SankeyChart data={data} onLinkClick={handleLinkClick} />,
    );

    await waitForPaths(container);

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

  it('shows tooltip on node hover when showTooltip is true', async () => {
    const { container } = renderWithTheme(<SankeyChart data={data} showTooltip={true} />);

    await waitForRects(container);

    const firstRect = container.querySelector('svg rect')!;
    fireEvent.mouseEnter(firstRect, { clientX: 100, clientY: 100 });

    await waitFor(() => {
      expect(container.querySelectorAll('[style*="position: absolute"]').length).toBeGreaterThan(0);
    });
  });

  it('does not show tooltip on hover when showTooltip is false', async () => {
    const { container } = renderWithTheme(<SankeyChart data={data} showTooltip={false} />);

    await waitForRects(container);

    const firstRect = container.querySelector('svg rect')!;
    fireEvent.mouseEnter(firstRect);

    const tooltipContent = container.querySelector(
      '[data-blade-component="SankeyChart"] > div > div[style*="position: absolute"]',
    );
    expect(tooltipContent).toBeNull();
  });

  it('hides tooltip on mouse leave', async () => {
    const { container } = renderWithTheme(<SankeyChart data={data} showTooltip={true} />);

    await waitForRects(container);

    const firstRect = container.querySelector('svg rect')!;
    fireEvent.mouseEnter(firstRect, { clientX: 100, clientY: 100 });
    fireEvent.mouseLeave(firstRect);

    await waitFor(() => {
      const tooltip = container.querySelector('[style*="position: absolute"]');
      if (tooltip) {
        expect((tooltip as HTMLElement).style.visibility).not.toBe('visible');
      }
    });
  });
});

// ── Color resolution ───────────────────────────────────────────────────────────

describe('SankeyChart — color token resolution', () => {
  it('applies nodeColorOverride to all node rects', async () => {
    const { container } = renderWithTheme(
      <SankeyChart
        data={data}
        nodeColorOverride="data.background.categorical.blue.intense"
        showLabels={false}
      />,
    );

    await waitForRects(container);

    const allRects = Array.from(container.querySelectorAll('svg rect'));
    const fills = new Set(allRects.map((r) => r.getAttribute('fill')).filter(Boolean));
    expect(fills.size).toBe(1);
  });

  it('renders with default categorical colors without crashing', async () => {
    const { container } = renderWithTheme(<SankeyChart data={data} />);
    await waitForSvg(container);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

// ── Edge cases ─────────────────────────────────────────────────────────────────

describe('SankeyChart — edge cases', () => {
  it('renders gracefully with a minimal 2-node graph', async () => {
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
    await waitForSvg(container);
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

  it('silently ignores links that reference unknown node ids', async () => {
    const { container } = renderWithTheme(
      <SankeyChart
        data={{
          nodes,
          links: [...links, { source: 'nonexistent', target: 'also-missing', value: 999 }],
        }}
      />,
    );
    await waitForSvg(container);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

// ── Snapshots ──────────────────────────────────────────────────────────────────

describe('SankeyChart — snapshots', () => {
  it('matches snapshot for default chart (pre-resize, no SVG)', () => {
    const { container } = renderWithTheme(
      <SankeyChart data={data} showLabels={true} labelUnit="txn" />,
    );
    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });

  it('matches snapshot after layout resolves', async () => {
    const { container } = renderWithTheme(
      <SankeyChart data={data} showLabels={true} labelUnit="txn" />,
    );
    await waitForSvg(container);
    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });

  it('matches snapshot with color overrides', async () => {
    const { container } = renderWithTheme(
      <SankeyChart
        data={data}
        nodeColorOverride="data.background.categorical.blue.intense"
        linkColorOverride="data.background.categorical.blue.subtle"
        showLabels={true}
        labelUnit="txn"
      />,
    );
    await waitForSvg(container);
    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });
});
