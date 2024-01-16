import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { Text } from '../Typography';
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
        </Text>
      }
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=52377%3A23885&mode=design&t=y7gUIBIzzNMRd3w6-1"
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
