import React from 'react';
import userEvents from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { TreeView } from '../TreeView';
import { TreeViewItem } from '../TreeViewItem';
import { TreeViewLoadMore } from '../TreeViewLoadMore';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { Dropdown, DropdownOverlay, FilterChipSelectInput } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers/SelectInput';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

// `renderWithTheme` wraps only the initial render; rerenders need the provider again
const withTheme = (ui: React.ReactElement): React.ReactElement => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    {ui}
  </BladeProvider>
);

const getActiveDescendant = (trigger: HTMLElement): string | null | undefined => {
  const activeDescendantId = trigger.getAttribute('aria-activedescendant');
  const activeDescendantElement = document.querySelector(`#${activeDescendantId}`);
  return activeDescendantElement?.textContent;
};

const getCanonicalTree = ({
  karnatakaExpanded = true,
}: { karnatakaExpanded?: boolean } = {}): React.ReactElement => (
  <TreeViewItem title="India" value="india" defaultIsExpanded>
    <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded={karnatakaExpanded}>
      <TreeViewItem title="Bengaluru" value="bengaluru" />
      <TreeViewItem title="Mysuru" value="mysuru" />
    </TreeViewItem>
    <TreeViewItem title="Goa" value="goa" />
  </TreeViewItem>
);

describe('<TreeView /> inside <Dropdown /> with <SelectInput />', () => {
  it('should render tree roles inside the overlay and pass a11y audit', async () => {
    const user = userEvents.setup();
    const { getByRole, getAllByRole, queryAllByRole } = renderWithTheme(
      <Dropdown selectionType="single">
        <SelectInput label="Regions" />
        <DropdownOverlay zIndex={1002}>
          <TreeView>{getCanonicalTree()}</TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Regions' });
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    expect(getAllByRole('treeitem')).toHaveLength(5);
    // AC5: tree semantics, not listbox/menu semantics
    expect(queryAllByRole('option')).toHaveLength(0);
    expect(queryAllByRole('menuitem')).toHaveLength(0);
    await assertAccessible(getByRole('tree'));
  });

  it('should select a leaf on click, close the dropdown, and reflect the title in the trigger (single)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown selectionType="single">
        <SelectInput label="Regions" name="regions" onChange={onChange} />
        <DropdownOverlay zIndex={1002}>
          <TreeView>{getCanonicalTree()}</TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Regions' });
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['bengaluru'],
      selectedGroups: [],
    });
    // single select closes the dropdown
    await waitFor(() => expect(queryByRole('tree')).toBeNull());
    expect(selectInput).toHaveTextContent('Bengaluru');
  });

  it('should treat a branch as a valid selection in single mode without cascading', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Dropdown selectionType="single">
        <SelectInput label="Regions" name="regions" onChange={onChange} />
        <DropdownOverlay zIndex={1002}>
          <TreeView>{getCanonicalTree()}</TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    await user.click(getByRole('combobox', { name: 'Regions' }));
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    await user.click(getByRole('treeitem', { name: 'Karnataka' }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['karnataka'],
      selectedGroups: [],
    });
    expect(getByRole('combobox', { name: 'Regions' })).toHaveTextContent('Karnataka');
  });

  it('should toggle expansion instead of selecting on a branch with isSelectable={false} (leaf-only selection)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole, queryByRole } = renderWithTheme(
      <Dropdown selectionType="single">
        <SelectInput label="Cities" name="cities" onChange={onChange} />
        <DropdownOverlay zIndex={1002}>
          <TreeView>
            <TreeViewItem title="India" value="india" isSelectable={false} defaultIsExpanded>
              <TreeViewItem title="Karnataka" value="karnataka" isSelectable={false}>
                <TreeViewItem title="Bengaluru" value="bengaluru" />
                <TreeViewItem title="Mysuru" value="mysuru" />
              </TreeViewItem>
            </TreeViewItem>
          </TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Cities' });
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    // clicking a non-selectable branch expands it, keeps the overlay open, fires no onChange
    const karnataka = getByRole('treeitem', { name: 'Karnataka' });
    expect(karnataka).toHaveAttribute('aria-expanded', 'false');
    expect(karnataka).not.toHaveAttribute('aria-selected');
    await user.click(karnataka);
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-expanded', 'true');
    expect(onChange).not.toHaveBeenCalled();
    expect(getByRole('tree')).toBeVisible();

    // clicking it again collapses it
    await user.click(getByRole('treeitem', { name: 'Karnataka' }));
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).not.toHaveBeenCalled();

    // a leaf still selects and closes the dropdown
    await user.click(getByRole('treeitem', { name: 'Karnataka' }));
    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'cities',
      values: ['bengaluru'],
      selectedGroups: [],
    });
    await waitFor(() => expect(queryByRole('tree')).toBeNull());
    expect(selectInput).toHaveTextContent('Bengaluru');
  });

  it('should follow the canonical multiple-selection trace with selectedGroups (B2, B3)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <SelectInput label="Regions" name="regions" onChange={onChange} />
        <DropdownOverlay zIndex={1002}>
          <TreeView>{getCanonicalTree()}</TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    const selectInput = getByRole('combobox', { name: 'Regions' });
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    const india = getByRole('treeitem', { name: 'India' });
    const karnataka = getByRole('treeitem', { name: 'Karnataka' });

    // 1. check Bengaluru
    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['bengaluru'],
      selectedGroups: [],
    });
    expect(karnataka).toHaveAttribute('aria-checked', 'mixed');
    expect(india).toHaveAttribute('aria-checked', 'mixed');

    // 2. check Mysuru -> Karnataka fully selected
    await user.click(getByRole('treeitem', { name: 'Mysuru' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['bengaluru', 'mysuru'],
      selectedGroups: ['karnataka'],
    });
    expect(karnataka).toHaveAttribute('aria-checked', 'true');

    // 3. check Goa -> India fully selected
    await user.click(getByRole('treeitem', { name: 'Goa' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['bengaluru', 'mysuru', 'goa'],
      selectedGroups: ['india'],
    });
    expect(india).toHaveAttribute('aria-checked', 'true');

    // 4. uncheck India -> everything deselected with exactly one onChange (branch cascade)
    onChange.mockClear();
    await user.click(india);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: [],
      selectedGroups: [],
    });
  });

  it('should support controlled selection through the trigger value prop', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();

    const ControlledTree = (): React.ReactElement => {
      const [values, setValues] = React.useState<string[]>(['bengaluru']);
      return (
        <Dropdown selectionType="multiple">
          <SelectInput
            label="Regions"
            value={values}
            onChange={(payload) => {
              onChange(payload);
              setValues(payload.values);
            }}
          />
          <DropdownOverlay zIndex={1002}>
            <TreeView>{getCanonicalTree()}</TreeView>
          </DropdownOverlay>
        </Dropdown>
      );
    };

    const { getByRole } = renderWithTheme(<ControlledTree />);

    const selectInput = getByRole('combobox', { name: 'Regions' });
    await user.click(selectInput);
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    // initial controlled value is reflected in the tree
    expect(getByRole('treeitem', { name: 'Bengaluru' })).toHaveAttribute('aria-checked', 'true');
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-checked', 'mixed');

    // branch cascade routes through the controlled flow: one onChange with all leaves
    await user.click(getByRole('treeitem', { name: 'Karnataka' }));
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          values: ['bengaluru', 'mysuru'],
          selectedGroups: ['karnataka'],
        }),
      ),
    );
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-checked', 'true');
  });

  it('should activate TreeViewLoadMore on click without selecting it', async () => {
    const user = userEvents.setup();
    const onLoadMore = jest.fn();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <SelectInput label="Regions" onChange={onChange} />
        <DropdownOverlay zIndex={1002}>
          <TreeView>
            <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
              <TreeViewItem title="Bengaluru" value="bengaluru" />
              <TreeViewLoadMore onClick={onLoadMore} />
            </TreeViewItem>
          </TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    await user.click(getByRole('combobox', { name: 'Regions' }));
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    await user.click(getByRole('treeitem', { name: 'Show more' }));
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    // LoadMore is never a selection
    expect(onChange).not.toHaveBeenCalled();
  });

  it('should inherit selection for newly loaded children of a fully selected branch (B6)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();

    const getTree = (leaves: string[]): React.ReactElement => (
      <Dropdown selectionType="multiple">
        <SelectInput label="Regions" name="regions" onChange={onChange} />
        <DropdownOverlay zIndex={1002}>
          <TreeView>
            <TreeViewItem title="Karnataka" value="karnataka" hasChildren defaultIsExpanded>
              {leaves.map((leaf) => (
                <TreeViewItem key={leaf} title={leaf} value={leaf.toLowerCase()} />
              ))}
            </TreeViewItem>
          </TreeView>
        </DropdownOverlay>
      </Dropdown>
    );

    const { getByRole, rerender } = renderWithTheme(getTree(['Bengaluru']));

    await user.click(getByRole('combobox', { name: 'Regions' }));
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(getByRole('treeitem', { name: 'Karnataka' })).toHaveAttribute('aria-checked', 'true');

    // more children arrive while the branch is fully selected
    rerender(withTheme(getTree(['Bengaluru', 'Mysuru'])));

    await waitFor(() =>
      expect(getByRole('treeitem', { name: 'Mysuru' })).toHaveAttribute('aria-checked', 'true'),
    );
    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          values: ['bengaluru', 'mysuru'],
          selectedGroups: ['karnataka'],
        }),
      ),
    );
  });

  describe('keyboard (§5, §6.4)', () => {
    it('should traverse only visible rows and keep option indices stable across expand/collapse', async () => {
      const user = userEvents.setup();
      const { getByRole } = renderWithTheme(
        <Dropdown selectionType="single">
          <SelectInput label="Regions" />
          <DropdownOverlay zIndex={1002}>
            {/* karnataka starts collapsed: bengaluru/mysuru hidden but registered */}
            <TreeView>{getCanonicalTree({ karnatakaExpanded: false })}</TreeView>
          </DropdownOverlay>
        </Dropdown>,
      );

      const selectInput = getByRole('combobox', { name: 'Regions' });
      selectInput.focus();
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(getByRole('tree')).toBeVisible());

      const goa = getByRole('treeitem', { name: 'Goa' });
      const goaIdBefore = goa.getAttribute('id');

      await user.keyboard('{ArrowDown}');
      expect(getActiveDescendant(selectInput)).toContain('India');
      await user.keyboard('{ArrowDown}');
      expect(getActiveDescendant(selectInput)).toContain('Karnataka');
      // collapsed children (bengaluru, mysuru) are skipped
      await user.keyboard('{ArrowDown}');
      expect(getActiveDescendant(selectInput)).toContain('Goa');
      await user.keyboard('{ArrowUp}');
      expect(getActiveDescendant(selectInput)).toContain('Karnataka');

      // ArrowRight on collapsed branch expands it, focus stays on the branch
      const karnataka = getByRole('treeitem', { name: 'Karnataka' });
      await user.keyboard('{ArrowRight}');
      expect(karnataka).toHaveAttribute('aria-expanded', 'true');
      expect(getActiveDescendant(selectInput)).toContain('Karnataka');

      // ArrowRight on expanded branch moves to the first child
      await user.keyboard('{ArrowRight}');
      expect(getActiveDescendant(selectInput)).toContain('Bengaluru');

      // ArrowLeft on a leaf moves to the parent
      await user.keyboard('{ArrowLeft}');
      expect(getActiveDescendant(selectInput)).toContain('Karnataka');

      // ArrowLeft on expanded branch collapses it
      await user.keyboard('{ArrowLeft}');
      expect(karnataka).toHaveAttribute('aria-expanded', 'false');

      // indices (row DOM ids) are stable across expand/collapse
      expect(goa.getAttribute('id')).toBe(goaIdBefore);
    });

    it('should toggle a branch cascade with Enter in multiple mode with a single onChange', async () => {
      const user = userEvents.setup();
      const onChange = jest.fn();
      const { getByRole } = renderWithTheme(
        <Dropdown selectionType="multiple">
          <SelectInput label="Regions" name="regions" onChange={onChange} />
          <DropdownOverlay zIndex={1002}>
            <TreeView>{getCanonicalTree()}</TreeView>
          </DropdownOverlay>
        </Dropdown>,
      );

      const selectInput = getByRole('combobox', { name: 'Regions' });
      selectInput.focus();
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(getByRole('tree')).toBeVisible());

      // move to Karnataka
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      expect(getActiveDescendant(selectInput)).toContain('Karnataka');

      onChange.mockClear();
      await user.keyboard('{Enter}');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith({
        name: 'regions',
        values: ['bengaluru', 'mysuru'],
        selectedGroups: ['karnataka'],
      });
      // multiple mode keeps the dropdown open
      expect(getByRole('tree')).toBeVisible();
    });

    it('should activate LoadMore with Enter and ignore Space (B7)', async () => {
      const user = userEvents.setup();
      const onLoadMore = jest.fn();
      const { getByRole } = renderWithTheme(
        <Dropdown selectionType="multiple">
          <SelectInput label="Regions" />
          <DropdownOverlay zIndex={1002}>
            <TreeView>
              <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
                <TreeViewItem title="Bengaluru" value="bengaluru" />
                <TreeViewLoadMore onClick={onLoadMore} />
              </TreeViewItem>
            </TreeView>
          </DropdownOverlay>
        </Dropdown>,
      );

      const selectInput = getByRole('combobox', { name: 'Regions' });
      selectInput.focus();
      await user.keyboard('{ArrowDown}');
      await waitFor(() => expect(getByRole('tree')).toBeVisible());

      // move to the LoadMore row (Karnataka -> Bengaluru -> Show more)
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      expect(getActiveDescendant(selectInput)).toContain('Show more');

      await user.keyboard(' ');
      expect(onLoadMore).not.toHaveBeenCalled();
      await user.keyboard('{Enter}');
      expect(onLoadMore).toHaveBeenCalledTimes(1);
    });
  });

  it('should warn when selection props are passed to TreeView inside Dropdown', () => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderWithTheme(
      <Dropdown selectionType="multiple">
        <SelectInput label="Regions" />
        <DropdownOverlay zIndex={1002}>
          <TreeView selectionType="single" value={['goa']}>
            {getCanonicalTree()}
          </TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    expect(consoleWarn).toHaveBeenCalledWith(expect.stringContaining('ignored inside Dropdown'));
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining("Dropdown's selectionType wins"),
    );
    consoleWarn.mockRestore();
  });
});

describe('<TreeView /> inside <Dropdown /> with <FilterChipSelectInput />', () => {
  it('should follow the canonical trace and show the describing set on the chip (B3, D5)', async () => {
    const user = userEvents.setup();
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput label="Regions" name="regions" onChange={onChange} />
        <DropdownOverlay zIndex={1002}>
          <TreeView>{getCanonicalTree()}</TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    const trigger = getByRole('button', { name: 'Regions' });
    await user.click(trigger);
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['bengaluru'],
      selectedGroups: [],
    });

    await user.click(getByRole('treeitem', { name: 'Mysuru' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['bengaluru', 'mysuru'],
      selectedGroups: ['karnataka'],
    });

    // chip shows the describing set: single entry 'Karnataka' instead of a '2' counter
    await waitFor(() => expect(trigger).toHaveTextContent('Karnataka'));
    expect(trigger).not.toHaveTextContent('2');

    // one more branch: full India selection collapses the chip display to 'India'
    await user.click(getByRole('treeitem', { name: 'Goa' }));
    expect(onChange).toHaveBeenLastCalledWith({
      name: 'regions',
      values: ['bengaluru', 'mysuru', 'goa'],
      selectedGroups: ['india'],
    });
    await waitFor(() => expect(trigger).toHaveTextContent('India'));
  });

  it('should show a counter of the describing set for disjoint selections', async () => {
    const user = userEvents.setup();
    const { getByRole } = renderWithTheme(
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput label="Regions" />
        <DropdownOverlay zIndex={1002}>
          <TreeView>{getCanonicalTree()}</TreeView>
        </DropdownOverlay>
      </Dropdown>,
    );

    const trigger = getByRole('button', { name: 'Regions' });
    await user.click(trigger);
    await waitFor(() => expect(getByRole('tree')).toBeVisible());

    // bengaluru + goa: describing set of 2 -> counter
    await user.click(getByRole('treeitem', { name: 'Bengaluru' }));
    await user.click(getByRole('treeitem', { name: 'Goa' }));
    await waitFor(() => expect(trigger).toHaveTextContent('2'));
  });
});
