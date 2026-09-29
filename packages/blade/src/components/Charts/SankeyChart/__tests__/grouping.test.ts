import { getGroupId, groupSankeyData, isGroupNodeId } from '../grouping';
import type { SankeyDataLink, SankeyDataNode } from '../types';

// Total (10 000) → methods → outcomes. Wallet (4%), EMI (1.8%) and BNPL (0.7%) are the tail.
const nodes: SankeyDataNode[] = [
  { id: 'total', name: 'Total' },
  { id: 'upi', name: 'UPI' },
  { id: 'card', name: 'Card' },
  { id: 'wallet', name: 'Wallet' },
  { id: 'emi', name: 'EMI' },
  { id: 'bnpl', name: 'BNPL' },
  { id: 'captured', name: 'Captured', isGroupable: false },
  { id: 'failed', name: 'Failed', isGroupable: false },
];

const links: SankeyDataLink[] = [
  { source: 'total', target: 'upi', value: 6500 },
  { source: 'total', target: 'card', value: 2850 },
  { source: 'total', target: 'wallet', value: 400 },
  { source: 'total', target: 'emi', value: 180 },
  { source: 'total', target: 'bnpl', value: 70 },
  { source: 'upi', target: 'captured', value: 6000 },
  { source: 'upi', target: 'failed', value: 500 },
  { source: 'card', target: 'captured', value: 2600 },
  { source: 'card', target: 'failed', value: 250 },
  { source: 'wallet', target: 'captured', value: 350 },
  { source: 'wallet', target: 'failed', value: 50 },
  { source: 'emi', target: 'captured', value: 170 },
  { source: 'emi', target: 'failed', value: 10 },
  { source: 'bnpl', target: 'captured', value: 60 },
  { source: 'bnpl', target: 'failed', value: 10 },
];

const ids = (result: ReturnType<typeof groupSankeyData>): string[] =>
  result.nodes.map((entry) => entry.node.id);

describe('groupSankeyData — passthrough', () => {
  it('returns the data untouched when no threshold is set', () => {
    const result = groupSankeyData({ nodes, links });
    expect(ids(result)).toEqual(nodes.map((n) => n.id));
    expect(result.links).toHaveLength(links.length);
    expect(result.links.every((l) => !l.isAggregated)).toBe(true);
    expect(result.groups).toEqual([]);
    expect(result.total).toBe(10000);
  });

  it('keeps original indices so palette colours stay stable', () => {
    const result = groupSankeyData({ nodes, links });
    result.nodes.forEach((entry, i) => expect(entry.originalIndex).toBe(i));
    result.links.forEach((link, i) => expect(link.originalIndex).toBe(i));
  });

  it('drops links that reference unknown nodes', () => {
    const result = groupSankeyData({
      nodes,
      links: [...links, { source: 'ghost', target: 'upi', value: 1 }],
    });
    expect(result.links).toHaveLength(links.length);
  });
});

describe('groupSankeyData — folding', () => {
  it('folds every groupable node under the threshold into one group per column', () => {
    const result = groupSankeyData({ nodes, links, groupNodesBelow: 5 });

    expect(result.groups).toHaveLength(1);
    const [group] = result.groups;
    expect(group.depth).toBe(1);
    expect(group.memberIds).toEqual(['wallet', 'emi', 'bnpl']);
    expect(group.value).toBe(650);
    expect(group.isExpanded).toBe(false);
    expect(group.id).toBe(getGroupId(1));
    expect(isGroupNodeId(group.id)).toBe(true);

    // The group node takes the place of its first member; other nodes keep their order.
    expect(ids(result)).toEqual(['total', 'upi', 'card', group.id, 'captured', 'failed']);
    const groupEntry = result.nodes.find((entry) => entry.group)!;
    expect(groupEntry.originalIndex).toBeNull();
    expect(groupEntry.node.name).toBe('Other (3)');
  });

  it('re-points member links to the group and sums duplicates per pair', () => {
    const result = groupSankeyData({ nodes, links, groupNodesBelow: 5 });
    const groupId = getGroupId(1);

    const inbound = result.links.filter((l) => l.target === groupId);
    expect(inbound).toHaveLength(1);
    expect(inbound[0]).toMatchObject({ source: 'total', value: 650, isAggregated: true });
    // First constituent: Total → Wallet is link index 2.
    expect(inbound[0].originalIndex).toBe(2);

    const outbound = result.links.filter((l) => l.source === groupId);
    expect(outbound.map((l) => [l.target, l.value])).toEqual([
      ['captured', 580],
      ['failed', 70],
    ]);

    // Links between untouched nodes are unchanged.
    const upiCaptured = result.links.find((l) => l.source === 'upi' && l.target === 'captured');
    expect(upiCaptured).toMatchObject({ value: 6000, isAggregated: false, originalIndex: 5 });
  });

  it('never groups root nodes', () => {
    const roots: SankeyDataNode[] = [
      { id: 'a', name: 'A' },
      { id: 'b', name: 'B' },
      { id: 'out', name: 'Out' },
    ];
    const result = groupSankeyData({
      nodes: roots,
      links: [
        { source: 'a', target: 'out', value: 1 },
        { source: 'b', target: 'out', value: 1 },
      ],
      groupNodesBelow: 90,
    });
    expect(result.groups).toEqual([]);
  });

  it('does not group a lone small node', () => {
    const result = groupSankeyData({ nodes, links, groupNodesBelow: 1 });
    // Only BNPL (0.7%) is under 1% — a group of one hides nothing.
    expect(result.groups).toEqual([]);
    expect(ids(result)).toEqual(nodes.map((n) => n.id));
  });

  it('respects isGroupable: false', () => {
    // Failed (8.2%) would qualify at 10% but is opted out; Captured (91.8%) is above anyway.
    const result = groupSankeyData({ nodes, links, groupNodesBelow: 10 });
    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].depth).toBe(1);
    expect(result.groups[0].memberIds).toEqual(['wallet', 'emi', 'bnpl']);
  });

  it('turns grouping off for a zero or negative threshold', () => {
    expect(groupSankeyData({ nodes, links, groupNodesBelow: 0 }).groups).toEqual([]);
    expect(groupSankeyData({ nodes, links, groupNodesBelow: -2 }).groups).toEqual([]);
  });

  it('uses formatGroupLabel for the group node name', () => {
    const result = groupSankeyData({
      nodes,
      links,
      groupNodesBelow: 5,
      formatGroupLabel: ({ id, depth, members }) =>
        `Other methods (${members.length}) @${depth} ${id}`,
    });
    expect(result.nodes.find((entry) => entry.group)?.node.name).toBe(
      `Other methods (3) @1 ${getGroupId(1)}`,
    );
  });

  it('merges a link between two groups in adjacent columns', () => {
    // Total → methods → providers → outcomes, with a tail in both middle columns.
    const optimizer: SankeyDataNode[] = [
      { id: 'total', name: 'Total' },
      { id: 'upi', name: 'UPI' },
      { id: 'wallet', name: 'Wallet' },
      { id: 'emi', name: 'EMI' },
      { id: 'razorpay', name: 'Razorpay' },
      { id: 'p1', name: 'Provider 1' },
      { id: 'p2', name: 'Provider 2' },
      { id: 'captured', name: 'Captured', isGroupable: false },
    ];
    const flows: SankeyDataLink[] = [
      { source: 'total', target: 'upi', value: 9000 },
      { source: 'total', target: 'wallet', value: 60 },
      { source: 'total', target: 'emi', value: 40 },
      { source: 'upi', target: 'razorpay', value: 9000 },
      { source: 'wallet', target: 'p1', value: 60 },
      { source: 'emi', target: 'p2', value: 40 },
      { source: 'razorpay', target: 'captured', value: 9000 },
      { source: 'p1', target: 'captured', value: 60 },
      { source: 'p2', target: 'captured', value: 40 },
    ];
    const result = groupSankeyData({ nodes: optimizer, links: flows, groupNodesBelow: 2 });
    expect(result.groups.map((g) => [g.depth, g.memberIds])).toEqual([
      [1, ['wallet', 'emi']],
      [2, ['p1', 'p2']],
    ]);
    const between = result.links.find(
      (l) => l.source === getGroupId(1) && l.target === getGroupId(2),
    );
    expect(between).toMatchObject({ value: 100, isAggregated: true });
    expect(result.links.filter((l) => l.source === getGroupId(2))).toEqual([
      expect.objectContaining({ target: 'captured', value: 100 }),
    ]);
  });
});

describe('groupSankeyData — expanded groups', () => {
  it('shows the members of an expanded group in place, marked as revealed, with their links intact', () => {
    const groupId = getGroupId(1);
    const result = groupSankeyData({
      nodes,
      links,
      groupNodesBelow: 5,
      expandedGroupIds: [groupId],
    });

    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].isExpanded).toBe(true);
    expect(ids(result)).toEqual(nodes.map((n) => n.id));
    ['wallet', 'emi', 'bnpl'].forEach((id) => {
      const entry = result.nodes.find((e) => e.node.id === id)!;
      expect(entry.revealedGroupId).toBe(groupId);
      expect(entry.originalIndex).toBe(nodes.findIndex((n) => n.id === id));
    });
    expect(result.nodes.find((e) => e.node.id === 'upi')?.revealedGroupId).toBeUndefined();
    expect(result.links).toHaveLength(links.length);
    expect(result.links.every((l) => !l.isAggregated)).toBe(true);
  });

  it('ignores unknown ids in expandedGroupIds', () => {
    const result = groupSankeyData({
      nodes,
      links,
      groupNodesBelow: 5,
      expandedGroupIds: ['nope'],
    });
    expect(result.groups[0].isExpanded).toBe(false);
    expect(ids(result)).toContain(getGroupId(1));
  });
});
