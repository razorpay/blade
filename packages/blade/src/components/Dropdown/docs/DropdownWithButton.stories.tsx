import React from 'react';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownOverlay } from '..';
import {
  WithControlledMenuStory,
  WithControlledMultiSelectMenuStory,
  WithSimpleMenuStory,
} from './stories';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import { Box } from '~components/Box';
import { ActionList, ActionListItem, ActionListItemIcon } from '~components/ActionList';
import { CheckIcon, ClockIcon, CloseIcon } from '~components/Icons';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/Stories/With Button',
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
  },
};

export const Default = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithSimpleMenuStory}
    </Sandbox>
  );
};

export const WithControlledMenu = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithControlledMenuStory}
    </Sandbox>
  );
};

export const WithControlledMultiSelect = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithControlledMultiSelectMenuStory}
    </Sandbox>
  );
};
// This is for Chromatic and react native testing
export const InternalMenu = (): JSX.Element => {
  const [status, setStatus] = React.useState<string | undefined>();

  return (
    <Box minHeight="200px" padding="spacing.10">
      <Dropdown>
        <DropdownButton variant="tertiary">Status: {status ?? ''}</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setStatus(name);
              }}
              leading={<ActionListItemIcon icon={CheckIcon} />}
              isSelected={status === 'approve'}
              title="Approve"
              value="approve"
            />
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setStatus(name);
              }}
              leading={<ActionListItemIcon icon={ClockIcon} />}
              isSelected={status === 'in-progress'}
              title="In Progress"
              value="in-progress"
            />

            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setStatus(name);
              }}
              leading={<ActionListItemIcon icon={CloseIcon} />}
              isSelected={status === 'reject'}
              title="Reject"
              value="reject"
              intent="negative"
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export default DropdownStoryMeta;
