/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { ComponentStory } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import { SelectInput } from './SelectInput';
import { AutoComplete } from './AutoComplete';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

const propsCategory = {
  BASE_PROPS: 'Select Input Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
  LEADING_VISUAL_PROPS: 'Leading Visual Props',
  TRAILING_VISUAL_PROPS: 'Trailing Visual Props',
  KEYBOARD_PROPS: 'Keyboard Props',
};

export default {
  title: 'Components/Dropdown/SelectInput',
  component: SelectInput,
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
    onFocus: ({ name, value }): void => {
      console.log(`input field ${name} received focus. The value is ${value}`);
    },
    onBlur: ({ name, value }): void => {
      console.log(`input field ${name} content lost focus. The value is ${value}`);
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
  argTypes: {
    defaultValue: {
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
          componentDescription="The SelectInput component is a component that can be used inside Dropdown component to create a Select Menu"
          componentName="SelectInput"
          note="SelectInput is meant to be used only inside the Dropdown component. Things will not work as expected if you are using this without Dropdown"
          figmaURL={{
            paymentTheme:
              'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13590-171090',
            bankingTheme:
              'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=13344-389834',
          }}
        >
          <Title>Usage</Title>
          <Sandbox showConsole>
            {`
              import { SelectInput, Dropdown, DropdownOverlay, ActionList, ActionListItem } from '@razorpay/blade/components';

              function App(): React.ReactElement {
                return (
                  // Only works inside Dropdown component
                  <Dropdown>
                    <SelectInput 
                      label="City" 
                      name="city"
                      placeholder="Select City" 
                      onChange={(e) => console.log(e)}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Mumbai" value="mumbai" />
                        <ActionListItem title="Bangalore" value="bangalore" />
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

const SelectInputTemplate: ComponentStory<typeof SelectInput> = ({ icon, ...args }) => {
  return (
    <Box minHeight="150px">
      <Dropdown>
        <SelectInput {...args} icon={iconMap[(icon as unknown) as string]} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Item 1" value="item-1" />
            <ActionListItem title="Item 2" value="item-2" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const Default = SelectInputTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'SelectInput';

export const SelectInputWithoutLabel = SelectInputTemplate.bind({});
SelectInputWithoutLabel.args = {
  label: undefined,
  accessibilityLabel: 'City',
};
SelectInputWithoutLabel.storyName = 'SelectInput without Label';

export const AutoCompleteUncontrolled = (): React.ReactElement => {
  return (
    <Dropdown selectionType="multiple">
      <AutoComplete label="City" />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Mumbai" value="mumbai" />
          <ActionListItem title="Pune" value="pune" />
          <ActionListItem title="Bengaluru" value="bengaluru" />
          <ActionListItem title="Ooty" value="ooty" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
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
export const AutoCompleteControlled = (): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const cityValues = cities.map((city) => city.value);
  const [filteredValues, setFilteredValues] = React.useState<string[]>(cityValues);

  return (
    <Dropdown selectionType="multiple">
      <AutoComplete
        label="City"
        inputValue={inputValue}
        onInputValueChange={({ value }) => {
          setInputValue(value ?? '');
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

      <DropdownOverlay>
        {filteredValues.length > 0 ? (
          <ActionList>
            {cities.map((city) => (
              <ActionListItem key={city.value} title={city.title} value={city.value} />
            ))}
          </ActionList>
        ) : (
          <Box textAlign="center" padding="spacing.6">
            <Text weight="bold">No City Found {':('} </Text>
          </Box>
        )}
      </DropdownOverlay>
    </Dropdown>
  );
};
