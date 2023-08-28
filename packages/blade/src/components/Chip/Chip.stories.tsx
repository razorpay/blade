import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Heading, Text, Title } from '../Typography';
import type { ChipGroupProps } from './ChipGroup/ChipGroup';
import { ChipGroup as ChipGroupComponent } from './ChipGroup/ChipGroup';
import { Chip as ChipComponent } from './Chip';
import {
  PaymentLinksIcon,
  OffersIcon,
  SmartphoneIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from '~components/Icons';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import type { BladeElementRef } from '~utils/types';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. Chips can have either single selection or multiple (based on context)."
      componentName="Chip & ChipGroup"
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
  title: 'Components/Chip & ChipGroup',
  args: {
    isDisabled: false,
    name: undefined,
    accessibilityLabel: 'Select Business type:',
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
      /// type: `,
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
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} icon={args.icon}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const Default = ChipTemplate.bind({});
Default.storyName = 'Single Selection';
Default.argTypes = {
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
  const chipValues = ['Refunded', 'Failed', 'Pending', 'In Progress'];

  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Quick Filters:
      </Text>

      <ChipGroupComponent selectionType="multiple" {...args}>
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue}>
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
  accessibilityLabel: 'Quick Filters:',
};
MultiSelection.argTypes = {
  value: {
    options: ['Refunded', 'Failed', 'Pending', 'In Progress'],
    control: {
      type: 'multi-select',
    },
  },
  defaultValue: {
    options: ['Refunded', 'Failed', 'Pending', 'In Progress'],
    control: {
      type: 'multi-select',
    },
  },
};

export const DefaultSelectedSingle = ChipTemplate.bind({});
DefaultSelectedSingle.storyName = 'Uncontrolled Single Selection with Default Value';
DefaultSelectedSingle.args = {
  defaultValue: 'Proprietorship',
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
  defaultValue: ['Pending', 'In Progress'],
  accessibilityLabel: 'Quick Filters:',
};
DefaultMultiSelected.argTypes = {
  defaultValue: {
    options: ['Refunded', 'Failed', 'Pending', 'In Progress'],
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
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent
        selectionType="single"
        value={value}
        onChange={({ values }) => setValue(values[0])}
        {...args}
      >
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>

      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Selected value is &quot;{value}&quot;
      </Text>
    </Box>
  );
};

export const ControlledSingleSelection = ControlledSingleSelectionTemplate.bind({});
ControlledSingleSelection.storyName = 'Controlled Single Selection';
ControlledSingleSelection.args = {
  accessibilityLabel: 'Select Business type:',
};

const ControlledMultiSelectionTemplate: ComponentStory<typeof ChipGroupComponent> = (args) => {
  const chipValues = ['Refunded', 'Failed', 'Pending', 'In Progress'];
  const [values, setValues] = React.useState(['In Progress']);
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Quick Filters:
      </Text>

      <ChipGroupComponent
        selectionType="multiple"
        onChange={({ values }) => setValues(values)}
        {...args}
        value={values}
      >
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue} icon={args.icon}>
            {chipValue}
          </ChipComponent>
        ))}
      </ChipGroupComponent>

      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Selected filters are &quot;{values.join(', ')}&quot;
      </Text>
    </Box>
  );
};

export const ControlledMultiSelection = ControlledMultiSelectionTemplate.bind({});
ControlledMultiSelection.storyName = 'Controlled Multiple Selection';
ControlledMultiSelection.args = {
  accessibilityLabel: 'Quick Filters:',
};

export const Disabled = ChipTemplate.bind({});
Disabled.storyName = 'Disabled';
Disabled.args = {
  isDisabled: true,
};

const ChipWithIconTemplate: ComponentStory<typeof ChipGroupComponent> = ({ children, ...args }) => {
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        What other capabilities are you looking for?
      </Text>

      <ChipGroupComponent selectionType="multiple" defaultValue="payment-links" {...args}>
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
  );
};

export const ChipWithIcon = ChipWithIconTemplate.bind({});
ChipWithIcon.storyName = 'With Icon';
ChipWithIcon.args = {
  accessibilityLabel: 'Quick Filters:',
};

const AllChipSizesTemplate: ComponentStory<typeof ChipGroupComponent> = ({ children, ...args }) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  const sizes = ['xsmall', 'small', 'medium', 'large'];
  return (
    <Box>
      {sizes.map((size, index) => (
        <Box key={index}>
          <Title size="medium" marginBottom="spacing.3">
            {size}
          </Title>
          <Box marginBottom="spacing.3">
            <Heading size="small">Without Icon</Heading>
            <Text marginBottom="spacing.3" marginTop="spacing.3" size="medium">
              Select Business type:
            </Text>

            <ChipGroupComponent
              size={size as ChipGroupProps['size']}
              defaultValue="Proprietorship"
              {...args}
            >
              {chipValues.map((chipValue: string) => (
                <ChipComponent key={chipValue} value={chipValue}>
                  {chipValue}
                </ChipComponent>
              ))}
            </ChipGroupComponent>
          </Box>
          <Box marginBottom="spacing.3">
            <Heading size="small">with Icon</Heading>
            <Text marginBottom="spacing.3" marginTop="spacing.3" size="medium">
              What other capabilities are you looking for?
            </Text>

            <ChipGroupComponent
              accessibilityLabel="What other capabilities are you looking for?"
              defaultValue="Proprietorship"
              size={size as ChipGroupProps['size']}
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

const ChipIntentsTemplate: ComponentStory<typeof ChipGroupComponent> = (args) => {
  return (
    <Box display="flex" flexDirection="column">
      <Text size="large" weight="bold" marginBottom="spacing.3">
        Is the result helpful?
      </Text>

      <ChipGroupComponent defaultValue="yes" {...args}>
        <ChipComponent intent="positive" value="yes" icon={ThumbsUpIcon}>
          Yes
        </ChipComponent>
        <ChipComponent intent="negative" value="no" icon={ThumbsDownIcon}>
          No
        </ChipComponent>
      </ChipGroupComponent>
    </Box>
  );
};

export const ChipWithIntent = ChipIntentsTemplate.bind({});
ChipWithIntent.storyName = 'With Intent';
ChipWithIntent.args = {
  accessibilityLabel: 'Is the result helpful?',
};

const TextTransformationTemplate: ComponentStory<typeof ChipGroupComponent> = ({
  children,
  ...args
}) => {
  const chipValues = ['Proprietorship', 'Public', 'Small Business'];
  return (
    <Box>
      <Text marginBottom="spacing.3" marginTop="spacing.3">
        Select Business type:
      </Text>

      <ChipGroupComponent defaultValue="Proprietorship" {...args}>
        {chipValues.map((chipValue: string) => (
          <ChipComponent key={chipValue} value={chipValue}>
            {chipValue.toUpperCase()}
          </ChipComponent>
        ))}
      </ChipGroupComponent>
    </Box>
  );
};

export const TextTransformationUppercase = TextTransformationTemplate.bind({});
TextTransformationUppercase.storyName = 'Text Transformation (Uppercase)';

export const chipRef: ComponentStory<typeof ChipComponent> = (args) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const chipRef = React.useRef<BladeElementRef>(null);

  return (
    <Box gap="spacing.3" display="flex" flexDirection="column">
      <ChipGroupComponent
        accessibilityLabel="Select business type"
        selectionType="single"
        {...args}
      >
        <ChipComponent ref={chipRef} value="Proprietorship">
          Proprietorship
        </ChipComponent>
        <ChipComponent value="Public">Public</ChipComponent>
        <ChipComponent value="Small Business">Small Business</ChipComponent>
      </ChipGroupComponent>
      <Box maxWidth="200px">
        <Button isFullWidth={false} onClick={() => chipRef?.current?.focus()}>
          Click to focus the Chip
        </Button>
      </Box>
    </Box>
  );
};

chipRef.storyName = 'Chip Ref';
chipRef.parameters = {
  docs: {
    description: {
      story:
        'Chip component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programmatically control the DOM element',
    },
  },
};
