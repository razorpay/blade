import React from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { Table } from '../Table';
import {
  BasicTableStory,
  TableWithCustomCellComponentsStory,
  SortableTableStory,
  SingleSelectableTableStory,
  MultiSelectableWithToolbarTableStory,
  MultiSelectableWithZebraStripesStory,
  TableWithStickyHeaderAndFooterStory,
} from './stories';
import { Sandbox } from '~utils/storybook/Sandbox';

const TableMeta: Meta = {
  title: 'Components/Table/Examples',
  component: Table,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

const TableTemplate: ComponentStory<typeof Table> = () => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {BasicTableStory}
    </Sandbox>
  );
};

export const BasicTable = TableTemplate.bind({});

export const TableWithCustomCellComponents = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithCustomCellComponentsStory}
    </Sandbox>
  );
};

export const SortableTable = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {SortableTableStory}
    </Sandbox>
  );
};

export const SingleSelectable = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {SingleSelectableTableStory}
    </Sandbox>
  );
};

export const MultiSelectableWithToolbar = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {MultiSelectableWithToolbarTableStory}
    </Sandbox>
  );
};

export const MultiSelectableWithZebraStripes = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {MultiSelectableWithZebraStripesStory}
    </Sandbox>
  );
};

export const TableWithStickyHeaderAndFooter = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithStickyHeaderAndFooterStory}
    </Sandbox>
  );
};

export default TableMeta;
