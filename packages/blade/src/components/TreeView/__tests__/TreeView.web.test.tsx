import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TreeView, TreeViewItem } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';
import { FolderIcon, FileTextIcon } from '~components/Icons';

const SimpleTree = (): JSX.Element => (
  <TreeView>
    <TreeViewItem id="src" label="src" icon={FolderIcon}>
      <TreeViewItem id="components" label="components" icon={FolderIcon}>
        <TreeViewItem id="button" label="Button.tsx" icon={FileTextIcon} />
      </TreeViewItem>
    </TreeViewItem>
    <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
  </TreeView>
);

describe('<TreeView />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<SimpleTree />);
    expect(container).toMatchSnapshot();
  });

  it('should have correct aria roles', () => {
    const { getByRole, getAllByRole } = renderWithTheme(<SimpleTree />);
    expect(getByRole('tree')).toBeInTheDocument();
    const treeItems = getAllByRole('treeitem');
    expect(treeItems.length).toBeGreaterThan(0);
  });

  it('should expand a node on click', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = renderWithTheme(<SimpleTree />);

    // "components" child "Button.tsx" should not be visible until "src" is expanded
    expect(queryByText('Button.tsx')).toBeNull();

    await user.click(getByText('src'));

    expect(getByText('components')).toBeInTheDocument();
  });

  it('should expand nested node on click', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = renderWithTheme(<SimpleTree />);

    await user.click(getByText('src'));
    expect(getByText('components')).toBeInTheDocument();
    expect(queryByText('Button.tsx')).toBeNull();

    await user.click(getByText('components'));
    expect(getByText('Button.tsx')).toBeInTheDocument();
  });

  it('should collapse an expanded node on click', async () => {
    const user = userEvent.setup();
    const { getByText, queryByText } = renderWithTheme(<SimpleTree />);

    await user.click(getByText('src'));
    expect(getByText('components')).toBeInTheDocument();

    await user.click(getByText('src'));
    expect(queryByText('components')).toBeNull();
  });

  it('should render with defaultExpandedIds', () => {
    const { getByText } = renderWithTheme(
      <TreeView defaultExpandedIds={['src']}>
        <TreeViewItem id="src" label="src" icon={FolderIcon}>
          <TreeViewItem id="components" label="components" icon={FolderIcon} />
        </TreeViewItem>
      </TreeView>,
    );

    expect(getByText('components')).toBeInTheDocument();
  });

  it('should call onExpandChange callback', async () => {
    const onExpandChange = jest.fn();
    const user = userEvent.setup();

    const { getByText } = renderWithTheme(
      <TreeView onExpandChange={onExpandChange}>
        <TreeViewItem id="src" label="src" icon={FolderIcon}>
          <TreeViewItem id="btn" label="Button.tsx" icon={FileTextIcon} />
        </TreeViewItem>
      </TreeView>,
    );

    await user.click(getByText('src'));
    expect(onExpandChange).toHaveBeenCalledWith({
      nodeId: 'src',
      isExpanded: true,
    });

    await user.click(getByText('src'));
    expect(onExpandChange).toHaveBeenCalledWith({
      nodeId: 'src',
      isExpanded: false,
    });
  });

  it('should support single selection', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();

    const { getByText } = renderWithTheme(
      <TreeView selectionType="single" onSelectionChange={onSelectionChange}>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
        <TreeViewItem id="package" label="package.json" icon={FileTextIcon} />
      </TreeView>,
    );

    await user.click(getByText('README.md'));
    expect(onSelectionChange).toHaveBeenCalledWith({ selectedIds: ['readme'] });

    await user.click(getByText('package.json'));
    expect(onSelectionChange).toHaveBeenCalledWith({ selectedIds: ['package'] });
  });

  it('should support multiple selection', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();

    const { getByText } = renderWithTheme(
      <TreeView selectionType="multiple" onSelectionChange={onSelectionChange}>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
        <TreeViewItem id="package" label="package.json" icon={FileTextIcon} />
      </TreeView>,
    );

    await user.click(getByText('README.md'));
    expect(onSelectionChange).toHaveBeenCalledWith({ selectedIds: ['readme'] });

    await user.click(getByText('package.json'));
    expect(onSelectionChange).toHaveBeenCalledWith({ selectedIds: ['readme', 'package'] });
  });

  it('should deselect on second click in single selection', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();

    const { getByText } = renderWithTheme(
      <TreeView selectionType="single" onSelectionChange={onSelectionChange}>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
      </TreeView>,
    );

    await user.click(getByText('README.md'));
    expect(onSelectionChange).toHaveBeenCalledWith({ selectedIds: ['readme'] });

    await user.click(getByText('README.md'));
    expect(onSelectionChange).toHaveBeenCalledWith({ selectedIds: [] });
  });

  it('should support controlled expand', async () => {
    const ControlledTree = (): JSX.Element => {
      const [expandedIds, setExpandedIds] = useState<string[]>([]);
      return (
        <TreeView
          expandedIds={expandedIds}
          onExpandedIdsChange={({ expandedIds: ids }) => setExpandedIds(ids)}
        >
          <TreeViewItem id="src" label="src" icon={FolderIcon}>
            <TreeViewItem id="btn" label="Button.tsx" icon={FileTextIcon} />
          </TreeViewItem>
        </TreeView>
      );
    };

    const user = userEvent.setup();
    const { getByText, queryByText } = renderWithTheme(<ControlledTree />);

    expect(queryByText('Button.tsx')).toBeNull();

    await user.click(getByText('src'));
    expect(getByText('Button.tsx')).toBeInTheDocument();
  });

  it('should support keyboard navigation — ArrowDown/ArrowUp moves focus between visible treeitems', async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(
      <TreeView>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
        <TreeViewItem id="package" label="package.json" icon={FileTextIcon} />
        <TreeViewItem id="tsconfig" label="tsconfig.json" icon={FileTextIcon} />
      </TreeView>,
    );

    const first = getByText('README.md').closest('[role="treeitem"]') as HTMLElement;
    const second = getByText('package.json').closest('[role="treeitem"]') as HTMLElement;
    const third = getByText('tsconfig.json').closest('[role="treeitem"]') as HTMLElement;

    first.focus();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(second);

    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(third);

    await user.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(second);
  });

  it('should support keyboard navigation — Enter expands a node', async () => {
    const user = userEvent.setup();
    const { getByText } = renderWithTheme(<SimpleTree />);

    const srcItem = getByText('src').closest('[role="treeitem"]') as HTMLElement;
    srcItem.focus();

    await user.keyboard('{Enter}');
    expect(getByText('components')).toBeInTheDocument();
  });

  it('should not interact when disabled', async () => {
    const onSelectionChange = jest.fn();
    const user = userEvent.setup();

    const { getByText } = renderWithTheme(
      <TreeView selectionType="single" onSelectionChange={onSelectionChange}>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} isDisabled />
      </TreeView>,
    );

    await user.click(getByText('README.md'));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(<SimpleTree />);
    await assertAccessible(container);
  });
});
