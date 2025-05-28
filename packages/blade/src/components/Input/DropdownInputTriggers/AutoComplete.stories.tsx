/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import { SelectInput } from './SelectInput';
import { AutoComplete } from './AutoComplete';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Dropdown, DropdownFooter, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem, ActionListSection } from '~components/ActionList';
import { Box } from '~components/Box';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import { Button } from '~components/Button';
import { PlusIcon } from '~components/Icons';
import { Text } from '~components/Typography';

const propsCategory = {
  BASE_PROPS: 'Input Base Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
  LEADING_VISUAL_PROPS: 'Leading Visual Props',
  TRAILING_VISUAL_PROPS: 'Trailing Visual Props',
  KEYBOARD_PROPS: 'Keyboard Props',
};

export default {
  title: 'Components/Dropdown/With AutoComplete/Props Playground',
  component: AutoComplete,
  args: {
    defaultValue: undefined,
    placeholder: 'Select Option',
    name: 'item',
    isDisabled: false,
    value: undefined,
    autoFocus: false,
    onChange: ({ name, values }): void => {
      console.log(`input field ${name} content changed to ${values}`);
    },
    onInputValueChange: ({ name, value }): void => {
      console.log(`input field ${name} received focus. The value is ${value}`);
    },
    label: 'Select Item',
    labelPosition: 'top',
    necessityIndicator: undefined,
    isRequired: false,
    validationState: 'none',
    helpText: undefined,
    errorText: undefined,
    successText: undefined,
    icon: undefined,
    prefix: '',
    suffix: '',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onInputValueChange: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    maxRows: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    inputValue: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    filteredValues: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    placeholder: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    name: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    isDisabled: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    value: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    autoFocus: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onChange: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onFocus: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onBlur: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onClick: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    testID: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    label: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    accessibilityLabel: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    labelPosition: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    necessityIndicator: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    isRequired: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    validationState: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    helpText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    errorText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    successText: {
      table: {
        category: propsCategory.VALIDATION_PROPS,
      },
    },
    icon: {
      name: 'icon',
      type: 'select',
      options: Object.keys(iconMap),
      table: {
        category: propsCategory.LEADING_VISUAL_PROPS,
      },
    },
    prefix: {
      table: {
        category: propsCategory.LEADING_VISUAL_PROPS,
      },
    },
    suffix: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="The AutoComplete component is SelectInput-like component where you can type text and search through the list"
          componentName="AutoComplete"
          note="AutoComplete is meant to be used only inside the Dropdown component. Things will not work as expected if you are using this without Dropdown"
          figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76077-123374&t=GIOMai1UREfFBA0F-1&scaling=min-zoom&page-id=13590%3A171038&mode=design"
        >
          <Title>Usage</Title>
          <Sandbox showConsole>
            {`
              import { AutoComplete, Dropdown, DropdownOverlay, ActionList, ActionListItem } from '@razorpay/blade/components';

              function App() {
                return (
                  // Only works inside Dropdown component
                  <Dropdown>
                    <AutoComplete 
                      label="City" 
                      name="city"
                      placeholder="Select City" 
                      onChange={(e) => console.log(e)}
                      onInputValueChange={(e) => console.log(e)}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Mumbai" value="mumbai" />
                        <ActionListItem title="Bengaluru" value="bengaluru" />
                        <ActionListItem title="Pune" value="pune" />
                        <ActionListItem title="Mysuru" value="mysuru" />
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                )
              }

              export default App;
            `}
          </Sandbox>
        </StoryPageWrapper>
      ),
    },
  },
};

const AutoCompleteTemplate: StoryFn<typeof AutoComplete> = ({ icon, ...args }) => {
  return (
    <Box minHeight="150px" padding="spacing.5">
      <Dropdown>
        <AutoComplete {...args} icon={iconMap[(icon as unknown) as string]} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bengaluru" value="bengaluru" />
            <ActionListItem title="Ooty" value="ooty" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const Default = AutoCompleteTemplate.bind({});
Default.args = {
  label: 'City',
  placeholder: 'Select City',
};

export const Disabled = AutoCompleteTemplate.bind({});
Disabled.args = {
  label: 'City',
  placeholder: 'Select City',
  isDisabled: true,
};

export const InternalAutoCompleteUncontrolled = (): React.ReactElement => {
  return (
    <Box maxWidth="200px">
      <Dropdown selectionType="multiple">
        <AutoComplete maxRows="single" label="City" size="large" />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bengaluru" value="bengaluru" />
            <ActionListItem title="Ooty" value="ooty" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const InternalAutoCompleteControlledSelection = (): React.ReactElement => {
  const [currentSelection, setCurrentSelection] = React.useState<undefined | string>();

  return (
    <>
      <Button marginBottom="spacing.4" onClick={() => setCurrentSelection('bangalore')}>
        Select Bangalore
      </Button>
      <Button
        marginBottom="spacing.4"
        marginLeft="spacing.4"
        onClick={() => setCurrentSelection('')}
      >
        Clear Selection
      </Button>
      <Dropdown selectionType="single">
        <AutoComplete
          label="Select A City"
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

const cities = [
  {
    title: 'Mumbai',
    value: 'mumbai',
    keywords: ['maharashtra'],
  },
  {
    title: 'Pune',
    value: 'pune',
    keywords: ['maharashtra'],
  },
  {
    title: 'Bengaluru',
    value: 'bengaluru',
    keywords: ['karnataka', 'bangalore'],
  },
  {
    title: 'Ooty',
    value: 'ooty',
    keywords: ['tamil nadu'],
  },
];
export const InternalAutoCompleteControlled = (): React.ReactElement => {
  const cityValues = cities.map((city) => city.value);
  const [filteredValues, setFilteredValues] = React.useState<string[]>(cityValues);

  return (
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

            if (filteredItems.length > 0) {
              setFilteredValues(filteredItems);
            } else {
              setFilteredValues([]);
            }
          } else {
            setFilteredValues(cityValues);
          }
        }}
        filteredValues={filteredValues}
        helpText="Try typing 'maharashtra' in input"
      />
      {filteredValues.length > 0 ? (
        <DropdownOverlay>
          <ActionList>
            {cities.map((city) => (
              <ActionListItem key={city.value} title={city.title} value={city.value} />
            ))}
          </ActionList>
        </DropdownOverlay>
      ) : null}
    </Dropdown>
  );
};

export const InternalAutoCompleteUncontrolledSingleSelect = (): React.ReactElement => {
  return (
    <Dropdown>
      <AutoComplete label="Select City" />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Mumbai" value="mumbai" />
          <ActionListItem title="Pune" value="pune" />
          <ActionListItem title="Bangalore" value="bangalore" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export const InternalAutoCompleteWithBottomSheet = (): React.ReactElement => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput label="Sort Dishes" />
      <BottomSheet>
        <BottomSheetHeader title="Sort By">
          <AutoComplete label="Sort Dishes" maxRows="single" />
        </BottomSheetHeader>
        <BottomSheetBody>
          <ActionList>
            <ActionListItem title="Relevance (Default)" value="relavance" />
            <ActionListItem title="Delivery Time" value="delveiry-time" />
            <ActionListItem title="Rating" value="rating" />
            <ActionListItem title="Cost: Low to High" value="Cost: Low to High" />
            <ActionListItem title="Cost: High to Low" value="Cost: High to Low" />
          </ActionList>
        </BottomSheetBody>
      </BottomSheet>
    </Dropdown>
  );
};

export const InternalCreatableItem = (): React.ReactElement => {
  const [items, setItems] = React.useState(['Mumbai', 'Pune', 'Bangalore']);
  const [inputValue, setInputValue] = React.useState('');
  const autoCompleteRef = React.useRef<HTMLInputElement>(null);

  return (
    <Box maxWidth="500px">
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
              onClick={() => {
                autoCompleteRef.current?.focus();
                setInputValue('');
                setItems([...items, inputValue]);
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

export const InternalControlledInputValue = (): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState<string | undefined>('');

  return (
    <Box>
      <Text>{inputValue}</Text>
      <Dropdown>
        <AutoComplete
          inputValue={inputValue}
          onInputValueChange={({ value }) => {
            setInputValue(value);
          }}
          label="Select City"
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bangalore" value="bangalore" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const InternalWithSectionFiltering = (): React.ReactElement => {
  return (
    <Box>
      <Dropdown>
        <AutoComplete label="Select City" />
        <DropdownOverlay>
          <ActionList>
            <ActionListSection title="Maharashtra">
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Pune" value="pune" />
            </ActionListSection>
            <ActionListSection title="Karnataka">
              <ActionListItem title="Bangalore" value="bangalore" />
            </ActionListSection>
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

const errorStatesExampleCities = ['Mumbai', 'Pune', 'Bangalore', 'Mysore'];

export const InternalWithValidations = (): React.ReactElement => {
  const [isError, setIsError] = React.useState(false);
  const [currentInputValue, setCurrentInputValue] = React.useState('');
  const [isDismissed, setIsDismissed] = React.useState(false);

  return (
    <Dropdown
      selectionType="single"
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          console.log('dismiss');
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
            if (!errorStatesExampleCities.includes(currentInputValue)) {
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
          {errorStatesExampleCities.map((city) => (
            <ActionListItem key={city} title={city} value={city} />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
