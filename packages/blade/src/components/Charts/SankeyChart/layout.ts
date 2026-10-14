/**
 * Sankey layout engine (web).
 *
 * A faithful port of the algorithm inside recharts' `<Sankey>` (`computeData`: node depth
 * via `align="justify"`, `verticalAlign="justify"` initial placement, collision resolution
 * and 32 rounds of left/right relaxation), so a chart rendered through this engine lands on
 * exactly the same pixels recharts would draw. `layout.test.ts` pins that parity.
 *
 * Two additions recharts does not offer, both off by default:
 *
 * - `minNodeExtent` reserves a minimum vertical extent per node (the label height), so a
 *   thin node still gets room for its label. Bars keep their true height and sit centred
 *   inside the extent; the drawing grows past `height` when the extents need it.
 * - `scale` fixes the pixels-per-unit ratio instead of deriving it from `height`, so two
 *   layouts of related graphs (a folded and an expanded one) share one scale.
 *
 * Pure and platform-agnostic: it knows nothing about React, SVG or the theme.
 */

export type SankeyLayoutLink = {
  /** Index of the source node */
  source: number;
  /** Index of the target node */
  target: number;
  value: number;
};

export type SankeyLayoutOptions = {
  nodeCount: number;
  links: SankeyLayoutLink[];
  /** Plot width, i.e. the chart width with horizontal margins removed */
  width: number;
  /** Plot height with vertical margins removed. Also the scale reference when `scale` is unset */
  height: number;
  nodeWidth: number;
  nodePadding: number;
  /** Relaxation rounds. recharts' default is 32 */
  iterations?: number;
  /** Horizontal offset added to every x (the left margin) */
  offsetX?: number;
  /** Vertical offset added to every y (the top margin) */
  offsetY?: number;
  /**
   * Minimum vertical extent reserved for a node, in px (e.g. its label height). When set,
   * the layout may grow past `height`; see `contentHeight` in the result.
   */
  minNodeExtent?: (nodeIndex: number) => number;
  /** Fixed pixels-per-unit scale. Defaults to the recharts rule: the fullest column fits `height` */
  scale?: number;
};

export type SankeyNodeLayout = {
  index: number;
  depth: number;
  /** max(Σ incoming, Σ outgoing) — the same rule recharts uses */
  value: number;
  x: number;
  /** Top of the reserved extent */
  y: number;
  /** Reserved vertical extent; equals `barHeight` unless `minNodeExtent` raised it */
  extent: number;
  /** Top of the drawn bar, centred inside the extent */
  barY: number;
  barHeight: number;
  width: number;
};

export type SankeyLinkLayout = {
  /** Index into the `links` option */
  index: number;
  source: number;
  target: number;
  value: number;
  sourceX: number;
  targetX: number;
  /** Vertical centre of the ribbon at the source bar */
  sourceY: number;
  /** Vertical centre of the ribbon at the target bar */
  targetY: number;
  /** Bezier control x — the midpoint between the bars (recharts' `linkCurvature` of 0.5) */
  controlX: number;
  /** Ribbon thickness */
  width: number;
};

export type SankeyLayoutResult = {
  nodes: SankeyNodeLayout[];
  links: SankeyLinkLayout[];
  /** Pixels per unit of value */
  scale: number;
  /** Plot height the layout actually occupies — `height`, or more when extents needed it */
  contentHeight: number;
  depthOf: number[];
  countPerDepth: number[];
};

type WorkingNode = {
  index: number;
  depth: number;
  value: number;
  x: number;
  y: number;
  /** Bar height (value × scale) */
  dy: number;
  /** Reserved extent (>= dy) */
  ext: number;
  /** Indices of incoming links */
  sourceLinks: number[];
  /** Indices of outgoing links */
  targetLinks: number[];
  sourceNodes: number[];
  targetNodes: number[];
};

type WorkingLink = SankeyLayoutLink & {
  index: number;
  dy: number;
  /** Offset within the source bar */
  sy: number;
  /** Offset within the target bar */
  ty: number;
};

const DEFAULT_ITERATIONS = 32;

const sumLinkValues = (links: WorkingLink[], ids: number[]): number =>
  ids.reduce((sum, id) => sum + (links[id]?.value ?? 0), 0);

const centerY = (node: WorkingNode): number => node.y + node.ext / 2;

// Depth = longest path from a root, exactly as recharts' recursive `updateDepthOfTargets`.
// `visiting` guards against a cycle in malformed data, which would otherwise never terminate.
const updateDepthOfTargets = (
  tree: WorkingNode[],
  node: WorkingNode,
  visiting: Set<number>,
): void => {
  if (visiting.has(node.index)) return;
  visiting.add(node.index);
  node.targetNodes.forEach((targetIndex) => {
    const target = tree[targetIndex];
    if (!target) return;
    target.depth = Math.max(node.depth + 1, target.depth);
    updateDepthOfTargets(tree, target, visiting);
  });
  visiting.delete(node.index);
};

const resolveCollisions = (
  depthTree: WorkingNode[][],
  height: number,
  nodePadding: number,
): void => {
  depthTree.forEach((nodes) => {
    const n = nodes.length;
    nodes.sort((a, b) => a.y - b.y);

    // Push overlapping nodes down.
    let y0 = 0;
    for (let j = 0; j < n; j++) {
      const node = nodes[j];
      const dy = y0 - node.y;
      if (dy > 0) node.y += dy;
      y0 = node.y + node.ext + nodePadding;
    }

    // If the column now overflows the bottom, push nodes back up.
    y0 = height + nodePadding;
    for (let j = n - 1; j >= 0; j--) {
      const node = nodes[j];
      const dy = node.y + node.ext + nodePadding - y0;
      if (dy > 0) {
        node.y -= dy;
        y0 = node.y;
      } else {
        break;
      }
    }
  });
};

const relaxLeftToRight = (
  tree: WorkingNode[],
  depthTree: WorkingNode[][],
  links: WorkingLink[],
  alpha: number,
): void => {
  depthTree.forEach((nodes) => {
    nodes.forEach((node) => {
      if (node.sourceLinks.length === 0) return;
      const sourceSum = sumLinkValues(links, node.sourceLinks);
      const weightedSum = node.sourceLinks.reduce((sum, id) => {
        const link = links[id];
        const sourceNode = link ? tree[link.source] : undefined;
        return sourceNode ? sum + centerY(sourceNode) * link.value : sum;
      }, 0);
      node.y += (weightedSum / sourceSum - centerY(node)) * alpha;
    });
  });
};

const relaxRightToLeft = (
  tree: WorkingNode[],
  depthTree: WorkingNode[][],
  links: WorkingLink[],
  alpha: number,
): void => {
  for (let i = depthTree.length - 1; i >= 0; i--) {
    depthTree[i].forEach((node) => {
      if (node.targetLinks.length === 0) return;
      const targetSum = sumLinkValues(links, node.targetLinks);
      const weightedSum = node.targetLinks.reduce((sum, id) => {
        const link = links[id];
        const targetNode = link ? tree[link.target] : undefined;
        return targetNode ? sum + centerY(targetNode) * link.value : sum;
      }, 0);
      node.y += (weightedSum / targetSum - centerY(node)) * alpha;
    });
  }
};

// Stack each node's ribbons in the order of the node they connect to, top to bottom.
const updateYOfLinks = (tree: WorkingNode[], links: WorkingLink[]): void => {
  tree.forEach((node) => {
    node.targetLinks.sort(
      (a, b) => (tree[links[a].target]?.y ?? 0) - (tree[links[b].target]?.y ?? 0),
    );
    node.sourceLinks.sort(
      (a, b) => (tree[links[a].source]?.y ?? 0) - (tree[links[b].source]?.y ?? 0),
    );
    let sy = 0;
    node.targetLinks.forEach((id) => {
      links[id].sy = sy;
      sy += links[id].dy;
    });
    let ty = 0;
    node.sourceLinks.forEach((id) => {
      links[id].ty = ty;
      ty += links[id].dy;
    });
  });
};

export const computeSankeyLayout = ({
  nodeCount,
  links: inputLinks,
  width,
  height,
  nodeWidth,
  nodePadding,
  iterations = DEFAULT_ITERATIONS,
  offsetX = 0,
  offsetY = 0,
  minNodeExtent,
  scale,
}: SankeyLayoutOptions): SankeyLayoutResult => {
  const empty: SankeyLayoutResult = {
    nodes: [],
    links: [],
    scale: 0,
    contentHeight: height,
    depthOf: [],
    countPerDepth: [],
  };
  if (nodeCount <= 0 || width <= 0 || height <= 0) return empty;

  const links: WorkingLink[] = inputLinks.map((link, index) => ({
    ...link,
    index,
    dy: 0,
    sy: 0,
    ty: 0,
  }));

  // 1. Nodes with their link references and value.
  const tree: WorkingNode[] = Array.from({ length: nodeCount }, (_, index) => {
    const sourceLinks: number[] = [];
    const targetLinks: number[] = [];
    const sourceNodes: number[] = [];
    const targetNodes: number[] = [];
    links.forEach((link, i) => {
      if (link.source === index) {
        targetLinks.push(i);
        targetNodes.push(link.target);
      }
      if (link.target === index) {
        sourceLinks.push(i);
        sourceNodes.push(link.source);
      }
    });
    return {
      index,
      depth: 0,
      value: Math.max(sumLinkValues(links, sourceLinks), sumLinkValues(links, targetLinks)),
      x: 0,
      y: 0,
      dy: 0,
      ext: 0,
      sourceLinks,
      targetLinks,
      sourceNodes,
      targetNodes,
    };
  });

  // 2. Depth from the roots; `align="justify"` places leaves in the last column.
  tree.forEach((node) => {
    if (node.sourceNodes.length === 0) updateDepthOfTargets(tree, node, new Set());
  });
  const maxDepth = tree.reduce((max, node) => Math.max(max, node.depth), 0);
  const childWidth = maxDepth >= 1 ? (width - nodeWidth) / maxDepth : 0;
  tree.forEach((node) => {
    if (node.targetNodes.length === 0 && maxDepth >= 1) node.depth = maxDepth;
    node.x = node.depth * childWidth;
  });

  // 3. Columns.
  const depthTree: WorkingNode[][] = [];
  tree.forEach((node) => {
    if (!depthTree[node.depth]) depthTree[node.depth] = [];
    depthTree[node.depth].push(node);
  });
  const columns = depthTree.filter(Boolean);

  // 4. Scale: the fullest column fits `height` (recharts' `yRatio`), unless fixed by the caller.
  // A column whose values sum to 0 yields Infinity and drops out of the min; if every column
  // does, or the caller passes something unusable, fall back to 0 rather than NaN geometry.
  const derivedRatio =
    scale ??
    Math.min(
      ...columns.map(
        (nodes) =>
          (height - (nodes.length - 1) * nodePadding) /
          nodes.reduce((sum, node) => sum + node.value, 0),
      ),
    );
  const yRatio: number = Number.isFinite(derivedRatio) && derivedRatio >= 0 ? derivedRatio : 0;

  // 5. Initial placement (`verticalAlign="justify"`): stacked by column order, bar = value × scale.
  columns.forEach((nodes) => {
    nodes.forEach((node, i) => {
      node.y = i;
      node.dy = node.value * yRatio;
      node.ext = minNodeExtent ? Math.max(node.dy, minNodeExtent(node.index)) : node.dy;
    });
  });
  links.forEach((link) => {
    link.dy = link.value * yRatio;
  });

  // The layout height: `height`, or the tallest column when reserved extents or a fixed scale
  // need more room. Only a fixed scale can make the bars alone outgrow the plot; the derived
  // scale fits the fullest column by construction, so that path keeps `height` exactly.
  const canOutgrow = minNodeExtent !== undefined || scale !== undefined;
  const layoutHeight = canOutgrow
    ? Math.max(
        height,
        ...columns.map(
          (nodes) =>
            nodes.reduce((sum, node) => sum + node.ext, 0) + (nodes.length - 1) * nodePadding,
        ),
      )
    : height;

  // 6. Collision resolution + relaxation, exactly as recharts sequences them.
  resolveCollisions(columns, layoutHeight, nodePadding);
  let alpha = 1;
  for (let i = 1; i <= iterations; i++) {
    alpha *= 0.99;
    relaxRightToLeft(tree, columns, links, alpha);
    resolveCollisions(columns, layoutHeight, nodePadding);
    relaxLeftToRight(tree, columns, links, alpha);
    resolveCollisions(columns, layoutHeight, nodePadding);
  }
  updateYOfLinks(tree, links);

  // 7. Output geometry. Bars sit centred in their extent; ribbons attach to the bars.
  const nodes: SankeyNodeLayout[] = tree.map((node) => ({
    index: node.index,
    depth: node.depth,
    value: node.value,
    x: node.x + offsetX,
    y: node.y + offsetY,
    extent: node.ext,
    barY: node.y + (node.ext - node.dy) / 2 + offsetY,
    barHeight: node.dy,
    width: nodeWidth,
  }));

  const linkLayouts: SankeyLinkLayout[] = links.map((link) => {
    const source = nodes[link.source];
    const target = nodes[link.target];
    const sourceX = source.x + nodeWidth;
    const targetX = target.x;
    return {
      index: link.index,
      source: link.source,
      target: link.target,
      value: link.value,
      sourceX,
      targetX,
      controlX: sourceX + (targetX - sourceX) / 2,
      sourceY: source.barY + link.sy + link.dy / 2,
      targetY: target.barY + link.ty + link.dy / 2,
      width: link.dy,
    };
  });

  const depthOf = tree.map((node) => node.depth);
  const countPerDepth = depthTree.map((nodes) => nodes?.length ?? 0);

  return {
    nodes,
    links: linkLayouts,
    scale: yRatio,
    contentHeight: layoutHeight,
    depthOf,
    countPerDepth,
  };
};
