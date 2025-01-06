import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { ChipGroupProps } from './ChipGroup';
import { ChipGroup as ChipGroupComponent } from './ChipGroup';
import { Chip as ChipComponent } from './Chip';
import { Heading, Text, Code } from '~components/Typography';
import {
  PaymentLinksIcon,
  TagIcon,
  SmartphoneIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from '~components/Icons';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';
// import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
// import { ActionList, ActionListItem } from '~components/ActionList';
import type { BladeElementRef } from '~utils/types';
import { Button } from '~components/Button';
import { Link } from '~components/Link';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. Chips can have either single selection or multiple (based on context)."
      componentName="ChipGroup"
      imports={`import { Chip, ChipGroup } from '@razorpay/blade/components';\nimport type { ChipProps, ChipGroupProps } from '@razorpay/blade/components';`}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75272-53870&t=TGcKiXJiozSRKwOG-1&scaling=min-zoom&page-id=52377%3A23885&mode=design"
      note={
        <Text>
          Chip is a combination of ChipGroup and Chip components. This story demonstrates only the
          props of ChipGroup component. For Chips component props refer to the Chip story{' '}
          <Link target="_blank" href="https://blade.razorpay.com/?path=/docs/components-chip-chip">
            here
          </Link>
        </Text>
      }
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole editorHeight={400}>
        {`
          import { Box, Chip, ChipGroup, Text } from '@razorpay/blade/components';

          function App() {
            return (
              <Box>
                <ChipGroup
                  label="Select Business type:"
                  accessibilityLabel="Choose one business type from the options below"
                  defaultValue="proprietorship"
                  onChange={({name, values}) => console.log({name, values})}
                >
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
  tags: ['autodocs'],
  argTypes: {
    // ChipGroup props
    label: {
      description: 'Label for the `ChipGroup`.',
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
    labelPosition: {
      description: 'Sets the position of the label',
      options: ['top', 'left'],
      control: {
        type: 'select',
      },
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: '"top" | "left"',
        },
      },
    },
    helpText: {
      description: 'Help text for the `ChipGroup`.',
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
    errorText: {
      description: 'Error text for the `ChipGroup`.',
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
    validationState: {
      description: 'Sets the validation state of the ChipGroup.',
      options: ['error', 'none'],
      control: {
        type: 'select',
      },
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: '"error" | "none"',
        },
      },
    },
    necessityIndicator: {
      description: 'Renders a necessity indicator after ChipGroup label.',
      options: ['required', 'optional', 'none'],
      control: {
        type: 'select',
      },
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: '"required" | "optional" | "none"',
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
    isRequired: {
      description: 'Sets the required state of the ChipGroup component.',
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
      options: ['single', 'multiple'],
      control: {
        type: 'select',
      },
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
    color: {
      description: `Sets the ChipGroups's visual color, it will propagate down to all the Chips`,
      table: {
        category: propsCategory.CHIP_GROUP,
        type: {
          summary: '"primary" | "positive" | "negative"',
        },
      },
      options: ['primary', 'positive', 'negative'],
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

const ChipTemplate: StoryFn<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  return (
    <Box>
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
  label: 'Select Business type:',
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

const MultiSelectChipTemplate: StoryFn<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const chipValues = [
    'Automated Payment Links',
    'Wallet on My App',
    'Offer discounts, Pay Later & EMI options',
  ];

  return (
    <Box>
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
  label: 'What other capabilities are you looking for?',
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
  label: 'Select Business type:',
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
  label: 'What other capabilities are you looking for?',
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

const ControlledSingleSelectionTemplate: StoryFn<typeof ChipGroupComponent> = ({ ...args }) => {
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

const ControlledMultiSelectionTemplate: StoryFn<typeof ChipGroupComponent> = (args) => {
  const chipValues = [
    'Automated Payment Links',
    'Wallet on My App',
    'Offer discounts, Pay Later & EMI options',
  ];
  const [values, setValues] = React.useState(['Automated Payment Links']);
  return (
    <Box display="flex" gap="spacing.5" flexDirection="column" minHeight="200px">
      <Dropdown marginRight="spacing.4" selectionType="multiple">
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
  label: 'Select Business type:',
};

const ChipWithIconTemplate: StoryFn<typeof ChipGroupComponent> = ({ children, ...args }) => {
  return (
    <Box>
      <ChipGroupComponent defaultValue="payment-links" {...args}>
        <ChipComponent value="payment-links" icon={PaymentLinksIcon}>
          Automated Payment Links
        </ChipComponent>
        <ChipComponent value="wallet" icon={SmartphoneIcon}>
          Wallet on My App
        </ChipComponent>
        <ChipComponent value="offers" icon={TagIcon}>
          Offer discounts, Pay Later & EMI options
        </ChipComponent>
      </ChipGroupComponent>
    </Box>
  );
};

export const ChipWithIcon = ChipWithIconTemplate.bind({});
ChipWithIcon.storyName = 'With Icon';
ChipWithIcon.args = {
  selectionType: 'single',
  label: 'What other capabilities are you looking for?',
  accessibilityLabel: 'Choose one business type from the options below',
};
ChipWithIcon.parameters = {
  controls: {
    exclude: ['icon'],
  },
};

const ChipColorsTemplate: StoryFn<typeof ChipGroupComponent> = (args) => {
  return (
    <Box display="flex" flexDirection="column">
      <Text size="large" weight="semibold" marginBottom="spacing.3">
        Is the result helpful?
      </Text>

      <ChipGroupComponent defaultValue="yes" {...args}>
        <ChipComponent color="positive" value="yes" icon={ThumbsUpIcon}>
          Yes
        </ChipComponent>
        <ChipComponent color="negative" value="no" icon={ThumbsDownIcon}>
          No
        </ChipComponent>
      </ChipGroupComponent>
    </Box>
  );
};

export const ChipWithColor = ChipColorsTemplate.bind({});
ChipWithColor.storyName = 'With Color';
ChipWithColor.args = {
  selectionType: 'single',
  accessibilityLabel: 'Is the result helpful? Please select either yer or no',
};
ChipWithColor.parameters = {
  controls: {
    exclude: ['icon'],
  },
};

const TextTransformationTemplate: StoryFn<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  return (
    <Box>
      <ChipGroupComponent defaultValue="Proprietorship" label="Select Business Type:" {...args}>
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} icon={args.icon}>
            {chipValue.toUpperCase()}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
      <Text marginTop="spacing.3">
        The text within the Chip can be transformed to uppercase by passing{' '}
        <Code size="medium"> value.toUpperCase() </Code> as the children.
      </Text>
    </Box>
  );
};

export const TextTransformationUppercase = TextTransformationTemplate.bind({});
TextTransformationUppercase.storyName = 'Text Transformation (Uppercase)';
TextTransformationTemplate.args = {
  selectionType: 'single',
  accessibilityLabel: 'Choose one business type from the options below',
};

const AllChipSizesTemplate: StoryFn<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const sizes = ['xsmall', 'small', 'medium', 'large'];
  return (
    <Box>
      {sizes.map((size, index) => (
        <Box key={index}>
          <Heading marginBottom="spacing.3" size="small">
            {size}
          </Heading>
          <Box marginBottom="spacing.4">
            <ChipGroupComponent
              defaultValue="payment-links"
              label="What other capabilities are you looking for?"
              size={size as ChipGroupProps['size']}
              {...args}
            >
              <ChipComponent value="payment-links" icon={PaymentLinksIcon}>
                Automated Payment Links
              </ChipComponent>
              <ChipComponent value="wallet" icon={SmartphoneIcon}>
                Wallet on My App
              </ChipComponent>
              <ChipComponent value="offers" icon={TagIcon}>
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

export const chipRef: StoryFn<typeof ChipGroupComponent> = (args) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const chipRef = React.useRef<BladeElementRef>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [value, setValue] = React.useState('');

  return (
    <Box gap="spacing.3" display="flex" flexDirection="column">
      <ChipGroupComponent selectionType="single" value={value} {...args}>
        <ChipComponent ref={chipRef} value="Proprietorship">
          Proprietorship
        </ChipComponent>
        <ChipComponent value="Public">Public</ChipComponent>
        <ChipComponent value="Small Business">Small Business</ChipComponent>
      </ChipGroupComponent>
      <Box maxWidth="400px" display="flex" flexDirection="row" gap="spacing.3">
        <Button
          isFullWidth={true}
          onClick={() => {
            chipRef?.current?.focus();
            setValue('Proprietorship');
          }}
        >
          Select Proprietorship
        </Button>
        <Button
          isFullWidth={true}
          variant="secondary"
          onClick={() => {
            chipRef?.current?.blur();
            setValue('');
          }}
        >
          Reset Selection
        </Button>
      </Box>
    </Box>
  );
};

chipRef.storyName = 'Chip Ref';
chipRef.args = {
  accessibilityLabel: 'Select one business type from the options below',
  selectionType: 'single',
};
chipRef.parameters = {
  controls: {
    exclude: ['icon'],
  },
};
