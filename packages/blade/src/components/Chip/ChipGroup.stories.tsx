import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Heading, Text, Title } from '../Typography';
import type { ChipGroupProps } from './ChipGroup';
import { ChipGroup as ChipGroupComponent } from './ChipGroup';
import { Chip as ChipComponent } from './Chip';
import { PaymentLinksIcon, OffersIcon, SmartphoneIcon } from '~components/Icons';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. Chips can have either single selection or multiple (based on context)."
      componentName="ChipGroup"
      imports={`import { Chip, ChipGroup } from '@razorpay/blade/components';\nimport type { ChipProps, ChipGroupProps } from '@razorpay/blade/components';`}
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=52377%3A23885&mode=design&t=y7gUIBIzzNMRd3w6-1',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=18358%3A3135&mode=design&t=FzNrQV6ZZaLoxzcj-1',
      }}
    >
      <Title>Usage</Title>
      <Sandbox showConsole editorHeight={400} editorWidthPercentage={60}>
        {`
          import { Box, Chip, ChipGroup, Text } from '@razorpay/blade/components';

          function App(): React.ReactElement {
            return (
              <Box>
                <Text> Select Business type: </Text>
                <ChipGroup defaultValue="proprietorship" onChange={({name, value}) => console.log({name, value})}>
                  <Chip value="proprietorship">Proprietorship</Chip>
                  <Chip value="public">Public</Chip>
                  <Chip value="small-business">Small Business</Chip>
                </ChipGroup>
              </Box>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const propsCategory = { CHIP: 'Chip Props', CHIP_GROUP: 'ChipGroup Props' };

export default {
  title: 'Components/Chip/ChipGroup',
  args: {
    isDisabled: false,
    name: undefined,
    accessibilityLabel: 'Choose one business type from the options below',
    icon: undefined,
  },
  argTypes: {
    // ChipGroup props
    accessibilityLabel: {
      description: 'Accessibility label for the `ChipGroup`.',
      control: {
        type: 'text',
      },
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: 'string',
        },
      },
    },
    isDisabled: {
      description:
        'Disables or enables `ChipGroup`, it will propagate down to all the children `Chip` components.',
      control: {
        type: 'boolean',
      },
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: 'boolean',
        },
      },
    },
    name: {
      description:
        'Specifies the name attribute for the `ChipGroup` component. When provided, this attribute ensures that the Chip elements within the group are semantically associated, allowing them to be grouped logically for form submission.',
      control: { type: 'text' },
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: 'string',
        },
      },
    },
    onChange: {
      description: 'The callback invoked on any state change within the `ChipGroup`.',
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: '({ name, values }: { name: string; values: string[] }) => void',
        },
      },
    },
    selectionType: {
      description: `Defines the selection behavior within the ChipGroup component. When set to 'single', only one Chip can be selected at a time, akin to a radio button group. When set to 'multiple', multiple Chips can be concurrently selected, simulating checkbox-like behavior within the group.`,
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: '"single" | "multiple"',
        },
      },
    },
    value: {
      description:
        'Value of the Chip group Acts as a controlled component by specifying the ChipGroup value Use onChange to update its value.',
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: 'string',
        },
      },
    },
    defaultValue: {
      description: 'Sets the initial value of the Chip group',
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: 'string | string[]',
        },
      },
    },
    size: {
      description: 'Specifies the size of the rendered Chips withing the ChipGroup',
      options: ['xsmall', 'small', 'medium', 'large'],
      control: {
        type: 'radio',
      },
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: '"xsmall" | "small" | "medium" | "large"',
        },
      },
    },
    intent: {
      description: `Sets the ChipGroups's visual intent, it will propagate down to all the Chips`,
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: '"none" | "positive" | "negative"',
        },
      },
      options: ['none', 'positive', 'negative'],
      control: {
        type: 'select',
      },
    },

    // Chip Props
    icon: {
      name: 'icon',
      description: 'Displays the Blade Icon component within the Chip',
      type: 'select',
      options: Object.keys(iconMap),
      mapping: iconMap,
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'IconComponent',
        },
      },
    },

    // Styled Props
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ChipGroupProps>;

const ChipTemplate: ComponentStory<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent {...args}>
        {chipValues.map((chipValue: string, index) => (
          <ChipComponent key={index} value={chipValue} icon={args.icon}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const SingleSelection = ChipTemplate.bind({});
SingleSelection.storyName = 'Single Selection';
SingleSelection.args = {
  selectionType: 'single',
};
SingleSelection.argTypes = {
  value: {
    options: ['Proprietorship', 'Public', 'Small Business'],
    control: {
      type: 'select',
    },
  },
  defaultValue: {
    options: ['Proprietorship', 'Public', 'Small Business'],
    control: {
      type: 'select',
    },
  },
};

const MultiSelectChipTemplate: ComponentStory<typeof ChipGroupComponent> = ({
  children,
  ...args
}) => {
  const chipValues = [
    'Automated Payment Links',
    'Wallet on My App',
    'Offer discounts, Pay Later & EMI options',
  ];

  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        What other capabilities are you looking for?
      </Text>

      <ChipGroupComponent selectionType="multiple" {...args}>
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} icon={args.icon}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const MultiSelection = MultiSelectChipTemplate.bind({});
MultiSelection.storyName = 'Multi Selection';
MultiSelection.args = {
  accessibilityLabel: 'Select other capabilities you are looking for from the options below',
  selectionType: 'multiple',
};
MultiSelection.argTypes = {
  defaultValue: {
    options: [
      'Automated Payment Links',
      'Wallet on My App',
      'Offer discounts, Pay Later & EMI options',
    ],
    control: {
      type: 'multi-select',
    },
  },
};

export const DefaultSelectedSingle = ChipTemplate.bind({});
DefaultSelectedSingle.storyName = 'Uncontrolled Single Selection with Default Value';
DefaultSelectedSingle.args = {
  defaultValue: 'Proprietorship',
  selectionType: 'single',
};
DefaultSelectedSingle.argTypes = {
  defaultValue: {
    options: ['Proprietorship', 'Public', 'Small Business'],
    control: {
      type: 'select',
    },
  },
};

export const DefaultMultiSelected = MultiSelectChipTemplate.bind({});
DefaultMultiSelected.storyName = 'Uncontrolled Multiple Selection with Default Value';
DefaultMultiSelected.args = {
  defaultValue: ['Automated Payment Links'],
  accessibilityLabel: 'Select other capabilities you are looking for from the options below',
  selectionType: 'multiple',
};
DefaultMultiSelected.argTypes = {
  defaultValue: {
    options: [
      'Automated Payment Links',
      'Wallet on My App',
      'Offer discounts, Pay Later & EMI options',
    ],
    control: {
      type: 'multi-select',
    },
  },
};

const ControlledSingleSelectionTemplate: ComponentStory<typeof ChipGroupComponent> = ({
  ...args
}) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  const [value, setValue] = React.useState('Proprietorship');
  return (
    <Box display="flex" gap="spacing.5" flexDirection="column" minHeight="200px">
      <Dropdown marginRight="spacing.4">
        <DropdownButton size="small">Business Type</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            {chipValues.map((chipValue: string) => (
              <ActionListItem
                key={chipValue}
                title={chipValue}
                value={chipValue}
                onClick={({ name }) => setValue(name)}
                isSelected={value === chipValue}
              />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>

      <ChipGroupComponent
        {...args}
        selectionType="single"
        value={value}
        onChange={({ values }) => setValue(values[0])}
      >
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const ControlledSingleSelection = ControlledSingleSelectionTemplate.bind({});
ControlledSingleSelection.storyName = 'Controlled Single Selection';
ControlledSingleSelection.args = {
  accessibilityLabel: 'Choose one business type from the options below',
  selectionType: 'single',
};

const ControlledMultiSelectionTemplate: ComponentStory<typeof ChipGroupComponent> = (args) => {
  const chipValues = [
    'Automated Payment Links',
    'Wallet on My App',
    'Offer discounts, Pay Later & EMI options',
  ];
  const [values, setValues] = React.useState(['Automated Payment Links']);
  return (
    <Box display="flex" gap="spacing.5" flexDirection="column" minHeight="200px">
      <Dropdown marginRight="spacing.4">
        <DropdownButton size="small">What other capabilities are you looking for?</DropdownButton>
        <DropdownOverlay>
          <ActionList>
            {chipValues.map((chipValue: string) => (
              <ActionListItem
                key={chipValue}
                title={chipValue}
                value={chipValue}
                onClick={({ name, value }) =>
                  value
                    ? setValues(values.filter((v) => v !== name))
                    : setValues(values.concat([name]))
                }
                isSelected={values.includes(chipValue)}
              />
            ))}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <ChipGroupComponent
        {...args}
        selectionType="multiple"
        onChange={({ values }) => setValues(values)}
        value={values}
      >
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} icon={args.icon}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const ControlledMultiSelection = ControlledMultiSelectionTemplate.bind({});
ControlledMultiSelection.storyName = 'Controlled Multiple Selection';
ControlledMultiSelection.args = {
  accessibilityLabel: 'Select other capabilities you are looking for from the options below',
  selectionType: 'multiple',
};

export const Disabled = ChipTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  isDisabled: true,
  selectionType: 'single',
};

const AllChipSizesTemplate: ComponentStory<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const sizes = ['xsmall', 'small', 'medium', 'large'];
  return (
    <Box>
      {sizes.map((size, index) => (
        <Box key={index}>
          <Heading size="medium" marginBottom="spacing.3">
            {size}
          </Heading>
          <Box marginBottom="spacing.3">
            <Text marginBottom="spacing.3" marginTop="spacing.3" size="medium">
              What other capabilities are you looking for?
            </Text>

            <ChipGroupComponent
              defaultValue="payment-links"
              size={size as ChipGroupProps['size']}
              {...args}
            >
              <ChipComponent value="payment-links" icon={PaymentLinksIcon}>
                Automated Payment Links
              </ChipComponent>
              <ChipComponent value="wallet" icon={SmartphoneIcon}>
                Wallet on My App
              </ChipComponent>
              <ChipComponent value="offers" icon={OffersIcon}>
                Offer discounts, Pay Later & EMI options
              </ChipComponent>
            </ChipGroupComponent>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export const AllChipSizes = AllChipSizesTemplate.bind({});
AllChipSizes.storyName = 'All Sizes';
AllChipSizes.args = {
  accessibilityLabel: 'Select other capabilities you are looking for from the options below',
  selectionType: 'single',
};
AllChipSizes.parameters = {
  controls: {
    exclude: ['icon'],
  },
};
