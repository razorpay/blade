import React from 'react';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownOverlay } from '..';
import { DropdownFilterChip } from '../DropdownFilterChip';
import { ActionList, ActionListItem } from '~components/ActionList';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/With Filter Chip',
  component: Dropdown,
  subcomponents: { DropdownButton },
  args: {},
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

export const Default = (): React.ReactElement => {
  return (
    <Dropdown selectionType="multiple">
      <DropdownFilterChip label="Filter Chip" />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Item 1" value="item-1" />
          <ActionListItem title="Item 2" value="item-2" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export default DropdownStoryMeta;
