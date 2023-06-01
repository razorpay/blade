import React from 'react';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownLink, DropdownOverlay } from '..';
import {
  WithControlledMenuStory,
  WithControlledMultiSelectMenuStory,
  WithLinkStory,
  WithSimpleMenuStory,
} from './stories';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Box } from '~components/Box';
import { ActionList, ActionListItem, ActionListItemIcon } from '~components/ActionList';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon, CloseIcon } from '~components/Icons';
import { Text } from '~components/Typography';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/With Button and Link',
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

export const Default = (): JSX.Element => {
  return (
    <Sandbox
      padding="spacing.0"
      editorHeight="100vh"
      uri="https://blade.razorpay.com/iframe.html?id=components-dropdown-with-button--default&args=&viewMode=story"
    >
      {WithSimpleMenuStory}
    </Sandbox>
  );
};

export const WithLink = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithLinkStory}
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

InternalMenu.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};

export const InternalLinkDropdown = (): JSX.Element => {
  const [status, setStatus] = React.useState<string | undefined>('latest-added');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <Box padding="spacing.10" display="flex" alignItems="center" gap="spacing.2">
      <Text>Sort By</Text>
      <Box flex="1">
        <Dropdown onDismiss={() => setIsDropdownOpen(false)}>
          <DropdownLink
            icon={isDropdownOpen ? ChevronUpIcon : ChevronDownIcon}
            iconPosition="right"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {status ?? ''}
          </DropdownLink>
          <DropdownOverlay>
            <ActionList>
              <ActionListItem
                onClick={({ name, value }) => {
                  console.log({ name, value });
                  setStatus(name);
                }}
                isSelected={status === 'latest-added'}
                title="Latest Added"
                value="latest-added"
              />
              <ActionListItem
                onClick={({ name, value }) => {
                  console.log({ name, value });
                  setStatus(name);
                }}
                isSelected={status === 'latest-invoice'}
                title="Latest Invoice"
                value="latest-invoice"
              />

              <ActionListItem
                onClick={({ name, value }) => {
                  console.log({ name, value });
                  setStatus(name);
                }}
                isSelected={status === 'oldest-due-date'}
                title="Oldest Due Date"
                value="oldest-due-date"
              />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    </Box>
  );
};

InternalLinkDropdown.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};

export default DropdownStoryMeta;
