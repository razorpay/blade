import type { DropdownProps } from '../types';

const Playground = `
  import { 
    Dropdown, 
    DropdownOverlay,
    DropdownHeader,
    DropdownFooter,
    SelectInput,
    ActionList,
    ActionListItem,
    ActionListItemIcon,
    ActionListItemBadge,
    ActionListItemBadgeGroup,
    ActionListSection,
    HistoryIcon,
    HomeIcon,
    ArrowRightIcon,
    SettingsIcon,
    DownloadIcon,
    InfoIcon,
    FileTextIcon,
    Button
  } from '@razorpay/blade/components';

  function App() {
    return (
      <Dropdown 
        // Uncomment next line to make it multiselectable
        // selectionType="multiple"
      >
        <SelectInput
          label="Select Action"
          placeholder="Select Option"
          name="action"
          onChange={({ name, values }) => {
            console.log(name, values);
          }}
        />
        <DropdownOverlay>
          <DropdownHeader
            title="Header Title"
            subtitle="Header Subtitle"
          />
          <ActionList>
            <ActionListItem
              leading={<ActionListItemIcon icon={HomeIcon} />}
              titleSuffix={
                <ActionListItemBadgeGroup>
                  <ActionListItemBadge>as: Option</ActionListItemBadge>
                  <ActionListItemBadge>as: Main</ActionListItemBadge>
                </ActionListItemBadgeGroup>
              }
              trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
              title="Home"
              value="home"
              description="Home sweet home it is"
            />
            <ActionListSection title="Options">
              <ActionListItem
                leading={<ActionListItemIcon icon={SettingsIcon} />}
                title="Settings"
                value="settings"
              />
              <ActionListItem
                leading={<ActionListItemIcon icon={DownloadIcon} />}
                title="Download"
                value="download"
              />
            </ActionListSection>
          </ActionList>
          <DropdownFooter>
            <Button isFullWidth onClick={console.log}>Apply</Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
    )
  }

  export default App;
`;

const getSimpleSelectCode = (selectionType: DropdownProps['selectionType']): string => `
  import { 
    Dropdown, 
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
  } from '@razorpay/blade/components';

  function App() {
    return (
      <Dropdown 
        selectionType="${selectionType}"
      >
        <SelectInput
          label="City"
          placeholder="Select your City"
          name="action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Mysore" value="mysore" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    )
  }

  export default App;
`;

const WithControlledSelectStory = `
  import React from 'react';
  import {
    Dropdown,
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Button,
  } from '@razorpay/blade/components';

  function App(args): React.ReactElement {
    const [currentSelection, setCurrentSelection] = React.useState<undefined | string>();
  
    return (
      <>
        <Button marginBottom="spacing.4" onClick={() => setCurrentSelection('bangalore')}>Select Bangalore</Button>
        <Button marginBottom="spacing.4" marginLeft="spacing.4" onClick={() => setCurrentSelection('')}>Clear Selection</Button>
        <Dropdown selectionType="single">
          <SelectInput
            label="Select City"
            value={currentSelection}
            onChange={(args) => {
              if (args) {
                setCurrentSelection(args.values[0]);
                console.log('onChange triggered');
              }
            }}
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Bangalore" value="bangalore" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </>
    );
  };

  export default App;
`;

// MENU STORIES

const WithSimpleMenuStory = `
  import {
    Dropdown,
    DropdownOverlay,
    DropdownButton,
    ActionList,
    ActionListItem,
    ActionListSection,
    MyAccountIcon,
    Box,
  } from '@razorpay/blade/components';

  function App (): React.ReactElement {
    return (
      <Box minHeight="200px" width={{ base: '100%', m: '500px' }}>
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

  export default App;
`;

const WithControlledMenuStory = `
  import React from 'react';
  import {
    Dropdown,
    DropdownOverlay,
    DropdownButton,
    ActionList,
    ActionListItem,
    ActionListItemIcon,
    ActionListSection,
    Box,
    CheckIcon,
    ClockIcon,
    CloseIcon
  } from '@razorpay/blade/components';

  function App() {
    const [status, setStatus] = React.useState<string | undefined>();

    return (
      <Box minHeight="200px">
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

  export default App;
`;

export {
  Playground,
  getSimpleSelectCode,
  WithControlledSelectStory,
  WithSimpleMenuStory,
  WithControlledMenuStory,
};
