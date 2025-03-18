import React from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Dropdown, DropdownFooter, DropdownHeader, DropdownOverlay } from '..';
import {
  getSimpleSelectCode,
  WithAutoPositioningSelectStory,
  WithControlledMultiSelectStory,
  WithControlledSelectStory,
  WithHeaderFooterScroll,
  WithHTMLFormSubmissionStory,
  WithMultipleDropdownsStory,
  WithRefUsageStory,
  WithValidationStateStory,
  WithValueDisplayStory,
  WithSizesStory,
} from './stories';

import { Sandbox } from '~utils/storybook/Sandbox';
import { AutoComplete, SelectInput } from '~components/Input/DropdownInputTriggers';
import {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  ActionListItemText,
  ActionListSection,
} from '~components/ActionList';
import { HomeIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Box } from '~components/Box';

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
    <Sandbox showConsole padding="spacing.0" editorHeight="100vh">
      {getSimpleSelectCode(selectionType)}
    </Sandbox>
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
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithHeaderFooterScroll}
    </Sandbox>
  );
};

export const WithValueDisplay = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithValueDisplayStory}
    </Sandbox>
  );
};

export const WithHTMLFormSubmission = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithHTMLFormSubmissionStory}
    </Sandbox>
  );
};

export const WithValidationState = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithValidationStateStory}
    </Sandbox>
  );
};

export const WithRefUsage = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithRefUsageStory}
    </Sandbox>
  );
};

export const WithAutoPositioning = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithAutoPositioningSelectStory}
    </Sandbox>
  );
};

export const WithMultipleDropdowns = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithMultipleDropdownsStory}
    </Sandbox>
  );
};

export const WithControlledSelect = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithControlledSelectStory}
    </Sandbox>
  );
};

export const WithControlledMultiSelect = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithControlledMultiSelectStory}
    </Sandbox>
  );
};

export const WithSizes = (): React.ReactElement => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithSizesStory}
    </Sandbox>
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

export const LargeDropDownData = (): React.ReactElement => {
  const dropdownData = {
    Lucknow: [
      {
        value: 'india-uttar-pradesh-lucknow-downtown',
        label: 'Downtown',
      },
      {
        value: 'india-uttar-pradesh-lucknow-city-center',
        label: 'City Center',
      },
      {
        value: 'india-uttar-pradesh-lucknow-tech-park',
        label: 'Tech Park',
      },
      {
        value: 'india-uttar-pradesh-lucknow-new-market',
        label: 'New Market',
      },
      {
        value: 'india-uttar-pradesh-lucknow-main-street',
        label: 'Main Street',
      },
    ],
    Kolkata: [
      {
        value: 'india-west-bengal-kolkata-west-end',
        label: 'West End',
      },
      {
        value: 'india-west-bengal-kolkata-old-town',
        label: 'Old Town',
      },
      {
        value: 'india-west-bengal-kolkata-new-market',
        label: 'New Market',
      },
      {
        value: 'india-west-bengal-kolkata-main-street',
        label: 'Main Street',
      },
      {
        value: 'india-west-bengal-kolkata-city-center',
        label: 'City Center',
      },
    ],
    Amritsar: [
      {
        value: 'india-punjab-amritsar-west-end',
        label: 'West End',
      },
      {
        value: 'india-punjab-amritsar-old-town',
        label: 'Old Town',
      },
    ],
    Jodhpur: [
      {
        value: 'india-rajasthan-jodhpur-new-market',
        label: 'New Market',
      },
      {
        value: 'india-rajasthan-jodhpur-industrial-area',
        label: 'Industrial Area',
      },
      {
        value: 'india-rajasthan-jodhpur-downtown',
        label: 'Downtown',
      },
      {
        value: 'india-rajasthan-jodhpur-west-end',
        label: 'West End',
      },
      {
        value: 'india-rajasthan-jodhpur-city-center',
        label: 'City Center',
      },
    ],
    Jaipur: [
      {
        value: 'india-rajasthan-jaipur-industrial-area',
        label: 'Industrial Area',
      },
      {
        value: 'india-rajasthan-jaipur-old-town',
        label: 'Old Town',
      },
      {
        value: 'india-rajasthan-jaipur-new-market',
        label: 'New Market',
      },
    ],
    Ahmedabad: [
      {
        value: 'india-gujarat-ahmedabad-main-street',
        label: 'Main Street',
      },
      {
        value: 'india-gujarat-ahmedabad-downtown',
        label: 'Downtown',
      },
    ],
    Chennai: [
      {
        value: 'india-tamil-nadu-chennai-east-bay',
        label: 'East Bay',
      },
      {
        value: 'india-tamil-nadu-chennai-industrial-area',
        label: 'Industrial Area',
      },
      {
        value: 'india-tamil-nadu-chennai-city-center',
        label: 'City Center',
      },
    ],
    Nagpur: [
      {
        value: 'india-maharashtra-nagpur-west-end',
        label: 'West End',
      },
      {
        value: 'india-maharashtra-nagpur-uptown',
        label: 'Uptown',
      },
      {
        value: 'india-maharashtra-nagpur-new-market',
        label: 'New Market',
      },
      {
        value: 'india-maharashtra-nagpur-east-bay',
        label: 'East Bay',
      },
      {
        value: 'india-maharashtra-nagpur-midtown',
        label: 'Midtown',
      },
    ],
    Pune: [
      {
        value: 'india-maharashtra-pune-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-maharashtra-pune-industrial-area',
        label: 'Industrial Area',
      },
      {
        value: 'india-maharashtra-pune-uptown',
        label: 'Uptown',
      },
    ],
    Mumbai: [
      {
        value: 'india-maharashtra-mumbai-city-center',
        label: 'City Center',
      },
      {
        value: 'india-maharashtra-mumbai-main-street',
        label: 'Main Street',
      },
    ],
    Kozhikode: [
      {
        value: 'india-kerala-kozhikode-new-market',
        label: 'New Market',
      },
      {
        value: 'india-kerala-kozhikode-main-street',
        label: 'Main Street',
      },
      {
        value: 'india-kerala-kozhikode-city-center',
        label: 'City Center',
      },
    ],
    Trivandrum: [
      {
        value: 'india-kerala-trivandrum-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-kerala-trivandrum-west-end',
        label: 'West End',
      },
      {
        value: 'india-kerala-trivandrum-downtown',
        label: 'Downtown',
      },
      {
        value: 'india-kerala-trivandrum-tech-park',
        label: 'Tech Park',
      },
      {
        value: 'india-kerala-trivandrum-city-center',
        label: 'City Center',
      },
    ],
    Cochin: [
      {
        value: 'india-kerala-cochin-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-kerala-cochin-industrial-area',
        label: 'Industrial Area',
      },
    ],
    Hubli: [
      {
        value: 'india-karnataka-hubli-new-market',
        label: 'New Market',
      },
      {
        value: 'india-karnataka-hubli-east-bay',
        label: 'East Bay',
      },
      {
        value: 'india-karnataka-hubli-midtown',
        label: 'Midtown',
      },
    ],
    Mysore: [
      {
        value: 'india-karnataka-mysore-downtown',
        label: 'Downtown',
      },
      {
        value: 'india-karnataka-mysore-main-street',
        label: 'Main Street',
      },
      {
        value: 'india-karnataka-mysore-tech-park',
        label: 'Tech Park',
      },
      {
        value: 'india-karnataka-mysore-city-center',
        label: 'City Center',
      },
      {
        value: 'india-karnataka-mysore-east-bay',
        label: 'East Bay',
      },
    ],
    Bangalore: [
      {
        value: 'india-karnataka-bangalore-city-center',
        label: 'City Center',
      },
      {
        value: 'india-karnataka-bangalore-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-karnataka-bangalore-main-street',
        label: 'Main Street',
      },
    ],
    Hyderabad: [
      {
        value: 'india-telangana-hyderabad-city-center',
        label: 'City Center',
      },
      {
        value: 'india-telangana-hyderabad-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-telangana-hyderabad-main-street',
        label: 'Main Street',
      },
    ],
    Visakhapatnam: [
      {
        value: 'india-andhra-pradesh-visakhapatnam-city-center',
        label: 'City Center',
      },
      {
        value: 'india-andhra-pradesh-visakhapatnam-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-andhra-pradesh-visakhapatnam-main-street',
        label: 'Main Street',
      },
    ],
    Bhubaneswar: [
      {
        value: 'india-odisha-bhubaneswar-city-center',
        label: 'City Center',
      },
      {
        value: 'india-odisha-bhubaneswar-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-odisha-bhubaneswar-main-street',
        label: 'Main Street',
      },
    ],
    Cuttack: [
      {
        value: 'india-odisha-cuttack-city-center',
        label: 'City Center',
      },
      {
        value: 'india-odisha-cuttack-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-odisha-cuttack-main-street',
        label: 'Main Street',
      },
    ],
    Ranchi: [
      {
        value: 'india-jharkhand-ranchi-city-center',
        label: 'City Center',
      },
      {
        value: 'india-jharkhand-ranchi-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-jharkhand-ranchi-main-street',
        label: 'Main Street',
      },
    ],
    Patna: [
      {
        value: 'india-bihar-patna-city-center',
        label: 'City Center',
      },
      {
        value: 'india-bihar-patna-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-bihar-patna-main-street',
        label: 'Main Street',
      },
    ],
    Raipur: [
      {
        value: 'india-chhattisgarh-raipur-city-center',
        label: 'City Center',
      },
      {
        value: 'india-chhattisgarh-raipur-midtown',
        label: 'Midtown',
      },
      {
        value: 'india-chhattisgarh-raipur-main-street',
        label: 'Main Street',
      },
    ],
  };
  return (
    <Box padding={'8px'}>
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
      <Box> Virtualized without ActionListSection </Box>
      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Hierarchy Level"
          placeholder="Select your location"
          name="action"
          maxRows="multiple"
        />
        <DropdownOverlay>
          <ActionList>
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
            {[...Array(1000)].map((_, index) => (
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
