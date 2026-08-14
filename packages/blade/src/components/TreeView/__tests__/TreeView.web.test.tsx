import React from 'react';
import userEvents from '@testing-library/user-event';
import { fireEvent, waitFor } from '@testing-library/react';
import { TreeView } from '../TreeView';
import { TreeViewItem } from '../TreeViewItem';
import { TreeViewLoadMore } from '../TreeViewLoadMore';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

// `renderWithTheme` wraps only the initial render; rerenders need the provider again
const withTheme = (ui: React.ReactElement): React.ReactElement => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    {ui}
  </BladeProvider>
);

// jsdom's transitionend does not carry propertyName through React's synthetic event,
// so the native event has to be built by hand
const makeGridRowsTransitionEndEvent = (): Event => {
  const event = new Event('transitionend', { bubbles: true });
  Object.defineProperty(event, 'propertyName', { value: 'grid-template-rows' });
  return event;
};

const getCanonicalTree = ({
  defaultIsExpanded = true,
}: { defaultIsExpanded?: boolean } = {}): React.ReactElement => (
  <TreeViewItem title="India" value="india" defaultIsExpanded={defaultIsExpanded}>
    <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded={defaultIsExpanded}>
      <TreeViewItem title="Bengaluru" value="bengaluru" />
      <TreeViewItem title="Mysuru" value="mysuru" />
    </TreeViewItem>
    <TreeViewItem title="Goa" value="goa" />
  </TreeViewItem>
);

describe('<TreeView /> standalone', () => {
  it('should render tree with treeitem rows and no listbox/menuitem roles (AC5)', () => {
    const { getByRole, getAllByRole, container, queryAllByRole } = renderWithTheme(
      <TreeView>{getCanonicalTree()}</TreeView>,
    );

    expect(getByRole('tree')).toBeInTheDocument();
    expect(getAllByRole('treeitem')).toHaveLength(5);
    expect(queryAllByRole('menuitem')).toHaveLength(0);
    expect(queryAllByRole('menuitemcheckbox')).toHaveLength(0);
    expect(queryAllByRole('option')).toHaveLength(0);
    expect(container).toMatchSnapshot();
  });

  it('should render aria-level, aria-posinset, aria-setsize on rows', () => {
    const { getByRole } = renderWithTheme(<TreeView>{getCanonicalTree()}</TreeView>);

    const india = getByRole('treeitem', { name: 'India' });
    expect(india).toHaveAttribute('aria-level', '1');
    expect(india).toHaveAttribute('aria-posinset', '1');
    expect(india).toHaveAttribute('aria-setsize', '1');

    const goa = getByRole('treeitem', { name: 'Goa' });
    expect(goa).toHaveAttribute('aria-level', '2');
    expect(goa).toHaveAttribute('aria-posinset', '2');
    expect(goa).toHaveAttribute('aria-setsize', '2');

    const bengaluru = getByRole('treeitem', { name: 'Bengaluru' });
    expect(bengaluru).toHaveAttribute('aria-level', '3');
  });

  it('should pass a11y audit in single and multiple selection', async () => {
    const { getByRole, rerender } = renderWithTheme(
      <TreeView selectionType="single">{getCanonicalTree()}</TreeView>,
    );
    await assertAccessible(getByRole('tree'));

    rerender(withTheme(<TreeView selectionType="multiple">{getCanonicalTree()}</TreeView>));
    expect(getByRole('tree')).toHaveAttribute('aria-multiselectable', 'true');
    await assertAccessible(getByRole('tree'));
  });

  // B1
  it('should select single node with radio semantics, branch node is a valid selection (B1)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="single" name="regions" onChange={onChange}>
        {getCanonicalTree()}
      </TreeView>,
    );

    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(getByRole('treeitem', { name: 'Bengaluru' })).toHaveAttribute('aria-selected', 'true');
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['bengaluru'],
      selectedGroups: [],
    });

    // selecting another node moves the selection
    await user.click(getByRole('treeitem', { name: 'Goa' }));
    expect(getByRole('treeitem', { name: 'Bengaluru' })).toHaveAttribute('aria-selected', 'false');
    expect(getByRole('treeitem', { name: 'Goa' })).toHaveAttribute('aria-selected', 'true');

    // branch is a valid selection in single mode and does not cascade
    await user.click(getByRole('treeitem', { name: 'Karnataka' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['karnataka'],
      selectedGroups: [],
    });
    expect(getByRole('treeitem', { name: 'Bengaluru' })).toHaveAttribute('aria-selected', 'false');
  });

  it('should toggle expansion instead of selecting on a branch with isSelectable={false}', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole, queryAllByRole } = renderWithTheme(
      <TreeView selectionType="single" name="cities" onChange={onChange}>
        <TreeViewItem title="India" value="india" isSelectable={false} defaultIsExpanded>
          <TreeViewItem title="Karnataka" value="karnataka" isSelectable={false}>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
          </TreeViewItem>
        </TreeViewItem>
      </TreeView>,
    );

    // non-selectable branches carry no selection semantics
    const karnataka = getByRole('treeitem', { name: 'Karnataka' });
    expect(karnataka).not.toHaveAttribute('aria-selected');
    expect(karnataka).toHaveAttribute('aria-expanded', 'false');

    // row click toggles expansion instead of selecting
    await user.click(karnataka);
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-expanded', 'true');
    expect(onChange).not.toHaveBeenCalled();

    // Enter on the row collapses it again
    getByRole('treeitem', { name: 'Karnataka' }).focus();
    await user.keyboard('{Enter}');
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).not.toHaveBeenCalled();

    // leaves remain selectable
    await user.click(getByRole('treeitem', { name: 'Karnataka' }));
    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'cities',
      values: ['bengaluru'],
      selectedGroups: [],
    });
    expect(queryAllByRole('treeitem', { selected: true })).toHaveLength(1);
  });

  it('should render no checkbox for a branch with isSelectable={false} in multiple selection', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple" name="cities" onChange={onChange}>
        <TreeViewItem title="Karnataka" value="karnataka" isSelectable={false} defaultIsExpanded>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
          <TreeViewItem title="Mysuru" value="mysuru" />
        </TreeViewItem>
      </TreeView>,
    );

    const karnataka = getByRole('treeitem', { name: 'Karnataka' });
    expect(karnataka).not.toHaveAttribute('aria-checked');
    expect(karnataka.querySelector('input[type="checkbox"]')).toBeNull();

    // branch click toggles expansion instead of cascading
    await user.click(karnataka);
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).not.toHaveBeenCalled();

    await user.click(getByRole('treeitem', { name: 'Karnataka' }));
    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'cities',
      values: ['bengaluru'],
      selectedGroups: [],
    });
  });

  // B2 + B3 canonical trace
  it('should follow the canonical multiple-selection trace (B2, B3)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple" onChange={onChange}>
        {getCanonicalTree()}
      </TreeView>,
    );

    const india = getByRole('treeitem', { name: 'India' });
    const karnataka = getByRole('treeitem', { name: 'Karnataka' });

    // 1. check Bengaluru
    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: ['bengaluru'], selectedGroups: [] }),
    );
    expect(karnataka).toHaveAttribute('aria-checked', 'mixed');
    expect(india).toHaveAttribute('aria-checked', 'mixed');

    // 2. check Mysuru -> Karnataka fully selected
    await user.click(getByRole('treeitem', { name: 'Mysuru' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        values: ['bengaluru', 'mysuru'],
        selectedGroups: ['karnataka'],
      }),
    );
    expect(karnataka).toHaveAttribute('aria-checked', 'true');
    expect(india).toHaveAttribute('aria-checked', 'mixed');

    // 3. check Goa -> India fully selected, karnataka not duplicated
    await user.click(getByRole('treeitem', { name: 'Goa' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        values: ['bengaluru', 'mysuru', 'goa'],
        selectedGroups: ['india'],
      }),
    );
    expect(india).toHaveAttribute('aria-checked', 'true');

    // 4. uncheck India -> everything deselected in one change
    onChange.mockClear();
    await user.click(india);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: [], selectedGroups: [] }),
    );
    expect(karnataka).toHaveAttribute('aria-checked', 'false');
  });

  it('should toggle all enabled leaves on branch selection and ignore disabled ones (B2)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple" onChange={onChange}>
        <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
          <TreeViewItem title="Mysuru" value="mysuru" isDisabled />
        </TreeViewItem>
      </TreeView>,
    );

    await user.click(getByRole('treeitem', { name: 'Karnataka' }));
    // disabled leaf is not selected by the cascade
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: ['bengaluru'], selectedGroups: ['karnataka'] }),
    );
    // branch whose only unselected descendants are disabled shows checked, not indeterminate
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-checked', 'true');
  });

  // B4
  it('should disable the entire subtree of disabled items (B4)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple" onChange={onChange}>
        <TreeViewItem title="India" value="india" defaultIsExpanded>
          <TreeViewItem title="Karnataka" value="karnataka" isDisabled defaultIsExpanded>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
          </TreeViewItem>
          <TreeViewItem title="Goa" value="goa" />
        </TreeViewItem>
      </TreeView>,
    );

    const karnataka = getByRole('treeitem', { name: 'Karnataka' });
    expect(karnataka).toHaveAttribute('aria-disabled', 'true');

    await user.click(karnataka);
    expect(onChange).not.toHaveBeenCalled();

    // India's cascade only touches Goa since the Karnataka subtree is disabled
    await user.click(getByRole('treeitem', { name: 'India' }));
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: ['goa'], selectedGroups: ['india'] }),
    );
  });

  // B5
  it('should toggle expansion on chevron click without selecting (B5)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const onExpandChange = jest.fn();
    const { getByRole, getByText } = renderWithTheme(
      <TreeView selectionType="multiple" onChange={onChange}>
        <TreeViewItem title="Karnataka" value="karnataka" onExpandChange={onExpandChange}>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
        </TreeViewItem>
      </TreeView>,
    );

    const karnataka = getByRole('treeitem', { name: 'Karnataka' });
    expect(karnataka).toHaveAttribute('aria-expanded', 'false');
    // collapsed child is hidden from the a11y tree
    expect(getByText('Bengaluru')).not.toBeVisible();

    // chevron is the first aria-hidden element inside the row
    const chevron = karnataka.querySelector('[aria-hidden="true"]') as HTMLElement;
    await user.click(chevron);

    expect(karnataka).toHaveAttribute('aria-expanded', 'true');
    expect(onExpandChange).toHaveBeenCalledWith({ isExpanded: true });
    // chevron click never selects
    expect(onChange).not.toHaveBeenCalled();
    expect(getByText('Bengaluru')).toBeVisible();

    await user.click(chevron);
    expect(karnataka).toHaveAttribute('aria-expanded', 'false');
    expect(onExpandChange).toHaveBeenLastCalledWith({ isExpanded: false });
  });

  // B5: the animation wrapper clips its content, which would cut off the focus ring
  // (an outline painted outside the row's box) of every row nested inside it
  it('should only clip the children group while it is collapsed or animating', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(<TreeView>{getCanonicalTree()}</TreeView>);

    const karnatakaRow = getByRole('treeitem', { name: 'Karnataka' });
    // the group animator is the row's sibling; the clip sits on the role=group element it wraps
    const animator = karnatakaRow.nextElementSibling as HTMLElement;
    const getGroupOverflow = (): string =>
      window.getComputedStyle(animator.firstElementChild as HTMLElement).overflow;

    // a group that mounts already expanded never animates, so it must not clip from the start
    expect(getGroupOverflow()).toBe('visible');

    // collapsing clips immediately so the rows stay hidden as the group closes
    const chevron = karnatakaRow.querySelector('[aria-hidden="true"]') as HTMLElement;
    await user.click(chevron);
    expect(getGroupOverflow()).toBe('hidden');

    // re-expanding keeps clipping while the transition is in flight...
    await user.click(chevron);
    expect(getGroupOverflow()).toBe('hidden');

    // ...and releases it once the group has settled open
    fireEvent(animator, makeGridRowsTransitionEndEvent());
    expect(getGroupOverflow()).toBe('visible');

    // a transition bubbling up from a descendant must not release the clip early
    await user.click(chevron);
    expect(getGroupOverflow()).toBe('hidden');
    await user.click(chevron);
    fireEvent(animator.firstElementChild as HTMLElement, makeGridRowsTransitionEndEvent());
    expect(getGroupOverflow()).toBe('hidden');
  });

  it('should support controlled expansion via isExpanded', () => {
    const { getByRole, rerender } = renderWithTheme(
      <TreeView>
        <TreeViewItem title="Karnataka" value="karnataka" isExpanded={false}>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
        </TreeViewItem>
      </TreeView>,
    );

    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-expanded', 'false');

    rerender(
      withTheme(
        <TreeView>
          <TreeViewItem title="Karnataka" value="karnataka" isExpanded={true}>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
          </TreeViewItem>
        </TreeView>,
      ),
    );
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-expanded', 'true');
  });

  // B6
  it('should inherit selection for newly loaded children of a fully selected branch (B6)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole, rerender } = renderWithTheme(
      <TreeView selectionType="multiple" onChange={onChange}>
        <TreeViewItem title="Karnataka" value="karnataka" hasChildren defaultIsExpanded>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
        </TreeViewItem>
      </TreeView>,
    );

    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-checked', 'true');

    // more children arrive while the branch is fully selected
    rerender(
      withTheme(
        <TreeView selectionType="multiple" onChange={onChange}>
          <TreeViewItem title="Karnataka" value="karnataka" hasChildren defaultIsExpanded>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
            <TreeViewItem title="Mysuru" value="mysuru" />
          </TreeViewItem>
        </TreeView>,
      ),
    );

    // the appended row animates its own mount (row mount animator), so it becomes visible on the next frame
    await waitFor(() =>
      expect(getByRole('treeitem', { name: 'Mysuru' })).toHaveAttribute('aria-checked', 'true'),
    );
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        values: ['bengaluru', 'mysuru'],
        selectedGroups: ['karnataka'],
      }),
    );
  });

  // B5 + B6
  it('should animate open when async children arrive on an already expanded branch (B5)', async () => {
    const { getByRole, rerender } = renderWithTheme(
      <TreeView>
        <TreeViewItem title="Karnataka" value="karnataka" hasChildren defaultIsExpanded />
      </TreeView>,
    );

    // children arrive after the fetch, while the branch is already expanded
    rerender(
      withTheme(
        <TreeView>
          <TreeViewItem title="Karnataka" value="karnataka" hasChildren defaultIsExpanded>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
          </TreeViewItem>
        </TreeView>,
      ),
    );

    // the group mounts collapsed (0fr) and flips to expanded on the next frame so the
    // grid-template-rows transition runs; the children must end up visible
    await waitFor(() => expect(getByRole('treeitem', { name: 'Bengaluru' })).toBeVisible());
  });

  it('should render a spinner chevron slot while branch isLoading', () => {
    const { getByRole } = renderWithTheme(
      <TreeView>
        <TreeViewItem title="Karnataka" value="karnataka" hasChildren isLoading />
      </TreeView>,
    );

    const karnataka = getByRole('treeitem', { name: 'Karnataka' });
    expect(karnataka.querySelector('[data-blade-component="spinner"]')).toBeInTheDocument();
  });

  // B7
  it('should activate TreeViewLoadMore on click and stay inert while loading (B7)', async () => {
    const user = userEvents.setup();
    const onLoadMore = jest.fn();
    const onChange = jest.fn();
    const { getByRole, rerender } = renderWithTheme(
      <TreeView selectionType="multiple" onChange={onChange}>
        <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
          <TreeViewLoadMore onClick={onLoadMore} />
        </TreeViewItem>
      </TreeView>,
    );

    const loadMore = getByRole('treeitem', { name: 'Show more' });
    await user.click(loadMore);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    // LoadMore is never selected
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      withTheme(
        <TreeView selectionType="multiple" onChange={onChange}>
          <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
            <TreeViewLoadMore onClick={onLoadMore} isLoading />
          </TreeViewItem>
        </TreeView>,
      ),
    );

    // while loading, the label switches to 'Loading...' (Figma loading state) and the row is inert
    const loadingRow = getByRole('treeitem', { name: 'Loading...' });
    expect(loadingRow).toHaveAttribute('aria-busy', 'true');
    await user.click(loadingRow);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  // B5 + B7
  it('should animate the mount of rows appended through TreeViewLoadMore at branch and root', async () => {
    const { getByRole, rerender } = renderWithTheme(
      <TreeView>
        <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
          <TreeViewLoadMore onClick={jest.fn()} />
        </TreeViewItem>
        <TreeViewLoadMore onClick={jest.fn()} />
      </TreeView>,
    );

    // more items arrive after the load, appended into the existing group and at the root
    rerender(
      withTheme(
        <TreeView>
          <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
            <TreeViewItem title="Mysuru" value="mysuru" />
            <TreeViewLoadMore onClick={jest.fn()} />
          </TreeViewItem>
          <TreeViewItem title="Goa" value="goa" />
          <TreeViewLoadMore onClick={jest.fn()} />
        </TreeView>,
      ),
    );

    // appended rows mount collapsed (0fr) and flip to expanded on the next frame so the
    // grid-template-rows transition runs; they must end up visible
    await waitFor(() => expect(getByRole('treeitem', { name: 'Mysuru' })).toBeVisible());
    await waitFor(() => expect(getByRole('treeitem', { name: 'Goa' })).toBeVisible());
    // rows that were already mounted are untouched
    expect(getByRole('treeitem', { name: 'Bengaluru' })).toBeVisible();
  });

  // B10
  it('should throw on duplicate values (B10)', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      renderWithTheme(
        <TreeView>
          <TreeViewItem title="Goa" value="goa" />
          <TreeViewItem title="Goa 2" value="goa" />
        </TreeView>,
      ),
    ).toThrow('[Blade: TreeView]: Duplicate value "goa" found in TreeViewItem');
    consoleError.mockRestore();
  });

  // B10
  it('should throw on children other than TreeViewItem / TreeViewLoadMore (B10)', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      renderWithTheme(
        <TreeView>
          <div>not a tree item</div>
        </TreeView>,
      ),
    ).toThrow(
      '[Blade: TreeView]: Only TreeViewItem, TreeViewLoadMore are supported inside TreeView',
    );
    consoleError.mockRestore();
  });

  // B12 + B9
  it('should render an item without children and without hasChildren as a leaf with an empty chevron slot (B12, B9)', () => {
    const { getByRole } = renderWithTheme(
      <TreeView>
        <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
        </TreeViewItem>
      </TreeView>,
    );

    const bengaluru = getByRole('treeitem', { name: 'Bengaluru' });
    // leaf: no expansion semantics, and the reserved chevron slot stays empty so the
    // row still aligns with its branch siblings (B9)
    expect(bengaluru).not.toHaveAttribute('aria-expanded');
    expect(bengaluru.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(bengaluru.querySelector('svg')).toBeNull();

    // branch rows do render the chevron
    const karnataka = getByRole('treeitem', { name: 'Karnataka' });
    expect(karnataka.querySelector('[aria-hidden="true"] svg')).toBeInTheDocument();
  });

  // B11: controlled/uncontrolled standalone selection
  it('should support uncontrolled selection with defaultValue', () => {
    const { getByRole } = renderWithTheme(
      <TreeView selectionType="multiple" defaultValue={['bengaluru', 'mysuru']}>
        {getCanonicalTree()}
      </TreeView>,
    );

    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-checked', 'true');
    expect(getByRole('treeitem', { name: 'Goa' })).toHaveAttribute('aria-checked', 'false');
  });

  it('should support controlled selection with value (B11)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole, rerender } = renderWithTheme(
      <TreeView selectionType="multiple" value={['bengaluru']} onChange={onChange}>
        {getCanonicalTree()}
      </TreeView>,
    );

    const goa = getByRole('treeitem', { name: 'Goa' });
    expect(getByRole('treeitem', { name: 'Bengaluru' })).toHaveAttribute('aria-checked', 'true');
    expect(goa).toHaveAttribute('aria-checked', 'false');

    // clicking fires onChange but does not change state until the consumer updates `value`
    await user.click(goa);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: ['bengaluru', 'goa'] }),
    );
    expect(goa).toHaveAttribute('aria-checked', 'false');

    rerender(
      withTheme(
        <TreeView selectionType="multiple" value={['bengaluru', 'goa']} onChange={onChange}>
          {getCanonicalTree()}
        </TreeView>,
      ),
    );
    expect(goa).toHaveAttribute('aria-checked', 'true');
  });

  it('should call the item onClick handler on row click', async () => {
    const user = userEvents.setup();
    const onItemClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <TreeView>
        <TreeViewItem title="Goa" value="goa" onClick={onItemClick} />
      </TreeView>,
    );

    await user.click(getByRole('treeitem', { name: 'Goa' }));
    expect(onItemClick).toHaveBeenCalledWith({
      name: 'goa',
      value: false,
      event: expect.any(Object),
    });
  });

  describe('keyboard map (§5)', () => {
    it('should move focus with ArrowDown/ArrowUp/Home/End skipping collapsed subtrees', async () => {
      const user = userEvents.setup();
      const { getByRole } = renderWithTheme(
        <TreeView>
          <TreeViewItem title="India" value="india" defaultIsExpanded>
            {/* karnataka collapsed: bengaluru/mysuru skipped */}
            <TreeViewItem title="Karnataka" value="karnataka">
              <TreeViewItem title="Bengaluru" value="bengaluru" />
              <TreeViewItem title="Mysuru" value="mysuru" />
            </TreeViewItem>
            <TreeViewItem title="Goa" value="goa" />
          </TreeViewItem>
        </TreeView>,
      );

      // roving tabindex: first visible row is tabbable
      await user.tab();
      expect(getByRole('treeitem', { name: 'India' })).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveFocus();

      // collapsed children are skipped
      await user.keyboard('{ArrowDown}');
      expect(getByRole('treeitem', { name: 'Goa' })).toHaveFocus();

      await user.keyboard('{Home}');
      expect(getByRole('treeitem', { name: 'India' })).toHaveFocus();

      await user.keyboard('{End}');
      expect(getByRole('treeitem', { name: 'Goa' })).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveFocus();
    });

    it('should expand/collapse and traverse with ArrowRight/ArrowLeft', async () => {
      const user = userEvents.setup();
      const { getByRole } = renderWithTheme(
        <TreeView>
          <TreeViewItem title="Karnataka" value="karnataka">
            <TreeViewItem title="Bengaluru" value="bengaluru" />
          </TreeViewItem>
        </TreeView>,
      );

      const karnataka = getByRole('treeitem', { name: 'Karnataka' });
      await user.tab();
      expect(karnataka).toHaveFocus();

      // ArrowRight on collapsed branch expands
      await user.keyboard('{ArrowRight}');
      expect(karnataka).toHaveAttribute('aria-expanded', 'true');
      expect(karnataka).toHaveFocus();

      // ArrowRight on expanded branch moves to first child
      await user.keyboard('{ArrowRight}');
      expect(getByRole('treeitem', { name: 'Bengaluru' })).toHaveFocus();

      // ArrowLeft on a leaf moves to parent
      await user.keyboard('{ArrowLeft}');
      expect(karnataka).toHaveFocus();

      // ArrowLeft on expanded branch collapses
      await user.keyboard('{ArrowLeft}');
      expect(karnataka).toHaveAttribute('aria-expanded', 'false');
      expect(karnataka).toHaveFocus();
    });

    it('should select with Enter and Space, Space being a no-op on LoadMore', async () => {
      const user = userEvents.setup();
      const onChange = jest.fn();
      const onLoadMore = jest.fn();
      const { getByRole } = renderWithTheme(
        <TreeView selectionType="multiple" onChange={onChange}>
          <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
            <TreeViewItem title="Bengaluru" value="bengaluru" />
            <TreeViewLoadMore onClick={onLoadMore} />
          </TreeViewItem>
        </TreeView>,
      );

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(getByRole('treeitem', { name: 'Bengaluru' })).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ values: ['bengaluru'] }));

      await user.keyboard(' ');
      expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ values: [] }));

      // LoadMore: Enter activates, Space is a no-op (B7)
      await user.keyboard('{ArrowDown}');
      expect(getByRole('treeitem', { name: 'Show more' })).toHaveFocus();
      await user.keyboard(' ');
      expect(onLoadMore).not.toHaveBeenCalled();
      await user.keyboard('{Enter}');
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });

    it('should skip disabled subtrees during traversal (B4)', async () => {
      const user = userEvents.setup();
      const { getByRole } = renderWithTheme(
        <TreeView>
          <TreeViewItem title="India" value="india" defaultIsExpanded>
            <TreeViewItem title="Karnataka" value="karnataka" isDisabled>
              <TreeViewItem title="Bengaluru" value="bengaluru" />
            </TreeViewItem>
            <TreeViewItem title="Goa" value="goa" />
          </TreeViewItem>
        </TreeView>,
      );

      await user.tab();
      expect(getByRole('treeitem', { name: 'India' })).toHaveFocus();
      await user.keyboard('{ArrowDown}');
      expect(getByRole('treeitem', { name: 'Goa' })).toHaveFocus();
    });
  });

  it('should warn when nesting beyond 3 levels', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderWithTheme(
      <TreeView>
        <TreeViewItem title="L1" value="l1" defaultIsExpanded>
          <TreeViewItem title="L2" value="l2" defaultIsExpanded>
            <TreeViewItem title="L3" value="l3" defaultIsExpanded>
              <TreeViewItem title="L4" value="l4" />
            </TreeViewItem>
          </TreeViewItem>
        </TreeViewItem>
      </TreeView>,
    );
    expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('nested 4 levels deep'));
    consoleWarn.mockRestore();
  });

  it('should support testID and data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <TreeView testID="tree-view-test" data-analytics-section="filters">
        <TreeViewItem title="Goa" value="goa" testID="goa-item" />
      </TreeView>,
    );

    expect(getByTestId('tree-view-test')).toBeInTheDocument();
    expect(getByTestId('tree-view-test')).toHaveAttribute('data-analytics-section', 'filters');
    expect(getByTestId('goa-item')).toBeInTheDocument();
  });

  it('should fire native focus handling without keyboard for mouse users', () => {
    // clicking a row focuses it (native button behaviour) and updates the roving tabindex
    const { getByRole } = renderWithTheme(<TreeView>{getCanonicalTree()}</TreeView>);
    const goa = getByRole('treeitem', { name: 'Goa' });
    fireEvent.focus(goa);
    expect(goa).toHaveAttribute('tabindex', '0');
  });
});
