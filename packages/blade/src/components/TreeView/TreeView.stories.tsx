import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import { useState } from 'react';

import { TreeView as TreeViewComponent } from './TreeView';
import { TreeViewItem } from './TreeViewItem';
import type { TreeViewProps } from './types';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { FolderIcon, FileTextIcon, CodeSnippetIcon, ImageIcon } from '~components/Icons';
import { Badge } from '~components/Badge';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="TreeView"
      componentDescription="A tree view displays hierarchical data in a nested structure with support for expand/collapse and selection."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL"
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { TreeView, TreeViewItem } from '@razorpay/blade/components';
        import { FolderIcon, FileTextIcon } from '@razorpay/blade/components';

        function App() {
          return (
            <TreeView selectionType="single">
              <TreeViewItem id="src" label="src" icon={FolderIcon}>
                <TreeViewItem id="components" label="components" icon={FolderIcon}>
                  <TreeViewItem id="button" label="Button.tsx" icon={FileTextIcon} />
                  <TreeViewItem id="input" label="Input.tsx" icon={FileTextIcon} />
                </TreeViewItem>
                <TreeViewItem id="utils" label="utils" icon={FolderIcon}>
                  <TreeViewItem id="helpers" label="helpers.ts" icon={FileTextIcon} />
                </TreeViewItem>
              </TreeViewItem>
              <TreeViewItem id="package" label="package.json" icon={FileTextIcon} />
            </TreeView>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<TreeViewProps> = {
  title: 'Components/TreeView',
  component: TreeViewComponent,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

export default meta;

const TreeViewTemplate: StoryFn<TreeViewProps> = (args): ReactElement => {
  return (
    <Box maxWidth="400px">
      <TreeViewComponent {...args}>
        <TreeViewItem id="src" label="src" icon={FolderIcon}>
          <TreeViewItem id="components" label="components" icon={FolderIcon}>
            <TreeViewItem id="button" label="Button.tsx" icon={FileTextIcon} />
            <TreeViewItem id="input" label="Input.tsx" icon={FileTextIcon} />
            <TreeViewItem id="badge" label="Badge.tsx" icon={FileTextIcon} />
          </TreeViewItem>
          <TreeViewItem id="utils" label="utils" icon={FolderIcon}>
            <TreeViewItem id="helpers" label="helpers.ts" icon={CodeSnippetIcon} />
            <TreeViewItem id="types" label="types.ts" icon={CodeSnippetIcon} />
          </TreeViewItem>
        </TreeViewItem>
        <TreeViewItem id="assets" label="assets" icon={FolderIcon}>
          <TreeViewItem id="logo" label="logo.png" icon={ImageIcon} />
        </TreeViewItem>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
      </TreeViewComponent>
    </Box>
  );
};

export const Default = TreeViewTemplate.bind({});
Default.args = {
  selectionType: 'none',
};
Default.storyName = 'Default';

export const SingleSelection = TreeViewTemplate.bind({});
SingleSelection.args = {
  selectionType: 'single',
};
SingleSelection.storyName = 'Single Selection';

export const MultipleSelection = TreeViewTemplate.bind({});
MultipleSelection.args = {
  selectionType: 'multiple',
};
MultipleSelection.storyName = 'Multiple Selection';

export const Controlled = (): ReactElement => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['button']);
  const [expandedIds, setExpandedIds] = useState<string[]>(['src', 'components']);

  return (
    <Box display="flex" gap="spacing.6">
      <Box maxWidth="400px">
        <TreeViewComponent
          selectionType="single"
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          onSelectionChange={({ selectedIds: ids }) => setSelectedIds(ids)}
          onExpandedIdsChange={({ expandedIds: ids }) => setExpandedIds(ids)}
        >
          <TreeViewItem id="src" label="src" icon={FolderIcon}>
            <TreeViewItem id="components" label="components" icon={FolderIcon}>
              <TreeViewItem id="button" label="Button.tsx" icon={FileTextIcon} />
              <TreeViewItem id="input" label="Input.tsx" icon={FileTextIcon} />
            </TreeViewItem>
            <TreeViewItem id="utils" label="utils" icon={FolderIcon}>
              <TreeViewItem id="helpers" label="helpers.ts" icon={CodeSnippetIcon} />
            </TreeViewItem>
          </TreeViewItem>
          <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
        </TreeViewComponent>
      </Box>
      <Box>
        <Text size="small" color="surface.text.gray.muted">
          Selected: {selectedIds.join(', ') || 'none'}
        </Text>
        <Text size="small" color="surface.text.gray.muted">
          Expanded: {expandedIds.join(', ') || 'none'}
        </Text>
      </Box>
    </Box>
  );
};

export const WithTrailingBadge = (): ReactElement => {
  return (
    <Box maxWidth="400px">
      <TreeViewComponent selectionType="single">
        <TreeViewItem
          id="src"
          label="src"
          icon={FolderIcon}
          trailing={
            <Badge size="small" color="positive">
              3 files
            </Badge>
          }
        >
          <TreeViewItem
            id="button"
            label="Button.tsx"
            icon={FileTextIcon}
            trailing={
              <Badge size="small" color="notice">
                Modified
              </Badge>
            }
          />
          <TreeViewItem id="input" label="Input.tsx" icon={FileTextIcon} />
          <TreeViewItem
            id="badge"
            label="Badge.tsx"
            icon={FileTextIcon}
            trailing={
              <Badge size="small" color="information">
                New
              </Badge>
            }
          />
        </TreeViewItem>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
      </TreeViewComponent>
    </Box>
  );
};

export const WithDisabledItems = (): ReactElement => {
  return (
    <Box maxWidth="400px">
      <TreeViewComponent selectionType="single">
        <TreeViewItem id="src" label="src" icon={FolderIcon}>
          <TreeViewItem id="button" label="Button.tsx" icon={FileTextIcon} />
          <TreeViewItem id="input" label="Input.tsx" icon={FileTextIcon} isDisabled />
          <TreeViewItem id="secret" label="secret.ts" icon={FileTextIcon} isDisabled />
        </TreeViewItem>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
      </TreeViewComponent>
    </Box>
  );
};

export const DefaultExpanded = (): ReactElement => {
  return (
    <Box maxWidth="400px">
      <TreeViewComponent selectionType="none" defaultExpandedIds={['src', 'components']}>
        <TreeViewItem id="src" label="src" icon={FolderIcon}>
          <TreeViewItem id="components" label="components" icon={FolderIcon}>
            <TreeViewItem id="button" label="Button.tsx" icon={FileTextIcon} />
            <TreeViewItem id="input" label="Input.tsx" icon={FileTextIcon} />
          </TreeViewItem>
        </TreeViewItem>
        <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
      </TreeViewComponent>
    </Box>
  );
};
