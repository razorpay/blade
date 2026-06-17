import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { Code, Text } from '../Typography';
import type { ChipGroupProps } from './ChipGroup';
import { ChipGroup as ChipGroupComponent } from './ChipGroup';
import { Chip as ChipComponent } from './Chip';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import iconMap from '~components/Icons/iconMap';
import { Link } from '~components/Link';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="The Chip component is inherently tied to the ChipGroup and cannot be utilized outside its context."
      componentName="Chip"
      note={
        <Text>
          This story is only meant to demonstrate the props of the Chip component. For complete
          usage refer to the ChipGroup story{' '}
          <Link
            target="_blank"
            href="https://blade.razorpay.com/?path=/docs/components-chip-chipgroup"
          >
            here.
          </Link>
          <br />
          Use <Code size="medium">icon</Code> for Blade icons and <Code size="medium">leading</Code>{' '}
          for custom leading elements like flags or avatars. They are mutually exclusive and should
          not be used together.
        </Text>
      }
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75272-53870&t=TGcKiXJiozSRKwOG-1&scaling=min-zoom&page-id=52377%3A23885&mode=design"
    />
  );
};

const propsCategory = { CHIP: 'Chip Props', CHIP_GROUP: 'ChipGroup Props' };

export default {
  title: 'Components/Chip/Chip',
  args: {
    isDisabled: false,
  },
  tags: ['autodocs'],
  argTypes: {
    // Chip props
    isDisabled: {
      description: 'Disables or enables `Chip`',
      control: {
        type: 'boolean',
      },
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'boolean',
        },
      },
    },
    value: {
      description: 'The value to be used in the Chip input.',
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'string',
        },
      },
    },
    icon: {
      name: 'icon',
      description:
        'Displays a Blade Icon component within the Chip. Mutually exclusive with `leading`.',
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
    leading: {
      description:
        'Custom leading element rendered before the label, such as a flag, avatar, logo, or SVG asset. Mutually exclusive with `icon`.',
      control: false,
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: 'React.ReactNode',
        },
      },
    },
    color: {
      description:
        'Sets the color of the Chip. This overwrites the color set by the parent `ChipGroup` component',
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: '"primary" | "positive" | "negative"',
        },
      },
      options: ['primary', 'positive', 'negative'],
      control: {
        type: 'radio',
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

const ChipTemplate: StoryFn<typeof ChipComponent> = ({ children, ...args }) => {
  return (
    <Box>
      <ChipGroupComponent
        selectionType="multiple"
        defaultValue={['Automated Payment Links']}
        accessibilityLabel="Select other capabilities you are looking for from the options below"
      >
        <ChipComponent value="Automated Payment Links" {...args}>
          Automated Payment Links
        </ChipComponent>
      </ChipGroupComponent>
    </Box>
  );
};

export const Default = ChipTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  color: 'primary',
};

const ChipWithLeadingTemplate: StoryFn<typeof ChipComponent> = ({ icon, value, ...args }) => {
  return (
    <Box>
      <Text marginBottom="spacing.4">Chip with leading element (e.g., country flags):</Text>
      <ChipGroupComponent
        selectionType="single"
        accessibilityLabel="Select country"
        label="Country"
      >
        <ChipComponent
          {...args}
          value="IN"
          leading={
            <img
              src="https://flagcdn.com/w40/in.png"
              width={16}
              height={12}
              alt="India"
              style={{ borderRadius: 2 }}
            />
          }
        >
          India
        </ChipComponent>
        <ChipComponent
          {...args}
          value="US"
          leading={
            <img
              src="https://flagcdn.com/w40/us.png"
              width={16}
              height={12}
              alt="US"
              style={{ borderRadius: 2 }}
            />
          }
        >
          United States
        </ChipComponent>
        <ChipComponent
          {...args}
          value="GB"
          leading={
            <img
              src="https://flagcdn.com/w40/gb.png"
              width={16}
              height={12}
              alt="UK"
              style={{ borderRadius: 2 }}
            />
          }
        >
          United Kingdom
        </ChipComponent>
      </ChipGroupComponent>
    </Box>
  );
};

export const WithLeading = ChipWithLeadingTemplate.bind({});
WithLeading.storyName = 'With Leading (Flags)';
WithLeading.args = {
  color: 'primary',
};
WithLeading.argTypes = {
  icon: {
    control: false,
    table: {
      disable: true,
    },
  },
  leading: {
    control: false,
  },
  value: {
    control: false,
    table: {
      disable: true,
    },
  },
};
