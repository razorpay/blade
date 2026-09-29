/**
 * Layout engine tests.
 *
 * The first block pins parity with recharts: the same data, size, node width and padding
 * must produce the same node and ribbon geometry that recharts' `<Sankey>` draws, so
 * moving the layout into Blade changes nothing for existing charts.
 *
 * Run with: SHARD='' yarn test:react --testPathPattern=SankeyChart/__tests__/layout.web
 */
import React from 'react';
import { render } from '@testing-library/react';
import { Sankey } from 'recharts';
import { computeSankeyLayout } from '../layout';
import type { SankeyLayoutLink } from '../layout';

type Graph = { nodeCount: number; links: SankeyLayoutLink[] };

const NODE_WIDTH = 14;
const NODE_PADDING = 12;
const MARGIN = { top: 8, right: 60, bottom: 8, left: 8 };
const WIDTH = 800;
const HEIGHT = 400;

// Total → 2 methods → 2 outcomes.
const simple: Graph = {
  nodeCount: 5,
  links: [
    { source: 0, target: 1, value: 4000 },
    { source: 0, target: 2, value: 3200 },
    { source: 1, target: 3, value: 3500 },
    { source: 1, target: 4, value: 500 },
    { source: 2, target: 3, value: 2800 },
    { source: 2, target: 4, value: 400 },
  ],
};

// Total → 6 methods (one is a leaf that skips the provider column) → 3 providers → 4 outcomes,
// with a long tail of small values so relaxation and collision resolution both do real work.
const longTail: Graph = {
  nodeCount: 14,
  links: [
    { source: 0, target: 1, value: 6100 },
    { source: 0, target: 2, value: 2400 },
    { source: 0, target: 3, value: 900 },
    { source: 0, target: 4, value: 350 },
    { source: 0, target: 5, value: 180 },
    { source: 0, target: 6, value: 70 },
    { source: 1, target: 7, value: 4000 },
    { source: 1, target: 8, value: 2100 },
    { source: 2, target: 7, value: 1500 },
    { source: 2, target: 9, value: 900 },
    { source: 3, target: 8, value: 600 },
    { source: 3, target: 9, value: 300 },
    { source: 4, target: 9, value: 350 },
    { source: 5, target: 7, value: 180 },
    { source: 7, target: 10, value: 5000 },
    { source: 7, target: 11, value: 600 },
    { source: 7, target: 12, value: 80 },
    { source: 8, target: 10, value: 2400 },
    { source: 8, target: 11, value: 250 },
    { source: 8, target: 13, value: 50 },
    { source: 9, target: 10, value: 1300 },
    { source: 9, target: 11, value: 200 },
    { source: 9, target: 12, value: 50 },
    { source: 6, target: 11, value: 70 },
  ],
};

type RechartsNodeShape = { index: number; x: number; y: number; height: number };
type RechartsLinkShape = {
  index: number;
  sourceX: number;
  targetX: number;
  sourceY: number;
  targetY: number;
  sourceControlX: number;
  linkWidth: number;
};

/** Renders recharts' Sankey with capturing node/link renderers and returns what it drew. */
const renderWithRecharts = (
  graph: Graph,
): { nodes: RechartsNodeShape[]; links: RechartsLinkShape[] } => {
  const nodes: RechartsNodeShape[] = [];
  const links: RechartsLinkShape[] = [];
  const data = {
    nodes: Array.from({ length: graph.nodeCount }, (_, i) => ({ name: `n${i}` })),
    links: graph.links,
  };
  render(
    React.createElement(Sankey, {
      data,
      width: WIDTH,
      height: HEIGHT,
      nodeWidth: NODE_WIDTH,
      nodePadding: NODE_PADDING,
      margin: MARGIN,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      node: (props: any) => {
        nodes[props.index] = { index: props.index, x: props.x, y: props.y, height: props.height };
        return React.createElement('rect');
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      link: (props: any) => {
        links[props.index] = {
          index: props.index,
          sourceX: props.sourceX,
          targetX: props.targetX,
          sourceY: props.sourceY,
          targetY: props.targetY,
          sourceControlX: props.sourceControlX,
          linkWidth: props.linkWidth,
        };
        return React.createElement('path');
      },
    }),
  );
  return { nodes, links };
};

const layoutWithBlade = (
  graph: Graph,
  extra: Partial<Parameters<typeof computeSankeyLayout>[0]> = {},
): ReturnType<typeof computeSankeyLayout> =>
  computeSankeyLayout({
    nodeCount: graph.nodeCount,
    links: graph.links,
    width: WIDTH - MARGIN.left - MARGIN.right,
    height: HEIGHT - MARGIN.top - MARGIN.bottom,
    nodeWidth: NODE_WIDTH,
    nodePadding: NODE_PADDING,
    offsetX: MARGIN.left,
    offsetY: MARGIN.top,
    ...extra,
  });

describe('computeSankeyLayout — parity with recharts', () => {
  it.each([
    ['a simple three-column graph', simple],
    ['a four-column graph with a long tail and a leaf in a middle column', longTail],
  ])('lays out %s exactly as recharts does', (_name, graph) => {
    const recharts = renderWithRecharts(graph);
    const blade = layoutWithBlade(graph);

    expect(blade.nodes).toHaveLength(recharts.nodes.length);
    blade.nodes.forEach((node) => {
      const reference = recharts.nodes[node.index];
      expect(node.x).toBeCloseTo(reference.x, 6);
      expect(node.barY).toBeCloseTo(reference.y, 6);
      expect(node.barHeight).toBeCloseTo(reference.height, 6);
      // Without reserved extents the extent is the bar itself.
      expect(node.extent).toBeCloseTo(node.barHeight, 6);
      expect(node.y).toBeCloseTo(node.barY, 6);
    });

    expect(blade.links).toHaveLength(recharts.links.length);
    blade.links.forEach((link) => {
      const reference = recharts.links[link.index];
      expect(link.sourceX).toBeCloseTo(reference.sourceX, 6);
      expect(link.targetX).toBeCloseTo(reference.targetX, 6);
      expect(link.sourceY).toBeCloseTo(reference.sourceY, 6);
      expect(link.targetY).toBeCloseTo(reference.targetY, 6);
      expect(link.controlX).toBeCloseTo(reference.sourceControlX, 6);
      expect(link.width).toBeCloseTo(reference.linkWidth, 6);
    });

    expect(blade.contentHeight).toBe(HEIGHT - MARGIN.top - MARGIN.bottom);
  });

  it('places a leaf node in the last column (justify alignment)', () => {
    // Total → A → Out, plus B which flows nowhere: recharts justifies B into the last column.
    const withLeaf: Graph = {
      nodeCount: 4,
      links: [
        { source: 0, target: 1, value: 80 },
        { source: 0, target: 2, value: 20 },
        { source: 1, target: 3, value: 80 },
      ],
    };
    const recharts = renderWithRecharts(withLeaf);
    const blade = layoutWithBlade(withLeaf);
    expect(blade.depthOf[2]).toBe(2);
    expect(blade.nodes[2].x).toBe(blade.nodes[3].x);
    expect(blade.nodes[2].x).toBeCloseTo(recharts.nodes[2].x, 6);
    expect(blade.nodes[2].barY).toBeCloseTo(recharts.nodes[2].y, 6);
  });
});

describe('computeSankeyLayout — reserved extents and fixed scale', () => {
  const LABEL_HEIGHT = 20;

  it('reserves at least the label height for every node and keeps bars at their true size', () => {
    const plain = layoutWithBlade(longTail);
    const withExtents = layoutWithBlade(longTail, { minNodeExtent: () => LABEL_HEIGHT });

    withExtents.nodes.forEach((node) => {
      expect(node.extent).toBeGreaterThanOrEqual(LABEL_HEIGHT - 1e-9);
      expect(node.extent).toBeGreaterThanOrEqual(node.barHeight);
      // The bar sits centred inside its extent.
      expect(node.barY - node.y).toBeCloseTo((node.extent - node.barHeight) / 2, 6);
      // Same scale as the plain layout, so bar heights are unchanged.
      expect(node.barHeight).toBeCloseTo(plain.nodes[node.index].barHeight, 6);
    });
    expect(withExtents.scale).toBeCloseTo(plain.scale, 12);
  });

  it('never lets two extents in a column overlap', () => {
    const { nodes, depthOf } = layoutWithBlade(longTail, { minNodeExtent: () => LABEL_HEIGHT });
    const byDepth = new Map<number, typeof nodes>();
    nodes.forEach((node) => {
      const list = byDepth.get(depthOf[node.index]) ?? [];
      list.push(node);
      byDepth.set(depthOf[node.index], list);
    });
    byDepth.forEach((column) => {
      const sorted = [...column].sort((a, b) => a.y - b.y);
      for (let i = 1; i < sorted.length; i++) {
        const previousBottom = sorted[i - 1].y + sorted[i - 1].extent;
        expect(sorted[i].y).toBeGreaterThanOrEqual(previousBottom + NODE_PADDING - 1e-6);
      }
    });
  });

  it('grows the content height when the extents no longer fit', () => {
    const shortHeight = 120;
    const result = layoutWithBlade(longTail, {
      height: shortHeight,
      minNodeExtent: () => LABEL_HEIGHT,
    });
    // Six methods × 20px + 5 gaps × 12px = 180px, more than the 120px available.
    expect(result.contentHeight).toBeGreaterThan(shortHeight);
    expect(result.contentHeight).toBeGreaterThanOrEqual(6 * LABEL_HEIGHT + 5 * NODE_PADDING);
    const bottom = Math.max(...result.nodes.map((n) => n.y + n.extent));
    expect(bottom).toBeLessThanOrEqual(result.contentHeight + MARGIN.top + 1e-6);
  });

  it('uses a fixed scale when one is given', () => {
    const plain = layoutWithBlade(simple);
    const halfScale = layoutWithBlade(simple, { scale: plain.scale / 2 });
    halfScale.nodes.forEach((node) => {
      expect(node.barHeight).toBeCloseTo(plain.nodes[node.index].barHeight / 2, 6);
    });
    halfScale.links.forEach((link) => {
      expect(link.width).toBeCloseTo(plain.links[link.index].width / 2, 6);
    });
  });
});

describe('computeSankeyLayout — edge cases', () => {
  it('returns an empty layout for no nodes or a non-positive size', () => {
    expect(layoutWithBlade({ nodeCount: 0, links: [] }).nodes).toHaveLength(0);
    expect(layoutWithBlade(simple, { width: 0 }).nodes).toHaveLength(0);
    expect(layoutWithBlade(simple, { height: 0 }).nodes).toHaveLength(0);
  });

  it('gives a node without links zero height instead of NaN', () => {
    const result = layoutWithBlade({ nodeCount: 1, links: [] });
    expect(result.nodes[0].barHeight).toBe(0);
    expect(Number.isFinite(result.nodes[0].y)).toBe(true);
  });

  it('terminates on a cyclic graph', () => {
    const cyclic: Graph = {
      nodeCount: 2,
      links: [
        { source: 0, target: 1, value: 10 },
        { source: 1, target: 0, value: 10 },
      ],
    };
    expect(() => layoutWithBlade(cyclic)).not.toThrow();
  });
});
