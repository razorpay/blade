import React from 'react';
import type { Meta } from '@storybook/react';
import { ActionList, ActionListItem } from './ActionList/ActionList';
import { Dropdown, DropdownOverlay } from './index';

import { SelectInput } from './SelectInput/SelectInput';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { TextInput } from '~components/Input/TextInput';

const DropdownStoryMeta: Meta = {
  title: 'Components/DropdownNew',
  component: Dropdown,
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

export const InternalSelect = (): React.ReactElement => {
  return (
    <Dropdown>
      <SelectInput label="Search" />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Apples" value="Apples" />
          <ActionListItem title="Appricots" value="Appricots" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export default DropdownStoryMeta;
