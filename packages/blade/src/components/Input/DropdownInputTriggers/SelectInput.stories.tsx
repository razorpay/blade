/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import { SelectInput } from './SelectInput';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Box } from '~components/Box';

const propsCategory = {
  BASE_PROPS: 'Select Input Props',
  LABEL_PROPS: 'Label Props',
  VALIDATION_PROPS: 'Validation Props',
  LEADING_VISUAL_PROPS: 'Leading Visual Props',
  TRAILING_VISUAL_PROPS: 'Trailing Visual Props',
  KEYBOARD_PROPS: 'Keyboard Props',
};

export default {
  title: 'Components/Dropdown/With Select/Props Playground',
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
  tags: ['autodocs'],
  argTypes: {
    size: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
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
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Dropdown/_decisions/decisions.md"
          note="SelectInput is meant to be used only inside the Dropdown component. Things will not work as expected if you are using this without Dropdown"
          figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76077-123374&t=GIOMai1UREfFBA0F-1&scaling=min-zoom&page-id=13590%3A171038&mode=design"
        >
          <Title>Usage</Title>
          <Sandbox showConsole>
            {`
              import { SelectInput, Dropdown, DropdownOverlay, ActionList, ActionListItem } from '@razorpay/blade/components';

              function App() {
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

const SelectInputTemplate: StoryFn<typeof SelectInput> = ({ icon, ...args }) => {
  return (
    <Box minHeight="150px" padding="spacing.5">
      <Dropdown>
        <SelectInput {...args} icon={iconMap[(icon as unknown) as string]} />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Item 1" value="item-1" />
            <ActionListItem title="Item 2" value="item-2" />
            <ActionListItem title="Item 3" value="item-3" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const Default = SelectInputTemplate.bind({});
export const Disabled = SelectInputTemplate.bind({});
Disabled.args = {
  isDisabled: true,
  defaultValue: ['item-1', 'item-2'],
};
