/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import { SelectInput } from './SelectInput';
import iconMap from '~components/Icons/iconMap';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem, ActionListItemBadge } from '~components/ActionList';
import { Box } from '~components/Box';
import { Badge } from '~components/Badge';
import { Text } from '~components/Typography';
import { Link } from '~components/Link';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';
import { BankIcon, InfoIcon } from '~components/Icons';

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
        <SelectInput
          {...args}
          onChange={({ name, values }) => {
            console.log(name, values);
          }}
          icon={iconMap[(icon as unknown) as string]}
          valueSuffix={({ values }) => {
            if (values[0] === 'item-1') {
              return <Badge color="positive">20% Off</Badge>;
            }
            return null;
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              title="Item 1"
              value="item-1"
              titleSuffix={<ActionListItemBadge color="positive">20% Off</ActionListItemBadge>}
            />
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

export const SelectInputShowcase: StoryFn<typeof SelectInput> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Basic Variants */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Basic Variants
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Dropdown>
            <SelectInput label="Default" placeholder="Select option" name="default" />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>

          <Dropdown>
            <SelectInput label="With Value" defaultValue="option-2" name="withValue" />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>

          <Dropdown>
            <SelectInput
              label="With Help Text"
              placeholder="Select option"
              helpText="This is a helpful message"
              name="withHelpText"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>

          <Dropdown>
            <SelectInput label="Disabled" placeholder="Select option" isDisabled name="disabled" />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* Validation States */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Validation States
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Dropdown>
            <SelectInput
              label="Error State"
              defaultValue="invalid-option"
              validationState="error"
              errorText="This field has an error"
              name="error"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>

          <Dropdown>
            <SelectInput
              label="Success State"
              defaultValue="option-2"
              validationState="success"
              successText="This field is valid"
              name="success"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* Sizes */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Sizes
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Dropdown>
            <SelectInput
              label="Medium Size"
              placeholder="Medium size select"
              size="medium"
              name="sizeMedium"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>

          <Dropdown>
            <SelectInput
              label="Large Size"
              placeholder="Large size select"
              size="large"
              name="sizeLarge"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* Label Positions */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Label Positions
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Dropdown>
            <SelectInput
              label="Label Top"
              placeholder="Label on top"
              labelPosition="top"
              name="labelTop"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>

          <Dropdown>
            <SelectInput
              label="Label Left"
              placeholder="Label on left"
              labelPosition="left"
              name="labelLeft"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* Necessity Indicators */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Necessity Indicators
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Dropdown>
            <SelectInput
              label="Required Field"
              placeholder="Select option"
              necessityIndicator="required"
              name="required"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>

          <Dropdown>
            <SelectInput
              label="Optional Field"
              placeholder="Select option"
              necessityIndicator="optional"
              name="optional"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* With Icons */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Icons
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Dropdown>
            <SelectInput
              label="Leading Icon"
              placeholder="Select option"
              icon={BankIcon}
              name="leadingIcon"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Option 1" value="option-1" />
                <ActionListItem title="Option 2" value="option-2" />
                <ActionListItem title="Option 3" value="option-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* With Prefix/Suffix */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Prefix/Suffix
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Dropdown>
            <SelectInput
              label="With Prefix"
              placeholder="Select currency"
              prefix="₹"
              name="withPrefix"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="INR" value="inr" />
                <ActionListItem title="USD" value="usd" />
                <ActionListItem title="EUR" value="eur" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>

          <Dropdown>
            <SelectInput
              label="With Suffix"
              placeholder="Select weight"
              suffix="kg"
              name="withSuffix"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="10" value="10" />
                <ActionListItem title="20" value="20" />
                <ActionListItem title="30" value="30" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* With Value Suffix */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Value Suffix
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Dropdown>
            <SelectInput
              label="Product with Discount"
              placeholder="Select product"
              defaultValue="product-1"
              valueSuffix={({ values }) => {
                if (values[0] === 'product-1') {
                  return <Badge color="positive">20% Off</Badge>;
                }
                return null;
              }}
              name="valueSuffix"
            />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem
                  title="Product 1"
                  value="product-1"
                  titleSuffix={<ActionListItemBadge color="positive">20% Off</ActionListItemBadge>}
                />
                <ActionListItem title="Product 2" value="product-2" />
                <ActionListItem title="Product 3" value="product-3" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </Box>
      </Box>

      {/* With Label Suffix & Trailing */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="surface.text.gray.subtle"
        >
          With Label Suffix & Trailing
        </Text>
        <Dropdown>
          <SelectInput
            label="Country"
            placeholder="Select country"
            labelSuffix={
              <Tooltip content="Select your country for tax purposes" placement="right">
                <TooltipInteractiveWrapper display="flex">
                  <InfoIcon size="small" color="surface.icon.gray.muted" />
                </TooltipInteractiveWrapper>
              </Tooltip>
            }
            labelTrailing={<Link size="small">Learn more</Link>}
            name="labelSuffixTrailing"
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="India" value="india" />
              <ActionListItem title="USA" value="usa" />
              <ActionListItem title="UK" value="uk" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    </Box>
  );
};

SelectInputShowcase.storyName = 'Showcase - All Variants';
SelectInputShowcase.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive showcase of all SelectInput variants including basic states, validation states, sizes, label positions, icons, prefix/suffix, value suffix, and more.',
    },
  },
};
