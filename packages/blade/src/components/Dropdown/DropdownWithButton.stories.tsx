import React from 'react';
import { DropdownButton } from './DropdownButton';
import { Dropdown, DropdownOverlay } from '.';
import {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  ActionListSection,
} from '~components/ActionList';
import { CheckIcon, ClockIcon, CloseIcon, MyAccountIcon } from '~components/Icons';
import { Box } from '~components/Box';
import { Badge } from '~components/Badge';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/Stories/With Button',
  component: Dropdown,
  subcomponents: { DropdownButton },
  args: {},
};

export const Default = (): JSX.Element => {
  return (
    <Box width={{ base: '100%', m: '500px' }}>
      <Dropdown>
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

export const ControlledMenu = (): JSX.Element => {
  const [status, setStatus] = React.useState<string | undefined>();

  return (
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
  );
};

export const ControlledMultiSelectMenu = (): JSX.Element => {
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
    <Box>
      <Box display="flex" paddingBottom="spacing.5" minHeight="spacing.10">
        {filters.map((filter) => (
          <Badge marginRight="spacing.3" variant="information" key={filter}>
            {filter}
          </Badge>
        ))}
      </Box>
      <Dropdown selectionType="multiple">
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

export default DropdownStoryMeta;
