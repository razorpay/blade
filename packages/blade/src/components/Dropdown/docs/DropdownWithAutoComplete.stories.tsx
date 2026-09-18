import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { Dropdown, DropdownFooter, DropdownOverlay } from '..';
import { AutoComplete, SelectInput } from '~components/Input/DropdownInputTriggers';
import {
  ActionList,
  ActionListItem,
  ActionListItemBadge,
  ActionListItemBadgeGroup,
  ActionListItemIcon,
  ActionListItemText,
} from '~components/ActionList';
import { HomeIcon, PlusIcon } from '~components/Icons';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Tag } from '~components/Tag';
import { Code, Heading, Text } from '~components/Typography';
import type { BladeElementRef } from '~utils/types';
import { useIsMobile } from '~utils/useIsMobile';

const DropdownStoryMeta: Meta = {
  title: 'Components/Dropdown/With AutoComplete',
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

const cities = [
  {
    title: 'Mumbai',
    value: 'mumbai',
    keywords: ['Maharashtra'],
  },
  {
    title: 'Pune',
    value: 'pune',
    keywords: ['Maharashtra'],
  },
  {
    title: 'Bengaluru',
    value: 'bengaluru',
    keywords: ['Karnataka'],
  },
  {
    title: 'Ooty',
    value: 'ooty',
    keywords: ['Tamil Nadu'],
  },
];

const DropdownTemplate: StoryFn<typeof Dropdown> = ({ selectionType = 'single' }) => {
  return (
    <Box minHeight="300px" padding="spacing.5">
      <Dropdown selectionType={selectionType}>
        <AutoComplete
          label="City"
          placeholder="Select your City"
          name="action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
          onInputValueChange={({ name, value }) => {
            console.log({ name, value });
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

export const ControlledFiltering = (): React.ReactElement => {
  const cityValues = cities.map((city) => city.value);
  const [filteredValues, setFilteredValues] = React.useState<string[]>(cityValues);

  return (
    <Box minHeight="300px" padding="spacing.5">
      <Text marginBottom="spacing.4">
        In certain cases, you might want to change the filtering logic from default startsWith
        filtering. In this example we update the filtering logic to show name of cities when name of
        state is typed
      </Text>
      <Dropdown selectionType="multiple">
        <AutoComplete
          label="City"
          onInputValueChange={({ value }) => {
            if (value) {
              const filteredItems = cities
                .filter(
                  (city) =>
                    city.title.toLowerCase().startsWith(value.toLowerCase()) ||
                    city.keywords.find((keyword) =>
                      keyword.toLowerCase().includes(value.toLowerCase()),
                    ),
                )
                .map((city) => city.value);

              // If we find valid filtered items, we apply filter by setting state
              if (filteredItems.length > 0) {
                setFilteredValues(filteredItems);
              } else {
                // if we don't find anything, we filter nothing
                setFilteredValues([]);
              }
            } else {
              // If inputValue is empty, we set all options as filtered items
              setFilteredValues(cityValues);
            }
          }}
          filteredValues={filteredValues}
          helpText="Try typing 'maharashtra' in input"
        />
        <DropdownOverlay>
          {filteredValues.length > 0 ? (
            <ActionList>
              {cities.map((city) => (
                <ActionListItem
                  key={city.value}
                  title={city.title}
                  value={city.value}
                  titleSuffix={
                    <ActionListItemBadgeGroup>
                      {city.keywords.map((keyword) => (
                        <ActionListItemBadge key={keyword}>in:{keyword}</ActionListItemBadge>
                      ))}
                    </ActionListItemBadgeGroup>
                  }
                />
              ))}
            </ActionList>
          ) : (
            <Box padding="spacing.4">
              <Text>Custom No Results Found Message!</Text>
            </Box>
          )}
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const ControlledFilteringWithBottomSheet = (): React.ReactElement => {
  const cityValues = cities.map((city) => city.value);
  const [filteredValues, setFilteredValues] = React.useState<string[]>(cityValues);

  return (
    <Box minHeight="300px" padding="spacing.5">
      <Text marginBottom="spacing.4">
        In certain cases, you might want to change the filtering logic from default startsWith
        filtering. In this example we update the filtering logic to show name of cities when name of
        state is typed
      </Text>
      <Dropdown selectionType="multiple">
        <SelectInput label="City" />
        <BottomSheet>
          <BottomSheetHeader>
            <AutoComplete
              label="City"
              onInputValueChange={({ value }) => {
                if (value) {
                  const filteredItems = cities
                    .filter(
                      (city) =>
                        city.title.toLowerCase().startsWith(value.toLowerCase()) ||
                        city.keywords.find((keyword) =>
                          keyword.toLowerCase().includes(value.toLowerCase()),
                        ),
                    )
                    .map((city) => city.value);

                  // If we find valid filtered items, we apply filter by setting state
                  if (filteredItems.length > 0) {
                    setFilteredValues(filteredItems);
                  } else {
                    // if we don't find anything, we filter nothing
                    setFilteredValues([]);
                  }
                } else {
                  // If inputValue is empty, we set all options as filtered items
                  setFilteredValues(cityValues);
                }
              }}
              filteredValues={filteredValues}
              helpText="Try typing 'maharashtra' in input"
            />
          </BottomSheetHeader>
          <BottomSheetBody>
            {filteredValues.length > 0 ? (
              <ActionList>
                {cities.map((city) => (
                  <ActionListItem key={city.value} title={city.title} value={city.value} />
                ))}
              </ActionList>
            ) : (
              <Box>
                <Text>Custom No Results Found Message!</Text>
              </Box>
            )}
          </BottomSheetBody>
        </BottomSheet>
      </Dropdown>
    </Box>
  );
};

export const TagsOutside = (): React.ReactElement => {
  const [selections, setSelections] = React.useState<string[]>([]);

  return (
    <Box padding="spacing.5">
      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Filters"
          labelPosition="inside-input"
          placeholder="Select your Filters"
          name="filters"
          value={selections}
          onChange={({ values }) => {
            setSelections(values);
          }}
        />
        <DropdownOverlay>
          {/*
            We are setting value same as title so we can just show value in Tag.
            If you want value to be different, you can create an object and map value to title while creating tags
          */}
          <ActionList>
            <ActionListItem title="Mumbai" value="Mumbai" />
            <ActionListItem title="Pune" value="Pune" />
            <ActionListItem title="Bangalore" value="Bangalore" />
            <ActionListItem title="Mysore" value="Mysore" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <Box marginTop="300px" display="flex" gap="spacing.3">
        {selections.map((filterValue) => (
          <Tag
            key={filterValue}
            onDismiss={() => {
              setSelections(selections.filter((selectionValue) => selectionValue !== filterValue));
            }}
          >
            {filterValue}
          </Tag>
        ))}
      </Box>
    </Box>
  );
};

const ResponsiveCityList = (): React.ReactElement => {
  return (
    <ActionList>
      <ActionListItem title="Mumbai" value="mumbai" />
      <ActionListItem title="Pune" value="pune" />
      <ActionListItem title="Bangalore" value="bangalore" />
      <ActionListItem title="Mysore" value="mysore" />
    </ActionList>
  );
};

export const ResponsiveBottomSheet = (): React.ReactElement => {
  const isMobile = useIsMobile();
  const triggerProps = {
    label: 'City',
    placeholder: 'Select your City',
    name: 'city',
  };

  return (
    <Box minHeight="300px" padding="spacing.5">
      <Text textAlign="center" marginBottom="spacing.8">
        Resize the window to mobile width to see the <Code size="medium">DropdownOverlay</Code> turn
        into a <Code size="medium">BottomSheet</Code>
      </Text>
      <Dropdown selectionType="multiple">
        {isMobile ? <SelectInput {...triggerProps} /> : <AutoComplete {...triggerProps} />}
        {isMobile ? (
          <BottomSheet>
            <BottomSheetHeader>
              <AutoComplete {...triggerProps} />
            </BottomSheetHeader>
            <BottomSheetBody>
              <ResponsiveCityList />
            </BottomSheetBody>
          </BottomSheet>
        ) : (
          <DropdownOverlay>
            <ResponsiveCityList />
          </DropdownOverlay>
        )}
      </Dropdown>
    </Box>
  );
};

export const CreatableItems = (): React.ReactElement => {
  const [items, setItems] = React.useState(['Mumbai', 'Pune', 'Bangalore']);
  const [inputValue, setInputValue] = React.useState('');
  const autoCompleteRef = React.useRef<BladeElementRef>(null);

  return (
    <Box maxWidth="500px" minHeight="300px" padding="spacing.5">
      <Dropdown>
        <AutoComplete
          ref={autoCompleteRef}
          label="Select City"
          inputValue={inputValue}
          onInputValueChange={({ value }) => {
            setInputValue(value ?? '');
          }}
        />
        <DropdownOverlay>
          <ActionList>
            {items.map((item, index) => (
              <ActionListItem key={item + String(index)} title={item} value={item.toLowerCase()} />
            ))}
          </ActionList>
          <DropdownFooter>
            <Button
              icon={PlusIcon}
              isFullWidth
              variant="secondary"
              iconPosition="right"
              isDisabled={!inputValue.trim() || items.includes(inputValue)}
              onClick={() => {
                if (inputValue.trim() && !items.includes(inputValue)) {
                  autoCompleteRef.current?.focus();
                  setInputValue('');
                  setItems([...items, inputValue]);
                }
              }}
            >
              Create {inputValue}
            </Button>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const ClearInputOnDismiss = (): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Box maxWidth="500px" minHeight="300px" padding="spacing.5">
      <Dropdown
        selectionType="multiple"
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setInputValue('');
          }
        }}
      >
        <AutoComplete
          label="Select City"
          inputValue={inputValue}
          onInputValueChange={({ value }) => {
            setInputValue(value ?? '');
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bengaluru" value="bengaluru" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const MaxRowsStates = (): React.ReactElement => {
  return (
    <Box
      maxWidth="300px"
      padding="spacing.5"
      paddingBottom="400px"
      display="flex"
      flexDirection="column"
      gap="300px"
    >
      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Select City"
          maxRows="single"
          helpText="Try selecting more than 4 items"
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bengaluru" value="bengaluru" />
            <ActionListItem title="Mysuru" value="mysuru" />
            <ActionListItem title="Ooty" value="ooty" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>

      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Select City"
          maxRows="multiple"
          helpText="Try selecting multiple items to see the input grow"
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bengaluru" value="bengaluru" />
            <ActionListItem title="Mysuru" value="mysuru" />
            <ActionListItem title="Ooty" value="ooty" />
            <ActionListItem title="Coorg" value="coorg" />
            <ActionListItem title="Kolhapur" value="kolhapur" />
            <ActionListItem title="Munnar" value="munnar" />
            <ActionListItem title="New York" value="new-york" />
            <ActionListItem title="Lagos" value="lagos" />
            <ActionListItem title="Indore" value="indore" />
            <ActionListItem title="New Delhi" value="new-delhi" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>

      <Dropdown selectionType="multiple">
        <AutoComplete
          label="Select City"
          maxRows="expandable"
          helpText="Try selecting multiple items to see the input grow in active state"
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bengaluru" value="bengaluru" />
            <ActionListItem title="Mysuru" value="mysuru" />
            <ActionListItem title="Ooty" value="ooty" />
            <ActionListItem title="Coorg" value="coorg" />
            <ActionListItem title="Kolhapur" value="kolhapur" />
            <ActionListItem title="Munnar" value="munnar" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

const errorStateCities = ['Mumbai', 'Pune', 'Bangalore', 'Mysore'];

export const WithErrorState = (): React.ReactElement => {
  const [isError, setIsError] = React.useState(false);
  const [currentInputValue, setCurrentInputValue] = React.useState('');
  const [isDismissed, setIsDismissed] = React.useState(false);

  return (
    <Box minHeight="300px" padding="spacing.5">
      <Dropdown
        selectionType="single"
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsDismissed(true);
          }
        }}
      >
        <AutoComplete
          label="City"
          placeholder="Select your City"
          name="city"
          inputValue={currentInputValue}
          onInputValueChange={({ value }) => {
            if (isError) {
              setIsError(false);
            }
            setCurrentInputValue(value ?? '');
          }}
          onBlur={() => {
            if (isDismissed) {
              // We validate on blur after dismiss of Dropdown
              if (!errorStateCities.includes(currentInputValue)) {
                setIsError(true);
              }
              setIsDismissed(false);
            }
          }}
          errorText="Invalid selection. You can only select items from the list"
          validationState={isError ? 'error' : 'none'}
          helpText="Type something not in the list and click outside"
        />
        <DropdownOverlay>
          <ActionList>
            {errorStateCities.map((city) => (
              <ActionListItem key={city} title={city} value={city} />
            ))}
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
        <AutoComplete
          label="City"
          placeholder="Select your City"
          name="action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
          onInputValueChange={({ name, value }) => {
            console.log({ name, value });
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
      <Heading size="medium" marginTop="spacing.5" marginBottom="spacing.3">
        Large:
      </Heading>
      <Dropdown selectionType="multiple">
        <AutoComplete
          label="City"
          placeholder="Select your City"
          name="action"
          size="large"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
          onInputValueChange={({ name, value }) => {
            console.log({ name, value });
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
      <SelectInput label="Select fruits" />
      <DropdownOverlay>
        <ActionList>
          {fruits.map((fruit) => {
            if (typeof fruit === 'string') {
              return <ActionListItem key={fruit} title={fruit} value={fruit} />;
            }

            return (
              <ActionListItem
                trailing={<ActionListItemText>⌘ + S</ActionListItemText>}
                leading={<ActionListItemIcon icon={HomeIcon} />}
                description={fruit.description}
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

InternalDropdownPerformance.parameters = {
  chromatic: {
    disableSnapshot: false,
  },
};

export default DropdownStoryMeta;
