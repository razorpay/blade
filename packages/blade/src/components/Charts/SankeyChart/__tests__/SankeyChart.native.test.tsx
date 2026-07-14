/**
 * SankeyChart native tests
 *
 * The native implementation renders a real `react-native-svg` Sankey diagram
 * (nodes as <Rect>, links as bezier <Path>) with a tap-to-select hover-equivalent
 * dim/highlight + tooltip and click callbacks. `onLayout` does not fire in the test
 * env, so a synthetic layout event is dispatched to give the chart a size.
 */
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Rect, Path, TSpan, G } from 'react-native-svg';
import { ChartSankeyWrapper, ChartSankey } from '../SankeyChart.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

/* eslint-disable babel/new-cap */
const data = {
  nodes: [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'c', name: 'Gamma' },
  ],
  links: [
    { source: 'a', target: 'b', value: 100 },
    { source: 'a', target: 'c', value: 60 },
    { source: 'b', target: 'c', value: 40 },
  ],
};

const layoutEvent = { nativeEvent: { layout: { width: 800, height: 400, x: 0, y: 0 } } };

const renderSankey = (chart: React.ReactElement): ReturnType<typeof renderWithTheme> => {
  const utils = renderWithTheme(chart);
  // onLayout won't fire in the node test env — dispatch a synthetic layout so the
  // wrapper computes a non-zero size and renders the SVG.
  fireEvent(utils.getByTestId('sankey-chart-canvas'), 'layout', layoutEvent);
  return utils;
};

// Selection is driven by a single outer <Pressable> (testID `<id>-canvas`) that
// hit-tests the touch location, so interaction tests fire `press` on that canvas
// with a computed locationX/locationY rather than on individual SVG shapes.
type Utils = ReturnType<typeof renderWithTheme>;

// The chart draws its shapes inside a translate <G x={PADDING.left} y={PADDING.top}>.
const getTranslate = (utils: Utils): { gx: number; gy: number } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = utils.UNSAFE_getAllByType(G).find((el: any) => typeof el.props.x === 'number');
  return { gx: (g?.props.x as number) ?? 0, gy: (g?.props.y as number) ?? 0 };
};

const tapCanvas = (utils: Utils, x: number, y: number): void => {
  fireEvent(utils.getByTestId('sankey-chart-canvas'), 'press', {
    nativeEvent: { locationX: x, locationY: y },
  });
};

// Center of node `i`'s bar in screen (Pressable-local) coords.
const tapNode = (utils: Utils, i: number): void => {
  const { gx, gy } = getTranslate(utils);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rect = (utils.UNSAFE_getAllByType(Rect) as any[])[i];
  tapCanvas(
    utils,
    gx + rect.props.x + rect.props.width / 2,
    gy + rect.props.y + rect.props.height / 2,
  );
};

// A point on link `i`'s ribbon centerline midpoint (between the two columns, so it
// is clear of both node rects). The ribbon path is
//   M sourceX,(sy+w/2) C … L targetX,(ty−w/2) C … Z
// so the centerline midpoint is ((Mx+Lx)/2, (My+Ly)/2) — the ±w/2 thickness cancels.
const tapLink = (utils: Utils, i: number): void => {
  const { gx, gy } = getTranslate(utils);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = (utils.UNSAFE_getAllByType(Path)[i] as any).props.d as string;
  const m = /M([\d.]+),([\d.]+)/.exec(d);
  const l = /L([\d.]+),([\d.]+)/.exec(d);
  const mx = Number(m?.[1] ?? 0);
  const my = Number(m?.[2] ?? 0);
  const lx = Number(l?.[1] ?? 0);
  const ly = Number(l?.[2] ?? 0);
  tapCanvas(utils, gx + (mx + lx) / 2, gy + (my + ly) / 2);
};

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ChartSankeyWrapper /> (native)', () => {
  it('renders the default chart without crashing', () => {
    const { toJSON } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} />
      </ChartSankeyWrapper>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('matches the default snapshot', () => {
    const { toJSON } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} />
      </ChartSankeyWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders one <Rect> per node and one <Path> per link', () => {
    const { UNSAFE_getAllByType } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    // showLabelChip=false → no chip Rects, so Rect count === node count.
    expect(UNSAFE_getAllByType(Rect)).toHaveLength(data.nodes.length);
    expect(UNSAFE_getAllByType(Path)).toHaveLength(data.links.length);
  });

  it('renders chip <Rect>s in addition to node bars when showLabelChip is true', () => {
    const { UNSAFE_getAllByType } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip />
      </ChartSankeyWrapper>,
    );
    // node bars + one chip rect per node with a label.
    expect(UNSAFE_getAllByType(Rect).length).toBeGreaterThan(data.nodes.length);
  });

  it('hides labels entirely when showLabels is false', () => {
    const { UNSAFE_queryAllByType } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabels={false} />
      </ChartSankeyWrapper>,
    );
    // No label text spans render when labels are hidden.
    expect(UNSAFE_queryAllByType(TSpan)).toHaveLength(0);
  });

  it('renders label text spans when showLabels is true', () => {
    const { UNSAFE_getAllByType } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} />
      </ChartSankeyWrapper>,
    );
    const spanTexts = UNSAFE_getAllByType(TSpan).map((s) => s.props.children);
    expect(spanTexts).toContain('Alpha');
  });

  it('fires onNodeClick with the node data and index', () => {
    const onNodeClick = jest.fn();
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip={false} onNodeClick={onNodeClick} />
      </ChartSankeyWrapper>,
    );
    tapNode(utils, 0);
    expect(onNodeClick).toHaveBeenCalledTimes(1);
    expect(onNodeClick).toHaveBeenCalledWith(data.nodes[0], 0);
  });

  it('fires onLinkClick with the link data and original index', () => {
    const onLinkClick = jest.fn();
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} onLinkClick={onLinkClick} />
      </ChartSankeyWrapper>,
    );
    tapLink(utils, 0);
    expect(onLinkClick).toHaveBeenCalledTimes(1);
    expect(onLinkClick).toHaveBeenCalledWith(data.links[0], 0);
  });

  it('selects the hover-equivalent (dim + tooltip) on tap, toggles off on re-tap, and clears on empty-canvas tap', () => {
    // Touch has no hover: a completed tap on the canvas Pressable is the touch
    // equivalent. The handler hit-tests the touch location — a node/link hit sets a
    // persistent tooltip + dim/highlight selection that stays after the finger
    // lifts; tapping the same node again toggles it off, and an empty-canvas tap
    // clears any selection (matching DonutChart tap-to-stay behaviour).
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    const { UNSAFE_getAllByType, queryByText } = utils;
    // No tooltip before any interaction.
    expect(queryByText(/^Alpha:/)).toBeNull();
    // Tap the first node → its tooltip appears (and other shapes dim).
    tapNode(utils, 0);
    expect(queryByText(/^Alpha:/)).not.toBeNull();
    // The chart still renders one node <Rect> per node after the re-render.
    expect(UNSAFE_getAllByType(Rect)).toHaveLength(data.nodes.length);
    // A repeated tap on the same node toggles the selection off.
    tapNode(utils, 0);
    expect(queryByText(/^Alpha:/)).toBeNull();
    // Re-select, then tap empty canvas (top-left, before the plot area) → clears.
    tapNode(utils, 0);
    expect(queryByText(/^Alpha:/)).not.toBeNull();
    tapCanvas(utils, 0, 0);
    expect(queryByText(/^Alpha:/)).toBeNull();
  });

  it('clears a selected link when the empty canvas is tapped', () => {
    // Deselection happens by tapping empty canvas, matching the "stays until you
    // tap elsewhere" mobile model.
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    const { queryByText } = utils;
    // No tooltip before any interaction.
    expect(queryByText(/Alpha → Beta:/)).toBeNull();
    // Tap the first link → its tooltip appears.
    tapLink(utils, 0);
    expect(queryByText(/Alpha → Beta:/)).not.toBeNull();
    // Tap empty canvas → the selection (and tooltip) clears.
    tapCanvas(utils, 0, 0);
    expect(queryByText(/Alpha → Beta:/)).toBeNull();
  });

  it('applies a single resolved fill when nodeColorOverride is set', () => {
    const { UNSAFE_getAllByType } = renderSankey(
      <ChartSankeyWrapper
        testID="sankey-chart"
        nodeColorOverride="data.background.categorical.blue.moderate"
      >
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    const fills = UNSAFE_getAllByType(Rect).map((r) => r.props.fill);
    const uniqueFills = Array.from(new Set(fills));
    expect(uniqueFills).toHaveLength(1);
  });

  it('renders a two-node / single-link graph without throwing', () => {
    const twoNode = {
      nodes: [
        { id: 'x', name: 'X' },
        { id: 'y', name: 'Y' },
      ],
      links: [{ source: 'x', target: 'y', value: 10 }],
    };
    const { UNSAFE_getAllByType } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={twoNode} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    expect(UNSAFE_getAllByType(Rect)).toHaveLength(2);
    expect(UNSAFE_getAllByType(Path)).toHaveLength(1);
  });

  it('renders nodes only when there are no links', () => {
    const noLinks = {
      nodes: [
        { id: 'x', name: 'X' },
        { id: 'y', name: 'Y' },
      ],
      links: [],
    };
    const { UNSAFE_queryAllByType } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={noLinks} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    expect(UNSAFE_queryAllByType(Path)).toHaveLength(0);
    expect(UNSAFE_queryAllByType(Rect)).toHaveLength(2);
  });

  it('renders plain-text labels (no chip Rect) when showLabelChip is false', () => {
    const { UNSAFE_getAllByType } = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    // Label text spans are present, but no chip background rects (Rect count === node count).
    const spanTexts = UNSAFE_getAllByType(TSpan).map((s) => s.props.children);
    expect(spanTexts).toContain('Alpha');
    expect(UNSAFE_getAllByType(Rect)).toHaveLength(data.nodes.length);
  });
});
