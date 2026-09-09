import React from 'react';
import { DropdownButton } from '../DropdownButton';
import { Dropdown, DropdownLink, DropdownOverlay } from '..';
import { DropdownFooter, DropdownHeader } from '../DropdownHeaderFooter';
import { DropdownIconButton } from '../DropdownIconButton';
import { Box } from '~components/Box';
import {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  ActionListSection,
} from '~components/ActionList';
import {
  BoxIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CloseIcon,
  MyAccountIcon,
  StarIcon,
} from '~components/Icons';
import { Text } from '~components/Typography';
import { Checkbox } from '~components/Checkbox';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';
import { Tag } from '~components/Tag';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

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
    <Box minHeight="200px" width={{ base: '100%', m: '500px' }} padding="spacing.5">
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
                target="_blank"
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
                console.log('Logging out');
              }}
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const WithLink = (): React.ReactElement => {
  const [status, setStatus] = React.useState<string | undefined>('latest-added');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <Box padding="spacing.10" display="flex" alignItems="center" gap="spacing.2">
      <Text>Sort By</Text>
      <Box flex="1">
        <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownLink
            icon={isDropdownOpen ? ChevronUpIcon : ChevronDownIcon}
            iconPosition="right"
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

export const WithIconButton = (): React.ReactElement => {
  const [status, setStatus] = React.useState<string | undefined>('latest-added');

  return (
    <Box padding="spacing.10">
      <Dropdown>
        <DropdownIconButton icon={BoxIcon} accessibilityLabel="Set Status" />
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
  );
};

export const WithAutoPositioning = (): React.ReactElement => {
  return (
    <Box>
      <Box display="inline-flex" position="fixed" left="spacing.5" top="spacing.5">
        <Dropdown>
          <DropdownButton>Top Left Menu</DropdownButton>
          <DropdownOverlay>
            <ActionList>
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
            <ActionList>
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
            <ActionList>
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
            <ActionList>
              <ActionListItem title="Apples" value="Apples" />
              <ActionListItem title="Appricots" value="Appricots" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    </Box>
  );
};

export const WithControlledMenu = (): React.ReactElement => {
  const [status, setStatus] = React.useState<string | undefined>();

  return (
    <Box minHeight="200px" padding="spacing.5">
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

export const WithControlledMultiSelect = (): React.ReactElement => {
  const [filters, setFilters] = React.useState<string[]>([]);

  const toggleSelection = ({ name, value }: { name: string; value?: boolean }): void => {
    if (value) {
      // Value is true which means it is selected. Then we deselect it.
      const existingItemIndex = filters.indexOf(name);
      setFilters([...filters.slice(0, existingItemIndex), ...filters.slice(existingItemIndex + 1)]);
    } else {
      setFilters([...filters, name]);
    }
  };

  return (
    <Box minHeight="200px" padding="spacing.5">
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        paddingBottom="spacing.5"
        minHeight="spacing.10"
      >
        {filters.map((filter) => (
          <Tag
            key={filter}
            marginRight="spacing.3"
            onDismiss={() => {
              toggleSelection({ name: filter, value: true });
            }}
          >
            {filter}
          </Tag>
        ))}
      </Box>
      <Dropdown selectionType="multiple">
        <DropdownButton variant="tertiary">Filters: {filters.length} Applied</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                toggleSelection({ name, value });
              }}
              isSelected={filters.includes('< 3 months')}
              title="Last 3 months"
              value="< 3 months"
            />
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                toggleSelection({ name, value });
              }}
              isSelected={filters.includes('> 1000rs')}
              title="More than 1000rs"
              value="> 1000rs"
            />
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                toggleSelection({ name, value });
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

export const WithTooltip = (): React.ReactElement => {
  const [status, setStatus] = React.useState<string | undefined>('latest-added');

  return (
    <Box padding="spacing.10">
      <Tooltip content="Change Status">
        <TooltipInteractiveWrapper>
          <Dropdown>
            <DropdownIconButton icon={BoxIcon} accessibilityLabel="Set Status" />
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
        </TooltipInteractiveWrapper>
      </Tooltip>
    </Box>
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
            leading={<StarIcon color="surface.icon.gray.normal" size="large" />}
            title="Header Title Header Title Header Title Header Title Header Title"
            subtitle="Header Subtitle"
            titleSuffix={<Badge color="positive">New</Badge>}
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
          <DropdownOverlay width="70%">
            <ActionList>
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
            <ActionList>
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
            <ActionList>
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
            <ActionList>
              <ActionListItem title="Apples" value="Apples" />
              <ActionListItem title="Appricots" value="Appricots" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    </Box>
  );
};

const items = ['Apples', 'Appricots', 'Cherries', 'Crab apples', 'Jambolan'];

export const InternalDropdownWithSearch = (): React.ReactElement => {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <Dropdown selectionType="multiple" margin="spacing.4">
      <DropdownButton variant="tertiary">Fruits: {selected.length}</DropdownButton>
      <DropdownOverlay width="500px" maxWidth="500px">
        <DropdownHeader>
          <AutoComplete label="Search Fruits" />
        </DropdownHeader>
        <ActionList>
          {items.map((item) => (
            <ActionListItem
              key={item}
              title={item}
              value={item}
              onClick={() => setSelected(Array.from(new Set([...selected, item])))}
              isSelected={selected.includes(item)}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export const InternalLinkDropdown = (): React.ReactElement => {
  const [status, setStatus] = React.useState<string | undefined>('latest-added');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <Box padding="spacing.10" display="flex" alignItems="center" gap="spacing.2">
      <Text>Sort By</Text>
      <Box flex="1">
        <Dropdown onOpenChange={setIsDropdownOpen} isOpen={isDropdownOpen}>
          <DropdownLink
            icon={isDropdownOpen ? ChevronUpIcon : ChevronDownIcon}
            iconPosition="right"
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

export const InternalIconButtonDropdown = (): React.ReactElement => {
  const [status, setStatus] = React.useState<string | undefined>('latest-added');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <Box padding="spacing.10">
      <Tooltip content="Check Status">
        <TooltipInteractiveWrapper>
          <Dropdown onOpenChange={setIsDropdownOpen} isOpen={isDropdownOpen}>
            <DropdownIconButton icon={BoxIcon} accessibilityLabel="Status Dropdown" />
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
        </TooltipInteractiveWrapper>
      </Tooltip>
    </Box>
  );
};

export default DropdownStoryMeta;
