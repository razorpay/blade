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
  TableWithPaginationStory,
  TableWithDisabledRowsStory,
  TableWithBackgroundColorStory,
  TableWithIsLoadingStory,
  TableWithIsRefreshingStory,
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

export const TableWithStickyHeaderAndFooter = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithStickyHeaderAndFooterStory}
    </Sandbox>
  );
};

export const TableWithStickyFirstColumn = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithStickyFirstColumnStory}
    </Sandbox>
  );
};

export const SingleSelectableTable = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {SingleSelectableTableStory}
    </Sandbox>
  );
};

export const MultiSelectableTableWithToolbar = (): React.ReactElement => {
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

export const TableWithPagination = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithPaginationStory}
    </Sandbox>
  );
};

export const TableWithDisabledRows = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithDisabledRowsStory}
    </Sandbox>
  );
};

export const TableWithBackgroundColor = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithBackgroundColorStory}
    </Sandbox>
  );
};

export const TableWithIsLoading = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithIsLoadingStory}
    </Sandbox>
  );
};

export const TableWithIsRefreshing = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithIsRefreshingStory}
    </Sandbox>
  );
};

export default TableMeta;
