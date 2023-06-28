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

  function App(): JSX.Element {
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

  function App(): JSX.Element {
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

const WithHeaderFooterScroll = `
  import { 
    Dropdown, 
    DropdownOverlay,
    DropdownHeader,
    DropdownFooter,
    SelectInput,
    ActionList,
    ActionListItem,
    ActionListItemAsset,
    ActionListItemIcon,
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

  function App(): JSX.Element {
    return (
      <Dropdown>
        <SelectInput
          label="Select Action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
        />
        <DropdownOverlay>
          <DropdownHeader
            title="Header Title"
          />
          <ActionList>
            <ActionListItem
              leading={<ActionListItemIcon icon={HomeIcon} />}
              trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
              title="Home"
              description="This is Home"
              value="home"
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
            <ActionListItem
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing"
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
            <ActionListItem
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing"
            />
            <ActionListItem
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing"
            />
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

const WithValueDisplayStory = `
  import React from 'react';
  import { 
    Dropdown, 
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Badge,
    Box,
  } from '@razorpay/blade/components';

  function App(): JSX.Element {
    const [currentSelections, setCurrentSelections] = React.useState([]);
    
    console.log({currentSelections});

    return (
      <>
        <Box paddingY="spacing.4" display="flex" gap="spacing.4">
          {
            currentSelections.map((currentSelection) => 
              // @todo for blade team: Remove this check once onChange triggers fix goes to production
              currentSelection ? <Badge key={currentSelection}>{currentSelection}</Badge> : null
            )
          }
        </Box>
        <Dropdown 
          selectionType="multiple"
        >
          <SelectInput
            label="City"
            placeholder="Select your City"
            name="action"
            onChange={({ name, values }) => {
              setCurrentSelections(values)
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
      </>
    )
  }

  export default App;
`;

const WithHTMLFormSubmissionStory = `
  import React from 'react';
  import { 
    Dropdown, 
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Button,
    Text,
  } from '@razorpay/blade/components';

  function App(): JSX.Element {
    const [submissionValues, setSubmissionValues] = React.useState('');
    
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const formData: Record<string, string> = {};
          for (const [name, value] of data) {
            formData[name] = String(value);
          }
          setSubmissionValues(JSON.stringify(formData));
        }}
      >
        <Dropdown 
          selectionType="multiple"
        >
          <SelectInput
            label="Cities"
            placeholder="Select Cities"
            name="cities"
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
        <Button 
          marginTop="spacing.8" 
          marginBottom="spacing.4" 
          type="submit"
        >
          Submit
        </Button>
        <Text>Form Submitted with {submissionValues}</Text>
      </form>
    )
  }

  export default App;
`;

const WithValidationStateStory = `
  import React from 'react';
  import {
    Dropdown,
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Box,
    Alert
  } from '@razorpay/blade/components';
  import type { SelectInputProps } from '@razorpay/blade/components';

  function App(): JSX.Element {
    const [validationState, setValidationState] = React.useState<SelectInputProps['validationState']>('none');

    return (
      <Box minHeight="300px" paddingBottom="spacing.5">
        <Alert
          intent="information"
          description="Select more than 2 options to see error state"
          isFullWidth
          isDismissible={false}
          marginBottom="spacing.4"
        />
        <Dropdown selectionType="multiple">
          <SelectInput
            name="design-systems"
            label="Top 2 design systems"
            validationState={validationState}
            errorText="You selected more than 2 options"
            successText="Yay! Nice choice"
            helpText="Select only two"
            label="Top 2 design systems"
            placeholder="Select Multiple Options"
            onChange={({ values }) => {
              if (values.length === 2) {
                setValidationState('success');
              } else if (values.length > 2) {
                setValidationState('error');
              } else {
                setValidationState('none');
              }
            }}
          />
          <DropdownOverlay>
            <ActionList surfaceLevel={2}>
              <ActionListItem title="Blade" value="blade" />
              <ActionListItem title="Primer" value="primer" />
              <ActionListItem title="Geist" description="by Vercel" value="geist" />
              <ActionListItem title="Airbnb Design" value="airbnb" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    )
  }

  export default App;
`;

const WithRefUsageStory = `
  import React from 'react';
  import {
    Dropdown,
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Button,
    Code,
    Box,
    Text
  } from '@razorpay/blade/components';

  function App(): JSX.Element {
    const selectRef = React.useRef<HTMLElement>(null);


    return (
      <Box minHeight="300px">
        <Dropdown >
          <SelectInput
            ref={selectRef}
            label="City"
            placeholder="Select your City"
            name="city"
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
        <Box paddingTop="spacing.3">
          <Button
            onClick={() => {
              selectRef.current?.focus();
            }}
          >
            Click to focus
          </Button>
        </Box>
        <Box paddingTop="spacing.3">
          <Text>
            We are using <Code>selectRef.current.focus()</Code> here to focus on input
          </Text>
        </Box>
      </Box>
    );
  };

  export default App;
`;

const WithMultipleDropdownsStory = `
  import {
    Dropdown,
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Box,
  } from '@razorpay/blade/components';


  function App(): JSX.Element {  
    return (
      <Box display="flex" flexDirection="row" minHeight="300px" gap="spacing.2">
        <Box flex={1}>
          <Dropdown>
            <SelectInput label="Top 2 design systems" />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Primer" value="primer" />
                <ActionListItem title="Geist" description="by Vercel" value="geist" />
                <ActionListItem title="Airbnb Design" value="airbnb" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
        <Box flex={1}>
          <Dropdown>
            <SelectInput label="Top 2 Languages" />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="HTML" value="html" />
                <ActionListItem title="CSS" value="css" />
                <ActionListItem title="JavaScript" value="javascript" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>
    );
  };

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

  function App(args): JSX.Element {
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

const WithControlledMultiSelectStory = `
  import React from 'react';
  import {
    Dropdown,
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Button,
  } from '@razorpay/blade/components';

  function App(args): JSX.Element {
    const [currentSelection, setCurrentSelection] = React.useState<string[]>([]);  

    return (
      <>
        <Button 
          marginBottom="spacing.4"
          onClick={() => {
            if (!currentSelection.includes('bangalore')) {
              setCurrentSelection([...currentSelection, 'bangalore']);
            }
          }}
        >
          Select Bangalore
        </Button>
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
              <ActionListItem title="Pune" value="pune" />
              <ActionListItem title="Chennai" value="chennai" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </>
    );
  };

  export default App;
`;

const WithBottomAlignedSelectStory = `
  import { 
    Dropdown, 
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Box,
  } from '@razorpay/blade/components';

  function App(): JSX.Element {
    return (
      <Box minHeight="95vh" display="flex" alignItems="flex-end">
        <Box flex="1">
          <Dropdown>
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
        </Box>
      </Box>
    )
  }

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

  function App (): JSX.Element {
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

const WithLinkStory = `
  import React from 'react';
  import {
    Dropdown,
    DropdownOverlay,
    DropdownLink,
    ActionList,
    ActionListItem,
    Box,
    ChevronDownIcon,
    ChevronUpIcon,
    Text,
  } from '@razorpay/blade/components';

  function App (): JSX.Element {
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
  }

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

  function App(): JSX.Element {
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

const WithControlledMultiSelectMenuStory = `
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
    Badge,
  } from '@razorpay/blade/components';

  function App(): JSX.Element {
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

  export default App;
`;

const WithRightAlignedMenuStory = `
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

  function App (): JSX.Element {
    return (
      <Box minHeight="200px" width="100%" display="flex" justifyContent="flex-end">
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

export {
  Playground,
  getSimpleSelectCode,
  WithHeaderFooterScroll,
  WithValueDisplayStory,
  WithHTMLFormSubmissionStory,
  WithValidationStateStory,
  WithRefUsageStory,
  WithMultipleDropdownsStory,
  WithControlledSelectStory,
  WithControlledMultiSelectStory,
  WithSimpleMenuStory,
  WithLinkStory,
  WithControlledMenuStory,
  WithControlledMultiSelectMenuStory,
  WithBottomAlignedSelectStory,
  WithRightAlignedMenuStory,
};
