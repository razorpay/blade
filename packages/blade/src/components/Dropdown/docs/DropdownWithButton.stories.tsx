import React from 'react';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownLink, DropdownOverlay } from '..';
import { DropdownFooter, DropdownHeader } from '../DropdownHeaderFooter';
import {
  WithControlledMenuStory,
  WithControlledMultiSelectMenuStory,
  WithLinkStory,
  WithRightAlignedMenuStory,
  WithSimpleMenuStory,
} from './stories';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Box } from '~components/Box';
import { ActionList, ActionListItem, ActionListItemIcon } from '~components/ActionList';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CloseIcon,
  StarIcon,
} from '~components/Icons';
import { Text } from '~components/Typography';
import { Checkbox } from '~components/Checkbox';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';

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

export const Default = (): React.ReactElement => {
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

export const WithLink = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithLinkStory}
    </Sandbox>
  );
};

export const WithRightAlignedMenu = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithRightAlignedMenuStory}
    </Sandbox>
  );
};

export const WithControlledMenu = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithControlledMenuStory}
    </Sandbox>
  );
};

export const WithControlledMultiSelect = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithControlledMultiSelectMenuStory}
    </Sandbox>
  );
};

// This is for Chromatic and react native testing
export const InternalMenu = (): React.ReactElement => {
  const [status, setStatus] = React.useState<string | undefined>();

  return (
    <Box minHeight="200px" padding="spacing.10">
      <Dropdown>
        <DropdownButton variant="tertiary">Status: {status ?? ''}</DropdownButton>
        <DropdownOverlay>
          <DropdownHeader
            leading={<StarIcon color="surface.text.normal.lowContrast" size="large" />}
            title="Header Title Header Title Header Title Header Title Header Title"
            subtitle="Header Subtitle"
            titleSuffix={<Badge variant="positive">New</Badge>}
            trailing={<Amount value={1000} />}
          />
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
          <DropdownFooter>
            <Box display="flex" alignItems="center" justifyContent="center" minWidth="300px">
              <Box flex="5" display="flex">
                <Checkbox>I agree terms and conditions</Checkbox>
              </Box>
              <Box flex="2">
                <Button isFullWidth>Apply</Button>
              </Box>
            </Box>
          </DropdownFooter>
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

export const InternalAutoPositioning = (): React.ReactElement => {
  return (
    <Box>
      <Box display="inline-flex" position="fixed" left="spacing.5" top="spacing.5">
        <Dropdown>
          <DropdownButton>Top Left Menu</DropdownButton>
          <DropdownOverlay>
            <ActionList surfaceLevel={3}>
              <ActionListItem title="Apples" value="Apples" />
              <ActionListItem title="Appricots" value="Appricots" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
      <Box display="inline-flex" position="fixed" right="spacing.5" top="spacing.5">
        <Dropdown>
          <DropdownButton>Top Right Menu</DropdownButton>
          <DropdownOverlay>
            <ActionList surfaceLevel={3}>
              <ActionListItem title="Apples" value="Apples" />
              <ActionListItem title="Appricots" value="Appricots" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
      <Box display="inline-flex" position="fixed" right="spacing.5" bottom="spacing.5">
        <Dropdown>
          <DropdownButton>Bottom Right Menu</DropdownButton>
          <DropdownOverlay>
            <ActionList surfaceLevel={3}>
              <ActionListItem title="Apples" value="Apples" />
              <ActionListItem title="Appricots" value="Appricots" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
      <Box display="inline-flex" position="fixed" left="spacing.5" bottom="spacing.5">
        <Dropdown>
          <DropdownButton>Bottom Left Menu</DropdownButton>
          <DropdownOverlay>
            <ActionList surfaceLevel={3}>
              <ActionListItem title="Apples" value="Apples" />
              <ActionListItem title="Appricots" value="Appricots" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    </Box>
  );
};

export const InternalLinkDropdown = (): React.ReactElement => {
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
