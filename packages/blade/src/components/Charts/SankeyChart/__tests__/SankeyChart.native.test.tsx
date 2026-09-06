/**
 * SankeyChart native tests
 *
 * The native implementation renders a real `react-native-svg` Sankey diagram
 * (nodes as <Rect>, links as bezier <Path>) with a tap-to-select hover-equivalent
 * dim/highlight + tooltip and click callbacks. `onLayout` does not fire in the test
 * env, so a synthetic layout event is dispatched to give the chart a size.
 */
import React from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
import { fireEvent } from '@testing-library/react-native';
import { Rect, Path, TSpan, G } from 'react-native-svg';
import { ChartSankeyWrapper, ChartSankey } from '../SankeyChart.native';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

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

// All rendered <Rect>s are visible shapes (node bars + chip backgrounds); there is
// no separate hit-target rect. `shapeRects` is an identity pass kept so existing
// count assertions read unchanged.
const shapeRects = (rects: ReactTestInstance[]): ReactTestInstance[] => rects;

// Selection is driven by a single outer <Pressable> (testID `<id>-canvas`) that
// hit-tests the touch location, so interaction tests fire `press` on that canvas
// with a computed locationX/locationY rather than on individual SVG shapes.
type Utils = ReturnType<typeof renderWithTheme>;
// Widen past the Rect|Path|TSpan|G union — their props (e.g. NumberProp vs NumberArray on `x`)
// are not mutually assignable, so RNTL's ComponentType<GProps> parameter rejects the union.
type SvgComponent = React.ComponentType;

// Rename RNTL's UNSAFE_* helpers so babel/new-cap does not treat the call site as a
// constructor invocation (the exported names begin with an uppercase letter).
const getAllByType = (utils: Utils, type: SvgComponent): ReactTestInstance[] => {
  const { UNSAFE_getAllByType: unsafeGetAllByType } = utils;
  return unsafeGetAllByType(type);
};

const queryAllByType = (utils: Utils, type: SvgComponent): ReactTestInstance[] => {
  const { UNSAFE_queryAllByType: unsafeQueryAllByType } = utils;
  return unsafeQueryAllByType(type);
};

// The chart draws its shapes inside a translate <G x={PADDING.left} y={PADDING.top}>.
const getTranslate = (utils: Utils): { gx: number; gy: number } => {
  const g = getAllByType(utils, G).find((el) => typeof el.props.x === 'number');
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
  const rect = shapeRects(getAllByType(utils, Rect))[i];
  tapCanvas(
    utils,
    gx + Number(rect.props.x) + Number(rect.props.width) / 2,
    gy + Number(rect.props.y) + Number(rect.props.height) / 2,
  );
};

// A point on link `i`'s ribbon centerline midpoint (between the two columns, so it
// is clear of both node rects). The ribbon path is
//   M sourceX,(sy+w/2) C … L targetX,(ty−w/2) C … Z
// so the centerline midpoint is ((Mx+Lx)/2, (My+Ly)/2) — the ±w/2 thickness cancels.
const tapLink = (utils: Utils, i: number): void => {
  const { gx, gy } = getTranslate(utils);
  const d = String(getAllByType(utils, Path)[i]?.props.d ?? '');
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
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    // showLabelChip=false → no chip Rects, so Rect count === node count.
    expect(shapeRects(getAllByType(utils, Rect))).toHaveLength(data.nodes.length);
    expect(getAllByType(utils, Path)).toHaveLength(data.links.length);
  });

  it('renders chip <Rect>s in addition to node bars when showLabelChip is true', () => {
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip />
      </ChartSankeyWrapper>,
    );
    // node bars + one chip rect per node with a label.
    expect(shapeRects(getAllByType(utils, Rect)).length).toBeGreaterThan(data.nodes.length);
  });

  it('hides labels entirely when showLabels is false', () => {
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabels={false} />
      </ChartSankeyWrapper>,
    );
    // No label text spans render when labels are hidden.
    expect(queryAllByType(utils, TSpan)).toHaveLength(0);
  });

  it('renders label text spans when showLabels is true', () => {
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} />
      </ChartSankeyWrapper>,
    );
    const spanTexts = getAllByType(utils, TSpan).map((s) => s.props.children);
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
    const { queryByText } = utils;
    // No tooltip before any interaction.
    expect(queryByText(/^Alpha:/)).toBeNull();
    // Tap the first node → its tooltip appears (and other shapes dim).
    tapNode(utils, 0);
    expect(queryByText(/^Alpha:/)).not.toBeNull();
    // The chart still renders one node <Rect> per node after the re-render.
    expect(shapeRects(getAllByType(utils, Rect))).toHaveLength(data.nodes.length);
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
    const utils = renderSankey(
      <ChartSankeyWrapper
        testID="sankey-chart"
        nodeColorOverride="data.background.categorical.blue.moderate"
      >
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    const fills = shapeRects(getAllByType(utils, Rect)).map((r) => r.props.fill);
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
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={twoNode} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    expect(shapeRects(getAllByType(utils, Rect))).toHaveLength(2);
    expect(getAllByType(utils, Path)).toHaveLength(1);
  });

  it('renders nodes only when there are no links', () => {
    const noLinks = {
      nodes: [
        { id: 'x', name: 'X' },
        { id: 'y', name: 'Y' },
      ],
      links: [],
    };
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={noLinks} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    expect(queryAllByType(utils, Path)).toHaveLength(0);
    expect(shapeRects(queryAllByType(utils, Rect))).toHaveLength(2);
  });

  it('renders plain-text labels (no chip Rect) when showLabelChip is false', () => {
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    // Label text spans are present, but no chip background rects (Rect count === node count).
    const spanTexts = getAllByType(utils, TSpan).map((s) => s.props.children);
    expect(spanTexts).toContain('Alpha');
    expect(shapeRects(getAllByType(utils, Rect))).toHaveLength(data.nodes.length);
  });

  // ── Vertical layout (native-only) ────────────────────────────────────────────
  // The vertical variant transposes the layout: stages flow top→bottom, each node
  // is a horizontal bar, and ribbons curve down the Y axis. Existing behaviour is
  // unchanged (default layout stays horizontal); these tests cover the new path.

  it('renders one <Rect> per node and one <Path> per link in vertical layout', () => {
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart" layout="vertical">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    expect(shapeRects(getAllByType(utils, Rect))).toHaveLength(data.nodes.length);
    expect(getAllByType(utils, Path)).toHaveLength(data.links.length);
  });

  it('lays out vertical nodes as horizontal bars (width is the long dimension)', () => {
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart" layout="vertical">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    // In vertical layout a node bar's width (value·scale) is the long dimension and
    // its height is the fixed thin NODE_WIDTH. Node 0 ('Alpha') is the root carrying
    // all flow, so its bar is clearly wider than it is tall.
    const rect0 = shapeRects(getAllByType(utils, Rect))[0];
    expect(Number(rect0.props.width)).toBeGreaterThan(Number(rect0.props.height));
  });

  it('selects a node on tap in vertical layout, toggles off on re-tap, and clears on empty-canvas tap', () => {
    // Mirrors the horizontal interaction test with the transposed layout: taps are
    // hit-tested against the (transposed) node rects so tap-to-stay still works.
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart" layout="vertical">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    const { queryByText } = utils;
    expect(queryByText(/^Alpha:/)).toBeNull();
    // Tap the first node → its tooltip appears (persistent selection).
    tapNode(utils, 0);
    expect(queryByText(/^Alpha:/)).not.toBeNull();
    // Re-tap the same node toggles the selection off.
    tapNode(utils, 0);
    expect(queryByText(/^Alpha:/)).toBeNull();
    // Re-select, then tap empty canvas (top-left, before the plot) → clears.
    tapNode(utils, 0);
    expect(queryByText(/^Alpha:/)).not.toBeNull();
    tapCanvas(utils, 0, 0);
    expect(queryByText(/^Alpha:/)).toBeNull();
  });

  it('selects a link ribbon on tap in vertical layout', () => {
    const utils = renderSankey(
      <ChartSankeyWrapper testID="sankey-chart" layout="vertical">
        <ChartSankey data={data} showLabelChip={false} />
      </ChartSankeyWrapper>,
    );
    const { queryByText } = utils;
    expect(queryByText(/Alpha → Beta:/)).toBeNull();
    tapLink(utils, 0);
    expect(queryByText(/Alpha → Beta:/)).not.toBeNull();
    tapCanvas(utils, 0, 0);
    expect(queryByText(/Alpha → Beta:/)).toBeNull();
  });
});
