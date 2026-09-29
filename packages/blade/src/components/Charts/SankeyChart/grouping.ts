/**
 * Groups the small nodes of a Sankey column into one "Other" node.
 *
 * Pure data transform, platform-agnostic. The chart calls it twice when grouping is on:
 * once fully folded (to fix the scale) and once with the expanded groups opened up.
 */
import type { SankeyDataLink, SankeyDataNode } from './types';
import { SANKEY_GROUP_ID_PREFIX } from './tokens';

export type SankeyGroup = {
  /** Stable id, derived from the column: the same column always yields the same id */
  id: string;
  depth: number;
  members: SankeyDataNode[];
  memberIds: string[];
  /** Σ of the members' values */
  value: number;
  isExpanded: boolean;
};

export type GroupedSankeyNode = {
  node: SankeyDataNode;
  /** Index in the consumer's `data.nodes`; null for a synthetic group node */
  originalIndex: number | null;
  /** Set on a synthetic group node */
  group?: SankeyGroup;
  /** Set on a member that is shown because its group is expanded */
  revealedGroupId?: string;
};

export type GroupedSankeyLink = {
  source: string;
  target: string;
  value: number;
  /** Index in the consumer's `data.links`; for an aggregated link, the first constituent */
  originalIndex: number;
  /** True when one end was re-pointed to a group node */
  isAggregated: boolean;
};

export type GroupedSankeyData = {
  nodes: GroupedSankeyNode[];
  links: GroupedSankeyLink[];
  /** Every group in the graph, folded or expanded */
  groups: SankeyGroup[];
  /** Σ of the root nodes' outflows — the denominator of every share */
  total: number;
};

export type GroupSankeyDataOptions = {
  nodes: SankeyDataNode[];
  links: SankeyDataLink[];
  /** Share of `total`, in percent, below which a node is grouped. Unset or <= 0 turns grouping off */
  groupNodesBelow?: number;
  expandedGroupIds?: readonly string[];
  formatGroupLabel?: (group: { id: string; depth: number; members: SankeyDataNode[] }) => string;
};

export const getGroupId = (depth: number): string => `${SANKEY_GROUP_ID_PREFIX}${depth}`;

export const isGroupNodeId = (id: string): boolean => id.startsWith(SANKEY_GROUP_ID_PREFIX);

const defaultGroupLabel = ({
  members,
}: {
  id: string;
  depth: number;
  members: SankeyDataNode[];
}): string => `Other (${members.length})`;

/**
 * Depth of every node by breadth-first search from the roots (nodes with no incoming link).
 * Nodes unreachable from a root — only possible with a cycle in malformed data — get depth 0.
 */
const computeDepths = (nodes: SankeyDataNode[], links: SankeyDataLink[]): Map<string, number> => {
  const incoming = new Map<string, number>(nodes.map((n) => [n.id, 0]));
  const outgoing = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
  links.forEach((link) => {
    if (!incoming.has(link.source) || !incoming.has(link.target)) return;
    incoming.set(link.target, (incoming.get(link.target) ?? 0) + 1);
    outgoing.get(link.source)?.push(link.target);
  });
  const depthOf = new Map<string, number>();
  const queue = nodes.filter((n) => incoming.get(n.id) === 0).map((n) => n.id);
  queue.forEach((id) => depthOf.set(id, 0));
  for (let i = 0; i < queue.length; i++) {
    const id = queue[i];
    const depth = depthOf.get(id) ?? 0;
    outgoing.get(id)?.forEach((targetId) => {
      if (!depthOf.has(targetId)) {
        depthOf.set(targetId, depth + 1);
        queue.push(targetId);
      }
    });
  }
  nodes.forEach((n) => {
    if (!depthOf.has(n.id)) depthOf.set(n.id, 0);
  });
  return depthOf;
};

export const groupSankeyData = ({
  nodes,
  links,
  groupNodesBelow,
  expandedGroupIds = [],
  formatGroupLabel = defaultGroupLabel,
}: GroupSankeyDataOptions): GroupedSankeyData => {
  const nodeIds = new Set(nodes.map((n) => n.id));
  const validLinks = links
    .map((link, originalIndex) => ({ ...link, originalIndex }))
    .filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target));

  // Node value = max(Σ incoming, Σ outgoing); total = Σ outflows of the roots.
  const inSum = new Map<string, number>();
  const outSum = new Map<string, number>();
  validLinks.forEach((link) => {
    outSum.set(link.source, (outSum.get(link.source) ?? 0) + link.value);
    inSum.set(link.target, (inSum.get(link.target) ?? 0) + link.value);
  });
  const valueOf = (id: string): number => Math.max(inSum.get(id) ?? 0, outSum.get(id) ?? 0);
  const total = nodes
    .filter((n) => !inSum.has(n.id))
    .reduce((sum, n) => sum + (outSum.get(n.id) ?? 0), 0);

  const passthrough: GroupedSankeyData = {
    nodes: nodes.map((node, originalIndex) => ({ node, originalIndex })),
    links: validLinks.map(({ originalIndex, ...link }) => ({
      ...link,
      originalIndex,
      isAggregated: false,
    })),
    groups: [],
    total,
  };
  if (groupNodesBelow === undefined || groupNodesBelow <= 0 || total <= 0) return passthrough;

  // Candidates: never a root, opted in (default), and under the threshold.
  const depthOf = computeDepths(nodes, links);
  const candidatesByDepth = new Map<number, SankeyDataNode[]>();
  nodes.forEach((node) => {
    const depth = depthOf.get(node.id) ?? 0;
    if (depth === 0 || node.isGroupable === false) return;
    if ((valueOf(node.id) / total) * 100 >= groupNodesBelow) return;
    const list = candidatesByDepth.get(depth) ?? [];
    list.push(node);
    candidatesByDepth.set(depth, list);
  });

  // A group needs at least two members — folding a single node hides nothing.
  const groups: SankeyGroup[] = [];
  candidatesByDepth.forEach((members, depth) => {
    if (members.length < 2) return;
    const id = getGroupId(depth);
    groups.push({
      id,
      depth,
      members,
      memberIds: members.map((m) => m.id),
      value: members.reduce((sum, m) => sum + valueOf(m.id), 0),
      isExpanded: expandedGroupIds.includes(id),
    });
  });
  groups.sort((a, b) => a.depth - b.depth);
  if (groups.length === 0) return passthrough;

  const memberToGroup = new Map<string, SankeyGroup>();
  const revealedIn = new Map<string, string>();
  groups.forEach((group) => {
    group.memberIds.forEach((memberId) => {
      if (group.isExpanded) revealedIn.set(memberId, group.id);
      else memberToGroup.set(memberId, group);
    });
  });

  // Nodes: a folded group's node takes the place of its first member, so the column keeps
  // its order; members of an expanded group stay where they are, marked as revealed.
  const groupedNodes: GroupedSankeyNode[] = [];
  const emittedGroups = new Set<string>();
  nodes.forEach((node, originalIndex) => {
    const group = memberToGroup.get(node.id);
    if (group) {
      if (!emittedGroups.has(group.id)) {
        emittedGroups.add(group.id);
        groupedNodes.push({
          node: {
            id: group.id,
            name: formatGroupLabel({
              id: group.id,
              depth: group.depth,
              members: group.members,
            }),
          },
          originalIndex: null,
          group,
        });
      }
      return;
    }
    groupedNodes.push({ node, originalIndex, revealedGroupId: revealedIn.get(node.id) });
  });

  // Links: re-point ends at folded members to their group and merge duplicates per pair.
  const merged = new Map<string, GroupedSankeyLink>();
  validLinks.forEach(({ originalIndex, ...link }) => {
    const source = memberToGroup.get(link.source)?.id ?? link.source;
    const target = memberToGroup.get(link.target)?.id ?? link.target;
    const isAggregated = source !== link.source || target !== link.target;
    const key = `${source}\u0000${target}`;
    const existing = merged.get(key);
    if (existing && isAggregated) {
      existing.value += link.value;
      return;
    }
    merged.set(existing ? `${key}\u0000${originalIndex}` : key, {
      source,
      target,
      value: link.value,
      originalIndex,
      isAggregated,
    });
  });

  return { nodes: groupedNodes, links: Array.from(merged.values()), groups, total };
};
