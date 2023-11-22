import React from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { Table } from '../Table';
import { BasicTableStory } from './stories';
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

export default TableMeta;
