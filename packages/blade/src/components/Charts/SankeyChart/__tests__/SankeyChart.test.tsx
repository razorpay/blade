/**
 * SankeyChart tests
 *
 * Run with: SHARD='' yarn test:react --testPathPattern=SankeyChart
 */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { SankeyChart } from '../SankeyChart.web';

// ── Snapshot normaliser ────────────────────────────────────────────────────────
function normalizeSnapshotIds(html: string): string {
  return html
    .replace(/id="[^"]*"/g, 'id="NORMALIZED"')
    .replace(/clip-path="[^"]*"/g, 'clip-path="NORMALIZED"')
    .replace(/url\([^)]*\)/g, 'url(NORMALIZED)');
}

// ── Test data ──────────────────────────────────────────────────────────────────

const levels = [
  { id: 'total', nodes: [{ id: 'total', name: 'Total' }] },
  {
    id: 'method',
    nodes: [
      { id: 'upi', name: 'UPI' },
      { id: 'card', name: 'Card' },
    ],
  },
  {
    id: 'status',
    nodes: [
      { id: 'successful', name: 'Successful' },
      { id: 'failed', name: 'Failed' },
    ],
  },
];

const links = [
  { from: 'total', to: 'upi', value: 4000 },
  { from: 'total', to: 'card', value: 3200 },
  { from: 'upi', to: 'successful', value: 3500 },
  { from: 'upi', to: 'failed', value: 500 },
  { from: 'card', to: 'successful', value: 2800 },
  { from: 'card', to: 'failed', value: 400 },
];

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
const waitForSvg = (container: HTMLElement) =>
  waitFor(() => {
    expect(container.querySelector('svg')).toBeTruthy();
  });

const waitForRects = (container: HTMLElement) =>
  waitFor(() => {
    expect(container.querySelector('svg rect')).toBeTruthy();
  });

const waitForPaths = (container: HTMLElement) =>
  waitFor(() => {
    expect(container.querySelector('svg path')).toBeTruthy();
  });

// ── Rendering ──────────────────────────────────────────────────────────────────

describe('SankeyChart — rendering', () => {
  it('renders without crashing', () => {
    const { container } = renderWithTheme(<SankeyChart levels={levels} links={links} />);
    expect(container).toBeTruthy();
  });

  it('sets data-blade-component attribute for analytics', () => {
    const { container } = renderWithTheme(<SankeyChart levels={levels} links={links} />);
    expect(container.querySelector('[data-blade-component="SankeyChart"]')).toBeTruthy();
  });

  it('renders the correct number of node rects after layout', async () => {
    const { container } = renderWithTheme(<SankeyChart levels={levels} links={links} />);
    const totalNodes = levels.reduce((sum, l) => sum + l.nodes.length, 0);
    await waitFor(() => {
      expect(container.querySelectorAll('svg rect').length).toBeGreaterThanOrEqual(totalNodes);
    });
  });

  it('renders the correct number of link paths', async () => {
    const { container } = renderWithTheme(<SankeyChart levels={levels} links={links} />);
    await waitFor(() => {
      expect(container.querySelectorAll('svg path')).toHaveLength(links.length);
    });
  });

  it('renders label chips with node names when showLabels is true', async () => {
    renderWithTheme(<SankeyChart levels={levels} links={links} showLabels={true} />);
    await waitFor(() => {
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('UPI')).toBeInTheDocument();
      expect(screen.getByText('Successful')).toBeInTheDocument();
    });
  });

  it('does not render label chips when showLabels is false', async () => {
    renderWithTheme(<SankeyChart levels={levels} links={links} showLabels={false} />);
    await waitFor(() => {
      expect(screen.queryByText('Total')).not.toBeInTheDocument();
    });
  });

  it('appends labelUnit to node value in chip', async () => {
    renderWithTheme(
      <SankeyChart levels={levels} links={links} showLabels={true} labelUnit="txn" />,
    );
    await waitFor(() => {
      // Multiple nodes show "txn" — assert at least one chip contains the unit
      expect(screen.getAllByText(/txn/).length).toBeGreaterThan(0);
    });
  });

  it('accepts testID and renders it as data-testid', () => {
    const { container } = renderWithTheme(
      <SankeyChart levels={levels} links={links} testID="sankey-chart" />,
    );
    expect(container.querySelector('[data-testid="sankey-chart"]')).toBeTruthy();
  });
});

// ── Interactivity ──────────────────────────────────────────────────────────────

describe('SankeyChart — interactivity', () => {
  it('calls onNodeClick with the correct node and index when a node rect is clicked', async () => {
    const handleNodeClick = jest.fn();
    const { container } = renderWithTheme(
      <SankeyChart levels={levels} links={links} onNodeClick={handleNodeClick} />,
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
      <SankeyChart levels={levels} links={links} onLinkClick={handleLinkClick} />,
    );

    await waitForPaths(container);

    const paths = container.querySelectorAll('svg path');
    fireEvent.click(paths[0]);

    expect(handleLinkClick).toHaveBeenCalledTimes(1);
    expect(handleLinkClick).toHaveBeenCalledWith(
      expect.objectContaining({
        from: expect.any(String),
        to: expect.any(String),
        value: expect.any(Number),
      }),
      0,
    );
  });

  it('shows tooltip on node hover when showTooltip is true', async () => {
    const { container } = renderWithTheme(
      <SankeyChart levels={levels} links={links} showTooltip={true} />,
    );

    await waitForRects(container);

    const firstRect = container.querySelector('svg rect')!;
    fireEvent.mouseEnter(firstRect, { clientX: 100, clientY: 100 });

    await waitFor(() => {
      expect(container.querySelectorAll('[style*="position: absolute"]').length).toBeGreaterThan(0);
    });
  });

  it('does not show tooltip on hover when showTooltip is false', async () => {
    const { container } = renderWithTheme(
      <SankeyChart levels={levels} links={links} showTooltip={false} />,
    );

    await waitForRects(container);

    const firstRect = container.querySelector('svg rect')!;
    fireEvent.mouseEnter(firstRect);

    const tooltipContent = container.querySelector(
      '[data-blade-component="SankeyChart"] > div > div[style*="position: absolute"]',
    );
    expect(tooltipContent).toBeNull();
  });

  it('hides tooltip on mouse leave', async () => {
    const { container } = renderWithTheme(
      <SankeyChart levels={levels} links={links} showTooltip={true} />,
    );

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
        levels={levels}
        links={links}
        nodeColorOverride="interactive.background.primary.default"
      />,
    );

    await waitForRects(container);

    const nodeRects = Array.from(container.querySelectorAll('svg rect')).filter(
      (r) => r.getAttribute('rx') === '2', // node bars have rx=border.radius.small=2
    );
    const fills = new Set(nodeRects.map((r) => r.getAttribute('fill')));
    expect(fills.size).toBe(1);
  });

  it('renders with default categorical colors without crashing', async () => {
    const { container } = renderWithTheme(<SankeyChart levels={levels} links={links} />);
    await waitForSvg(container);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});

// ── Edge cases ─────────────────────────────────────────────────────────────────

describe('SankeyChart — edge cases', () => {
  it('renders gracefully with a minimal 2-node graph', async () => {
    const { container } = renderWithTheme(
      <SankeyChart
        levels={[
          { id: 'source', nodes: [{ id: 'a', name: 'A' }] },
          { id: 'target', nodes: [{ id: 'b', name: 'B' }] },
        ]}
        links={[{ from: 'a', to: 'b', value: 100 }]}
      />,
    );
    await waitForSvg(container);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders without crashing when links array is empty', () => {
    expect(() =>
      renderWithTheme(
        <SankeyChart
          levels={[{ id: 'orphan', nodes: [{ id: 'x', name: 'Orphan' }] }]}
          links={[]}
        />,
      ),
    ).not.toThrow();
  });

  it('silently ignores links that reference unknown node ids', async () => {
    const { container } = renderWithTheme(
      <SankeyChart
        levels={levels}
        links={[...links, { from: 'nonexistent', to: 'also-missing', value: 999 }]}
      />,
    );
    await waitForSvg(container);
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('does not render SVG before container width is resolved', () => {
    const { container } = renderWithTheme(<SankeyChart levels={levels} links={links} />);
    expect(container.querySelector('svg')).toBeNull();
  });
});

// ── Snapshots ──────────────────────────────────────────────────────────────────

describe('SankeyChart — snapshots', () => {
  it('matches snapshot for default chart (pre-resize, no SVG)', () => {
    const { container } = renderWithTheme(
      <SankeyChart levels={levels} links={links} showLabels={true} labelUnit="txn" />,
    );
    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });

  it('matches snapshot after layout resolves', async () => {
    const { container } = renderWithTheme(
      <SankeyChart levels={levels} links={links} showLabels={true} labelUnit="txn" />,
    );
    await waitForSvg(container);
    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });

  it('matches snapshot with color overrides', async () => {
    const { container } = renderWithTheme(
      <SankeyChart
        levels={levels}
        links={links}
        nodeColorOverride="interactive.background.primary.default"
        linkColorOverride="data.background.categorical.blue.subtle"
        showLabels={true}
        labelUnit="txn"
      />,
    );
    await waitForSvg(container);
    expect(normalizeSnapshotIds(container.innerHTML)).toMatchSnapshot();
  });
});
