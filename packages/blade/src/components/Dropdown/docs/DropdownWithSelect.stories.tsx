import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { Dropdown, DropdownFooter, DropdownHeader, DropdownOverlay } from '..';
import type { SelectInputProps } from '~components/Input/DropdownInputTriggers';
import { AutoComplete, SelectInput } from '~components/Input/DropdownInputTriggers';
import {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  ActionListItemIcon,
  ActionListItemText,
  ActionListSection,
} from '~components/ActionList';
import { ArrowRightIcon, DownloadIcon, HomeIcon, SettingsIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Alert } from '~components/Alert';
import { Badge } from '~components/Badge';
import { Code, Heading, Text } from '~components/Typography';
import type { BladeElementRef } from '~utils/types';

const DropdownStoryMeta: Meta = {
  title: 'Components/Dropdown/With Select',
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

const DropdownTemplate: StoryFn<typeof Dropdown> = ({ selectionType = 'single' }) => {
  return (
    <Box minHeight="300px" padding="spacing.5">
      <Dropdown selectionType={selectionType}>
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
  );
};

export const WithSingleSelect = DropdownTemplate.bind({});
export const WithMultiSelect = DropdownTemplate.bind({});
WithMultiSelect.args = {
  selectionType: 'multiple',
};
WithMultiSelect.parameters = {
  docs: {
    description: {
      story:
        'Add `selectionType="multiple"` to `<Dropdown />` component to make it multi-selectable',
    },
  },
};

export const WithHeaderFooterScrollbar = (): React.ReactElement => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <Box minHeight="300px" padding="spacing.5">
      <Dropdown isOpen={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <SelectInput
          label="Select Action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
        />
        <DropdownOverlay>
          <DropdownHeader title="Header Title" />
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
            <ActionListSection title="More Options">
              <ActionListItem
                leading={<ActionListItemIcon icon={SettingsIcon} />}
                title="Settings"
                value="settings-2"
              />
              <ActionListItem
                leading={<ActionListItemIcon icon={DownloadIcon} />}
                title="Download"
                value="download-2"
              />
            </ActionListSection>
            <ActionListSection title="Even More Options">
              <ActionListItem
                leading={<ActionListItemIcon icon={SettingsIcon} />}
                title="Settings"
                value="settings-3"
              />
              <ActionListItem
                leading={<ActionListItemIcon icon={DownloadIcon} />}
                title="Download"
                value="download-3"
              />
            </ActionListSection>
            <ActionListItem
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing-2"
            />
            <ActionListItem
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing-3"
            />
          </ActionList>
          <DropdownFooter>
            <Button
              isFullWidth
              onClick={() => {
                setIsDropdownOpen(false);
              }}
            >
              Close
            </Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const WithValueDisplay = (): React.ReactElement => {
  const [currentSelections, setCurrentSelections] = React.useState<string[]>([]);

  return (
    <Box minHeight="300px" padding="spacing.5">
      <Box paddingY="spacing.4" display="flex" gap="spacing.4">
        {currentSelections.map((currentSelection) => (
          <Badge key={currentSelection}>{currentSelection}</Badge>
        ))}
      </Box>
      <Dropdown selectionType="multiple">
        <SelectInput
          label="City"
          placeholder="Select your City"
          name="action"
          onChange={({ values }) => {
            setCurrentSelections(values);
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
  );
};

export const WithHTMLFormSubmission = (): React.ReactElement => {
  const [submissionValues, setSubmissionValues] = React.useState('');

  return (
    <Box minHeight="300px" padding="spacing.5">
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
        <Dropdown selectionType="multiple">
          <SelectInput label="Cities" placeholder="Select Cities" name="cities" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Pune" value="pune" />
              <ActionListItem title="Bangalore" value="bangalore" />
              <ActionListItem title="Mysore" value="mysore" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
        <Button marginTop="spacing.8" marginBottom="spacing.4" type="submit">
          Submit
        </Button>
        <Text>Form Submitted with {submissionValues}</Text>
      </form>
    </Box>
  );
};

export const WithValidationState = (): React.ReactElement => {
  const [validationState, setValidationState] = React.useState<SelectInputProps['validationState']>(
    'none',
  );

  return (
    <Box minHeight="300px" padding="spacing.5">
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
          <ActionList>
            <ActionListItem title="Blade" value="blade" />
            <ActionListItem title="Primer" value="primer" />
            <ActionListItem title="Geist" description="by Vercel" value="geist" />
            <ActionListItem title="Airbnb Design" value="airbnb" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const WithRefUsage = (): React.ReactElement => {
  const selectRef = React.useRef<BladeElementRef>(null);

  return (
    <Box minHeight="300px" padding="spacing.5">
      <Dropdown>
        <SelectInput ref={selectRef} label="City" placeholder="Select your City" name="city" />
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
          We are using <Code size="medium">selectRef.current.focus()</Code> here to focus on input
        </Text>
      </Box>
    </Box>
  );
};

export const WithAutoPositioning = (): React.ReactElement => {
  return (
    <Box>
      <Box
        padding="spacing.5"
        backgroundColor="surface.background.gray.moderate"
        width="100%"
        minHeight="100px"
        overflow="scroll"
      >
        <Dropdown selectionType="multiple">
          <SelectInput label="Select fruits" labelPosition="left" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apples" value="Apples" />
              <ActionListItem title="Appricots" value="Appricots" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
      <Box
        padding="spacing.5"
        backgroundColor="surface.background.gray.moderate"
        width="100%"
        position="fixed"
        bottom="spacing.0"
        minHeight="100px"
        overflow="scroll"
      >
        <Dropdown selectionType="multiple">
          <SelectInput label="Select fruits" labelPosition="left" />
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

export const WithMultipleDropdowns = (): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="row" minHeight="300px" gap="spacing.2" padding="spacing.5">
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

export const WithControlledSelect = (): React.ReactElement => {
  const [currentSelection, setCurrentSelection] = React.useState<undefined | string>();

  return (
    <Box minHeight="300px" padding="spacing.5">
      <Button marginBottom="spacing.4" onClick={() => setCurrentSelection('bangalore')}>
        Select Bangalore
      </Button>
      <Button
        marginBottom="spacing.4"
        marginLeft="spacing.4"
        variant="secondary"
        onClick={() => setCurrentSelection('')}
      >
        Clear Selection
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
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const WithControlledMultiSelect = (): React.ReactElement => {
  const [currentSelection, setCurrentSelection] = React.useState<string[]>([]);

  return (
    <Box minHeight="300px" padding="spacing.5">
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
      <Dropdown selectionType="multiple">
        <SelectInput
          label="Select City"
          value={currentSelection}
          onChange={(args) => {
            if (args) {
              setCurrentSelection(args.values);
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
    </Box>
  );
};

export const WithSizes = (): React.ReactElement => {
  return (
    <Box minHeight="400px" padding="spacing.5">
      <Heading size="medium" marginBottom="spacing.3">
        Medium:
      </Heading>
      <Dropdown selectionType="multiple">
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
      <Heading size="medium" marginBottom="spacing.3" marginTop="spacing.5">
        Large:
      </Heading>
      <Dropdown selectionType="multiple">
        <SelectInput
          label="City"
          placeholder="Select your City"
          name="action"
          size="large"
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
  );
};

// For chromatic and internal react native testing
export const InternalControlledSelect = (): React.ReactElement => {
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
      <Dropdown selectionType="multiple">
        <SelectInput
          label="Select City"
          value={currentSelection}
          onChange={(args) => {
            if (args) {
              setCurrentSelection(args.values);
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

InternalControlledSelect.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};

// For chromatic and internal react native testing
export const InternalMultiSelect = (): React.ReactElement => {
  return (
    <Box padding="spacing.5" maxWidth="300px">
      <Dropdown selectionType="multiple">
        <SelectInput label="Select City" maxRows="single" />
        <DropdownOverlay width="500px">
          <DropdownHeader title="Header Title" subtitle="Header subtitle" />
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Navi Mumbai" value="navi-mumbai" />
            <ActionListItem title="Farrukhabad Fatehgarh" value="farrukhabad-fatehgarh" />
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Chennai" value="chennai" />
            <ActionListItem title="Hyderabad" value="hyderabad" />
            <ActionListItem title="Varanasi" value="varanasi" />
            <ActionListItem title="Mysore" value="mysore" />
            <ActionListItem title="New York" value="new-york" />
            <ActionListItem title="Indore" value="indore" />
            <ActionListItem title="Kolhapur" value="kolhapur" />
            <ActionListItem title="Ooty" value="ooty" />
          </ActionList>
          <DropdownFooter>
            <Button isFullWidth onClick={() => console.log('Footer Clicked')}>
              Apply
            </Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
      <Button marginTop="spacing.4">Outer Button</Button>
    </Box>
  );
};

InternalControlledSelect.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};

// For chromatic and internal react native testing
export const InternalControlledSingleSelect = (): React.ReactElement => {
  const [currentSelection, setCurrentSelection] = React.useState<string>('');

  return (
    <>
      <Button
        marginBottom="spacing.4"
        onClick={() => {
          setCurrentSelection('bangalore');
        }}
      >
        Select Bangalore
      </Button>
      <Button
        variant="secondary"
        marginBottom="spacing.4"
        marginLeft="spacing.4"
        onClick={() => {
          setCurrentSelection('');
        }}
      >
        Clear Selection
      </Button>
      <Dropdown>
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

InternalControlledSingleSelect.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};

export const InternalSelect = (): React.ReactElement => {
  return (
    <Box
      padding="spacing.5"
      backgroundColor="surface.background.gray.moderate"
      width="100%"
      minHeight="100px"
      overflow="scroll"
    >
      <Dropdown selectionType="multiple">
        <SelectInput label="Select fruits" labelPosition="left" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apples" value="Apples" />
            <ActionListItem title="Appricots" value="Appricots" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const InternalDisabledSelect = (): React.ReactElement => {
  const [isDisabled, setIsDisabled] = React.useState(false);
  return (
    <Box padding="spacing.5" maxWidth="400px">
      <Button marginBottom="spacing.4" isFullWidth onClick={() => setIsDisabled(!isDisabled)}>
        Toggle Disabled State
      </Button>
      <Dropdown selectionType="multiple">
        <SelectInput label="Select fruits" isDisabled={isDisabled} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Apples" value="Apples" />
            <ActionListItem title="Appricots" value="Appricots" />
            <ActionListItem title="Cherries" value="Cherries" />
            <ActionListItem title="Crab apples" value="Crab apples" />
            <ActionListItem title="Jambolan" value="Jambolan" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const InternalAutoPositioning = (): React.ReactElement => {
  return (
    <Box>
      <Box
        padding="spacing.5"
        backgroundColor="surface.background.gray.moderate"
        width="100%"
        minHeight="100px"
        overflow="scroll"
      >
        <Dropdown selectionType="multiple">
          <SelectInput label="Select fruits" labelPosition="left" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Apples" value="Apples" />
              <ActionListItem title="Appricots" value="Appricots" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
      <Box
        padding="spacing.5"
        backgroundColor="surface.background.gray.moderate"
        width="100%"
        position="fixed"
        bottom="spacing.0"
        minHeight="100px"
        overflow="scroll"
      >
        <Dropdown selectionType="multiple">
          <SelectInput label="Select fruits" labelPosition="left" />
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

export const InternalSectionListPerformance = (): React.ReactElement => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput label="Select fruits" />
      <DropdownOverlay>
        <ActionList isVirtualized>
          <ActionListItem title="Apples" value="Apples" />
          <ActionListItem title="Appricots" value="Appricots" />
          <ActionListItem title="Abc" value="Abc" />
          <ActionListItem title="Def" value="Def" />
          <ActionListSection title="Recent 1">
            <ActionListItem title="Avocados" value="Avocados" />
            <ActionListItem title="Bananas" value="Bananas" />
            <ActionListItem title="Blueberries" value="Blueberries" />
          </ActionListSection>

          <ActionListSection title="Recent 2">
            <ActionListItem title="Cherries" value="Cherries" />
            <ActionListItem title="Crab apples" value="Crab apples" />
            <ActionListItem title="Jambolan" value="Jambolan" />
          </ActionListSection>
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

InternalSectionListPerformance.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};

export const InternalDropdownWithSearch = (): React.ReactElement => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput label="Select fruits" />
      <DropdownOverlay>
        <DropdownHeader>
          <AutoComplete label="Search Fruits" />
        </DropdownHeader>
        <ActionList>
          <ActionListItem title="Apples" value="Apples" />
          <ActionListItem title="Appricots" value="Appricots" />
          <ActionListItem title="Cherries" value="Cherries" />
          <ActionListItem title="Crab apples" value="Crab apples" />
          <ActionListItem title="Jambolan" value="Jambolan" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export const InternalDropdownPerformance = (): React.ReactElement => {
  const fruits = [
    'Apples',
    'Apricots',
    { name: 'Avocados', description: 'Avocados description' },
    'Bananas',
    'Boysenberries',
    'Blueberries',
    'Bing Cherry',
    'Cherries',
    'Cantaloupe',
    'Crab apples',
    { name: 'Clementine', description: 'Clementine description' },
    'Cucumbers',
    'Damson plum',
    'Dinosaur Eggs',
    'Dates',
    'Dewberries',
    'Dragon',
    'Elderberry',
    'Eggfruit',
    'Evergreen',
    'Huckleberry',
    'Entawak',
    'Fig',
    'Farkleberry',
    'Finger Lime',
    'Grapefruit',
    'Grapes',
    'Gooseberries',
    'Guava',
    'Honeydew melon',
    'Hackberry',
    'Honeycrisp Apples',
    'Indian Prune',
    'Indonesian Lime',
    'Imbe',
    'Indian Fig',
    'Jackfruit',
    'Java Apple',
    'Jambolan',
    { name: 'Kaffir Lime', description: 'Kaffir description' },
    'Kumquat',
    'Lime',
    'Longan',
    'Lychee',
    'Loquat',
    'Mango',
    'Mandarin',
    'Orange',
    'Mulberry',
  ];

  return (
    <Dropdown selectionType="multiple">
      <AutoComplete label="Select fruits" />
      <DropdownOverlay>
        <ActionList isVirtualized>
          {fruits.map((fruit) => {
            if (typeof fruit === 'string') {
              return <ActionListItem key={fruit} title={fruit} value={fruit} />;
            }

            return (
              <ActionListItem
                trailing={<ActionListItemText>⌘ + S</ActionListItemText>}
                leading={<ActionListItemIcon icon={HomeIcon} />}
                key={fruit.name}
                title={fruit.name}
                value={fruit.name}
              />
            );
          })}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export const WithVirtualization = (): React.ReactElement => {
  function getRandomString(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  function generateDropdownData(
    numEntries: number,
  ): Record<string, { value: string; label: string }[]> {
    const dropdownData: Record<string, { value: string; label: string }[]> = {};

    for (let i = 0; i < numEntries; i++) {
      const city = `${getRandomString(Math.floor(Math.random() * 5) + 5)}ville-${1}`; // Random city name
      const state = `${getRandomString(Math.floor(Math.random() * 7) + 3)}land-${2}`; // Random state name
      const country = 'GibberishLand'; // Random country name

      const areas = [];
      const numAreas = Math.floor(Math.random() * 10);

      for (let j = 0; j < numAreas; j++) {
        const area = `Area-${city}-${j}`;
        areas.push({
          value: `${country.toLowerCase()}-${state.toLowerCase()}-${city.toLowerCase()}-${area.toLowerCase()}`,
          label: area,
        });
      }

      dropdownData[city] = areas;
    }

    return dropdownData;
  }
  const dropdownData = generateDropdownData(20);

  return (
    <Box padding="8px">
      <Box> Virtualized with ActionListSection </Box>
      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Hierarchy Level"
          placeholder="Select your location"
          name="action"
          maxRows="multiple"
        />
        <DropdownOverlay>
          <ActionList isVirtualized={true}>
            {Object.keys(dropdownData).map((sectionKey) => {
              const section = dropdownData[sectionKey];
              return (
                <ActionListSection title={sectionKey} key={sectionKey}>
                  {section.map((item) => (
                    <ActionListItem title={item.label} value={item.value} key={item.value} />
                  ))}
                </ActionListSection>
              );
            })}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <Box> Virtualized</Box>
      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Hierarchy Level"
          placeholder="Select your location"
          name="action"
          maxRows="multiple"
        />
        <DropdownOverlay>
          <ActionList isVirtualized={true}>
            {[...Array(500)].map((_, index) => (
              <ActionListItem
                title={`Item ${index}`}
                value={`Item ${index}`}
                key={`Item ${index}`}
              />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <Box> Non Virtualized</Box>
      <Dropdown selectionType="single">
        <AutoComplete
          label="Hierarchy Level"
          placeholder="Select your location"
          name="action"
          maxRows="multiple"
        />
        <DropdownOverlay>
          <ActionList>
            {[...Array(300)].map((_, index) => (
              <ActionListItem
                title={`Item ${index}`}
                value={`Item ${index}`}
                key={`Item ${index}`}
              />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};
InternalDropdownPerformance.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};

export default DropdownStoryMeta;

export const WithInputDropDownButton = (): React.ReactElement => {
  const [currentSelection, setCurrentSelection] = React.useState<undefined | string>('mumbai');

  return (
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
  );
};

WithInputDropDownButton.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};
