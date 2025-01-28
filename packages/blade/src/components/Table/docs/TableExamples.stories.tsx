import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Table } from '../Table';
import {
  BasicTableStory,
  TableWithCustomCellComponentsStory,
  SortableTableStory,
  SingleSelectableTableStory,
  MultiSelectableWithToolbarTableStory,
  MultiSelectableWithZebraStripesStory,
  TableWithStickyHeaderAndFooterStory,
  TableWithStickyFirstColumnStory,
  TableWithDisabledRowsStory,
  TableWithBackgroundColorStory,
  TableWithIsLoadingStory,
  TableWithIsRefreshingStory,
  TableWithEditableCellsStory,
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

const TableTemplate: StoryFn<typeof Table> = () => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {BasicTableStory}
    </Sandbox>
  );
};

export const BasicTable = TableTemplate.bind({});

export const TableWithCustomCellComponents = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {TableWithCustomCellComponentsStory}
    </Sandbox>
  );
};

export const SortableTable = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {SortableTableStory}
    </Sandbox>
  );
};

export const TableWithStickyHeaderAndFooter = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {TableWithStickyHeaderAndFooterStory}
    </Sandbox>
  );
};

export const TableWithStickyFirstColumn = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {TableWithStickyFirstColumnStory}
    </Sandbox>
  );
};

export const SingleSelectableTable = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {SingleSelectableTableStory}
    </Sandbox>
  );
};

export const MultiSelectableTableWithToolbar = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {MultiSelectableWithToolbarTableStory}
    </Sandbox>
  );
};

export const MultiSelectableWithZebraStripes = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {MultiSelectableWithZebraStripesStory}
    </Sandbox>
  );
};

export const TableWithDisabledRows = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {TableWithDisabledRowsStory}
    </Sandbox>
  );
};

export const TableWithBackgroundColor = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {TableWithBackgroundColorStory}
    </Sandbox>
  );
};

export const TableWithIsLoading = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {TableWithIsLoadingStory}
    </Sandbox>
  );
};

export const TableWithIsRefreshing = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {TableWithIsRefreshingStory}
    </Sandbox>
  );
};

export const TableWithEditableCells = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {TableWithEditableCellsStory}
    </Sandbox>
  );
};

export default TableMeta;
