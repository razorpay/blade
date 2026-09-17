import React from 'react';
import { TreeViewItem } from '../TreeViewItem';
import { TreeViewLoadMore } from '../TreeViewLoadMore';
import {
  getBranchSelectionState,
  getDisplayOverride,
  getSelectedGroups,
  getSelectedLeafValues,
  getSelectionAfterLoad,
  getSelectionOnNodeToggle,
  getTreeViewProperties,
  getVisibleOptionIndices,
  getVisibleValues,
} from '../treeViewUtils';

/**
 * Canonical tree from the tech spec's B2/B3 trace table:
 *
 * India
 * ├── Karnataka
 * │   ├── Bengaluru
 * │   └── Mysuru
 * └── Goa
 */
const getCanonicalTree = (): React.ReactNode => (
  <TreeViewItem title="India" value="india">
    <TreeViewItem title="Karnataka" value="karnataka">
      <TreeViewItem title="Bengaluru" value="bengaluru" />
      <TreeViewItem title="Mysuru" value="mysuru" />
    </TreeViewItem>
    <TreeViewItem title="Goa" value="goa" />
  </TreeViewItem>
);

describe('getTreeViewProperties', () => {
  it('should flatten the tree into a stable, document-ordered registration list', () => {
    const { options, orderedNodes, rootValues, maxLevel } = getTreeViewProperties(
      getCanonicalTree(),
    );

    // collapsed rows are still registered - indices stay stable across expand/collapse
    expect(options.map((option) => option.value)).toEqual([
      'india',
      'karnataka',
      'bengaluru',
      'mysuru',
      'goa',
    ]);
    expect(options.map((option) => option.title)).toEqual([
      'India',
      'Karnataka',
      'Bengaluru',
      'Mysuru',
      'Goa',
    ]);
    expect(orderedNodes.map((node) => node.optionIndex)).toEqual([0, 1, 2, 3, 4]);
    expect(rootValues).toEqual(['india']);
    expect(maxLevel).toBe(3);
  });

  it('should compute level, posinset, setsize and parent relationships', () => {
    const { nodeMap } = getTreeViewProperties(getCanonicalTree());

    expect(nodeMap.india).toMatchObject({
      level: 1,
      posInSet: 1,
      setSize: 1,
      parentValue: null,
      isBranch: true,
      hasRenderedChildren: true,
    });
    expect(nodeMap.karnataka).toMatchObject({
      level: 2,
      posInSet: 1,
      setSize: 2,
      parentValue: 'india',
    });
    expect(nodeMap.goa).toMatchObject({
      level: 2,
      posInSet: 2,
      setSize: 2,
      parentValue: 'india',
      isBranch: false,
    });
    expect(nodeMap.bengaluru).toMatchObject({ level: 3, posInSet: 1, setSize: 2 });
  });

  it('should compute selectable leaf descendants for branches', () => {
    const { nodeMap } = getTreeViewProperties(getCanonicalTree());

    expect(nodeMap.india.selectableLeafValues).toEqual(['bengaluru', 'mysuru', 'goa']);
    expect(nodeMap.karnataka.selectableLeafValues).toEqual(['bengaluru', 'mysuru']);
    expect(nodeMap.goa.selectableLeafValues).toEqual([]);
  });

  it('should exclude disabled subtrees from registration but keep them in the registry for rendering', () => {
    const { options, nodeMap } = getTreeViewProperties(
      <TreeViewItem title="India" value="india">
        <TreeViewItem title="Karnataka" value="karnataka" isDisabled>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
        </TreeViewItem>
        <TreeViewItem title="Goa" value="goa" />
      </TreeViewItem>,
    );

    expect(options.map((option) => option.value)).toEqual(['india', 'goa']);
    // still present for rendering, but unregistered and effectively disabled
    expect(nodeMap.karnataka).toMatchObject({ isDisabled: true, optionIndex: -1 });
    expect(nodeMap.bengaluru).toMatchObject({ isDisabled: true, optionIndex: -1 });
    // B2: disabled subtree does not count towards the parent's selectable leaves
    expect(nodeMap.india.selectableLeafValues).toEqual(['goa']);
  });

  it('should treat items with hasChildren as branches without loaded leaves', () => {
    const { nodeMap } = getTreeViewProperties(
      <TreeViewItem title="Kerala" value="kerala" hasChildren />,
    );

    expect(nodeMap.kerala).toMatchObject({
      isBranch: true,
      hasRenderedChildren: false,
      selectableLeafValues: [],
    });
  });

  it('should register TreeViewLoadMore rows with a synthetic value', () => {
    const onClick = jest.fn();
    const { options, nodeMap } = getTreeViewProperties(
      <TreeViewItem title="Karnataka" value="karnataka">
        <TreeViewItem title="Bengaluru" value="bengaluru" />
        <TreeViewLoadMore onClick={onClick} />
      </TreeViewItem>,
    );

    expect(options).toHaveLength(3);
    expect(options[2].title).toBe('Show more');
    const loadMoreNode = Object.values(nodeMap).find((node) => node.kind === 'loadMore');
    expect(loadMoreNode).toMatchObject({
      parentValue: 'karnataka',
      level: 2,
      posInSet: 2,
      setSize: 2,
      optionIndex: 2,
    });
    // B7: LoadMore never participates in selection
    expect(nodeMap.karnataka.selectableLeafValues).toEqual(['bengaluru']);

    options[2].onClickTrigger?.(true);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger loadMore onClick while loading', () => {
    const onClick = jest.fn();
    const { options } = getTreeViewProperties(<TreeViewLoadMore onClick={onClick} isLoading />);

    options[0].onClickTrigger?.(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should throw on duplicate values (B10)', () => {
    expect(() =>
      getTreeViewProperties(
        <TreeViewItem title="India" value="india">
          <TreeViewItem title="India Again" value="india" />
        </TreeViewItem>,
      ),
    ).toThrow('[Blade: TreeView]: Duplicate value "india" found in TreeViewItem');
  });

  it('should throw on unsupported children (B10)', () => {
    expect(() => getTreeViewProperties(<div>hello</div>)).toThrow(
      '[Blade: TreeView]: Only TreeViewItem, TreeViewLoadMore are supported inside TreeView',
    );
  });

  it('should call item onClick through the registered onClickTrigger', () => {
    const onClick = jest.fn();
    const { options } = getTreeViewProperties(
      <TreeViewItem title="Goa" value="goa" onClick={onClick} />,
    );

    options[0].onClickTrigger?.(true);
    expect(onClick).toHaveBeenCalledWith({ name: 'goa', value: true });
  });
});

describe('getBranchSelectionState (B2)', () => {
  const { nodeMap } = getTreeViewProperties(getCanonicalTree());

  it('should be none when no leaf is selected', () => {
    expect(getBranchSelectionState(nodeMap.karnataka, new Set())).toBe('none');
    expect(getBranchSelectionState(nodeMap.india, new Set())).toBe('none');
  });

  it('should be some (indeterminate) when a strict subset is selected', () => {
    expect(getBranchSelectionState(nodeMap.karnataka, new Set(['bengaluru']))).toBe('some');
    expect(getBranchSelectionState(nodeMap.india, new Set(['bengaluru', 'mysuru']))).toBe('some');
  });

  it('should be all when every selectable leaf is selected', () => {
    expect(getBranchSelectionState(nodeMap.karnataka, new Set(['bengaluru', 'mysuru']))).toBe(
      'all',
    );
    expect(getBranchSelectionState(nodeMap.india, new Set(['bengaluru', 'mysuru', 'goa']))).toBe(
      'all',
    );
  });

  it('should show checked when the only unselected descendants are disabled (B2)', () => {
    const { nodeMap: nodeMapWithDisabled } = getTreeViewProperties(
      <TreeViewItem title="Karnataka" value="karnataka">
        <TreeViewItem title="Bengaluru" value="bengaluru" />
        <TreeViewItem title="Mysuru" value="mysuru" isDisabled />
      </TreeViewItem>,
    );

    expect(getBranchSelectionState(nodeMapWithDisabled.karnataka, new Set(['bengaluru']))).toBe(
      'all',
    );
  });

  it('should be none for branches without loaded leaves', () => {
    const { nodeMap: asyncNodeMap } = getTreeViewProperties(
      <TreeViewItem title="Kerala" value="kerala" hasChildren />,
    );
    expect(getBranchSelectionState(asyncNodeMap.kerala, new Set())).toBe('none');
  });
});

describe('getSelectedGroups (B3 canonical trace)', () => {
  const { nodeMap, rootValues } = getTreeViewProperties(getCanonicalTree());

  it('check Bengaluru: values=[bengaluru], selectedGroups=[]', () => {
    const selectedValues = new Set(['bengaluru']);
    expect(getSelectedGroups({ rootValues, nodeMap, selectedValues })).toEqual([]);
  });

  it('check Mysuru too: Karnataka becomes the topmost fully-selected branch', () => {
    const selectedValues = new Set(['bengaluru', 'mysuru']);
    expect(getSelectedGroups({ rootValues, nodeMap, selectedValues })).toEqual(['karnataka']);
  });

  it('check Goa too: India becomes the topmost fully-selected branch (karnataka not duplicated)', () => {
    const selectedValues = new Set(['bengaluru', 'mysuru', 'goa']);
    expect(getSelectedGroups({ rootValues, nodeMap, selectedValues })).toEqual(['india']);
  });

  it('uncheck Bengaluru: no fully-selected branches remain', () => {
    const selectedValues = new Set(['mysuru', 'goa']);
    expect(getSelectedGroups({ rootValues, nodeMap, selectedValues })).toEqual([]);
  });
});

describe('getSelectedLeafValues', () => {
  const { orderedNodes } = getTreeViewProperties(getCanonicalTree());

  it('should return selected leaves in document order and never branch values (B3)', () => {
    expect(
      getSelectedLeafValues(orderedNodes, new Set(['goa', 'bengaluru', 'karnataka', 'india'])),
    ).toEqual(['bengaluru', 'goa']);
  });
});

describe('getDisplayOverride (D5)', () => {
  const properties = getTreeViewProperties(getCanonicalTree());
  const { orderedNodes, rootValues, nodeMap } = properties;

  it('should return undefined when nothing is selected', () => {
    expect(
      getDisplayOverride({ orderedNodes, rootValues, nodeMap, selectedValues: new Set() }),
    ).toBeUndefined();
  });

  it('should show the single leaf title', () => {
    expect(
      getDisplayOverride({
        orderedNodes,
        rootValues,
        nodeMap,
        selectedValues: new Set(['bengaluru']),
      }),
    ).toEqual({ label: 'Bengaluru', count: 1 });
  });

  it('should count a fully selected branch as one entry', () => {
    expect(
      getDisplayOverride({
        orderedNodes,
        rootValues,
        nodeMap,
        selectedValues: new Set(['bengaluru', 'mysuru']),
      }),
    ).toEqual({ label: 'Karnataka', count: 1 });
  });

  it('should collapse to the topmost branch when everything is selected', () => {
    expect(
      getDisplayOverride({
        orderedNodes,
        rootValues,
        nodeMap,
        selectedValues: new Set(['bengaluru', 'mysuru', 'goa']),
      }),
    ).toEqual({ label: 'India', count: 1 });
  });

  it('should count leaves not covered by a fully selected branch individually', () => {
    expect(
      getDisplayOverride({
        orderedNodes,
        rootValues,
        nodeMap,
        selectedValues: new Set(['bengaluru', 'goa']),
      }),
    ).toEqual({ label: 'Bengaluru', count: 2 });
  });
});

describe('getVisibleValues / getVisibleOptionIndices', () => {
  const properties = getTreeViewProperties(getCanonicalTree());
  const { orderedNodes, nodeMap } = properties;

  it('should only include rows whose ancestors are all expanded', () => {
    expect(getVisibleValues({ orderedNodes, nodeMap, expandedValues: new Set() })).toEqual([
      'india',
    ]);

    expect(
      getVisibleValues({ orderedNodes, nodeMap, expandedValues: new Set(['india']) }),
    ).toEqual(['india', 'karnataka', 'goa']);

    expect(
      getVisibleValues({
        orderedNodes,
        nodeMap,
        expandedValues: new Set(['india', 'karnataka']),
      }),
    ).toEqual(['india', 'karnataka', 'bengaluru', 'mysuru', 'goa']);

    // karnataka expanded but india collapsed: nothing under india is traversable
    expect(
      getVisibleValues({ orderedNodes, nodeMap, expandedValues: new Set(['karnataka']) }),
    ).toEqual(['india']);
  });

  it('should skip disabled rows', () => {
    const { orderedNodes: nodes, nodeMap: map } = getTreeViewProperties(
      <TreeViewItem title="India" value="india">
        <TreeViewItem title="Karnataka" value="karnataka" isDisabled>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
        </TreeViewItem>
        <TreeViewItem title="Goa" value="goa" />
      </TreeViewItem>,
    );

    expect(
      getVisibleValues({
        orderedNodes: nodes,
        nodeMap: map,
        expandedValues: new Set(['india', 'karnataka']),
      }),
    ).toEqual(['india', 'goa']);
  });

  it('should map visible rows to their stable option indices', () => {
    expect(
      getVisibleOptionIndices({ orderedNodes, nodeMap, expandedValues: new Set(['india']) }),
    ).toEqual([0, 1, 4]);
  });
});

describe('getSelectionOnNodeToggle (B2 cascade)', () => {
  const { nodeMap } = getTreeViewProperties(getCanonicalTree());

  it('should toggle a leaf', () => {
    expect(getSelectionOnNodeToggle({ node: nodeMap.goa, selectedValues: new Set() })).toEqual(
      new Set(['goa']),
    );
    expect(
      getSelectionOnNodeToggle({ node: nodeMap.goa, selectedValues: new Set(['goa']) }),
    ).toEqual(new Set());
  });

  it('should select all leaves of an unchecked / indeterminate branch', () => {
    expect(
      getSelectionOnNodeToggle({ node: nodeMap.karnataka, selectedValues: new Set() }),
    ).toEqual(new Set(['bengaluru', 'mysuru']));
    expect(
      getSelectionOnNodeToggle({
        node: nodeMap.karnataka,
        selectedValues: new Set(['bengaluru']),
      }),
    ).toEqual(new Set(['bengaluru', 'mysuru']));
  });

  it('should deselect all leaves of a fully selected branch', () => {
    expect(
      getSelectionOnNodeToggle({
        node: nodeMap.india,
        selectedValues: new Set(['bengaluru', 'mysuru', 'goa']),
      }),
    ).toEqual(new Set());
  });
});

describe('getSelectionAfterLoad (B6)', () => {
  it('should select newly loaded children when their parent was fully selected at arrival', () => {
    const before = getTreeViewProperties(
      <TreeViewItem title="Karnataka" value="karnataka" hasChildren>
        <TreeViewItem title="Bengaluru" value="bengaluru" />
      </TreeViewItem>,
    );
    const after = getTreeViewProperties(
      <TreeViewItem title="Karnataka" value="karnataka" hasChildren>
        <TreeViewItem title="Bengaluru" value="bengaluru" />
        <TreeViewItem title="Mysuru" value="mysuru" />
      </TreeViewItem>,
    );

    // parent fully selected before the load -> new leaf inherits selection
    expect(
      getSelectionAfterLoad({
        previousNodeMap: before.nodeMap,
        nodeMap: after.nodeMap,
        orderedNodes: after.orderedNodes,
        selectedValues: new Set(['bengaluru']),
      }),
    ).toEqual(new Set(['bengaluru', 'mysuru']));

    // parent not fully selected -> no inheritance
    expect(
      getSelectionAfterLoad({
        previousNodeMap: before.nodeMap,
        nodeMap: after.nodeMap,
        orderedNodes: after.orderedNodes,
        selectedValues: new Set(),
      }),
    ).toEqual(new Set());
  });

  it('should not inherit anything on first mount (no previous registry)', () => {
    const properties = getTreeViewProperties(getCanonicalTree());
    expect(
      getSelectionAfterLoad({
        previousNodeMap: {},
        nodeMap: properties.nodeMap,
        orderedNodes: properties.orderedNodes,
        selectedValues: new Set(['bengaluru']),
      }),
    ).toEqual(new Set(['bengaluru']));
  });
});
