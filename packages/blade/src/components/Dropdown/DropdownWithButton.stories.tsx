import React from 'react';
import { DropdownButton } from './DropdownButton';
import type { DropdownProps } from '.';
import { Dropdown, DropdownOverlay } from '.';
import {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  ActionListSection,
} from '~components/ActionList';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CloseIcon,
  MyAccountIcon,
} from '~components/Icons';
import { Box } from '~components/Box';
import { Badge } from '~components/Badge';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/With Button',
  component: Dropdown,
  args: {
    selectionType: 'single',
  },
  argTypes: {
    selectionType: {
      options: ['single', 'multiple'],
      control: 'radio',
    },
    ...getStyledPropsArgTypes(),
  },
};

export const Default = (args: DropdownProps): JSX.Element => {
  return (
    <Box minHeight="200px" width={{ base: '100%', m: '500px' }}>
      <Dropdown {...args}>
        <DropdownButton icon={MyAccountIcon} variant="secondary">
          My Account
        </DropdownButton>
        <DropdownOverlay>
          <ActionList>
            <ActionListSection title="Account @saurabh">
              <ActionListItem
                title="My Profile"
                value="profile"
                href="https://youtu.be/4qRZmFYdozY?t=33"
              />
              <ActionListItem
                title="Dashboard"
                value="dashboard"
                href="https://dashboard.razorpay.com/"
              />
              <ActionListItem
                title="Settings"
                value="settings"
                href="https://memezila.com/Me-changing-the-phone-language-just-for-fun-Couldnt-find-language-setting-now-meme-5150"
              />
            </ActionListSection>
            <ActionListItem
              intent="negative"
              title="Log Out"
              value="logout"
              onClick={() => {
                // eslint-disable-next-line no-alert
                alert('Logging out');
              }}
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const ControlledMenu = (args: DropdownProps): JSX.Element => {
  const [status, setStatus] = React.useState<string | undefined>('in-progress');
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Box minHeight="200px">
      <Dropdown
        {...args}
        onDismiss={() => {
          setIsOpen(false);
        }}
      >
        <DropdownButton
          variant="tertiary"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
          iconPosition="right"
        >
          Status: {status ?? ''}
        </DropdownButton>
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

ControlledMenu.parameters = {
  docs: {
    description: {
      story:
        'Check out https://codesandbox.io/s/blade-controlled-select-vxg30b?file=/App.tsx for live example',
    },
  },
};

export const ControlledMultiSelectMenu = (args: DropdownProps): JSX.Element => {
  const [filters, setFilters] = React.useState<string[]>([]);

  const selectItem = ({ name, value }: { name: string; value?: boolean }): void => {
    if (value) {
      // Value is true which means it is selected. Then we deselect it.
      const existingItemIndex = filters.indexOf(name);
      setFilters([...filters.slice(0, existingItemIndex), ...filters.slice(existingItemIndex + 1)]);
    } else {
      setFilters([...filters, name]);
    }
  };

  return (
    <Box minHeight="200px">
      <Box display="flex" paddingBottom="spacing.5" minHeight="spacing.10">
        {filters.map((filter) => (
          <Badge marginRight="spacing.3" variant="information" key={filter}>
            {filter}
          </Badge>
        ))}
      </Box>
      <Dropdown {...args}>
        <DropdownButton variant="tertiary">Filters: {filters.length} Applied</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                selectItem({ name, value });
              }}
              isSelected={filters.includes('< 3 months')}
              title="Last 3 months"
              value="< 3 months"
            />
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                selectItem({ name, value });
              }}
              isSelected={filters.includes('> 1000rs')}
              title="More than 1000rs"
              value="> 1000rs"
            />
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                selectItem({ name, value });
              }}
              isSelected={filters.includes('failed')}
              title="Failed Transactions"
              value="failed"
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};
ControlledMultiSelectMenu.args = {
  selectionType: 'multiple',
};

ControlledMultiSelectMenu.parameters = {
  docs: {
    description: {
      story:
        'Check out https://codesandbox.io/s/blade-controlled-select-vxg30b?file=/App.tsx for live example',
    },
  },
};

export default DropdownStoryMeta;
