import React from 'react';
import type { Meta } from '@storybook/react';
import { Table } from '../Table';
import { TableWithClientSidePaginationStory, TableWithServerSidePaginationStory } from './stories';
import { Sandbox } from '~utils/storybook/Sandbox';

const TableMeta: Meta = {
  title: 'Components/Table/Examples/Pagination',
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

export const TableWithClientSidePagination = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithClientSidePaginationStory}
    </Sandbox>
  );
};

export const TableWithServerSidePagination = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="90vh">
      {TableWithServerSidePaginationStory}
    </Sandbox>
  );
};

export default TableMeta;
