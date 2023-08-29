import type { ComponentStory, Meta } from '@storybook/react';
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
      componentDescription="Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. This story is only meant for demonstrating props of chip component."
      componentName="Chip"
      note={
        <Text>
          The Chip component is inherently tied to the ChipGroup and cannot be utilized outside its
          context. Refer to the ChipGroup story{' '}
          <Link
            target="_blank"
            href="https://blade.razorpay.com/?path=/docs/components-chip-chipgroup"
          >
            here
          </Link>
        </Text>
      }
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=52377%3A23885&mode=design&t=y7gUIBIzzNMRd3w6-1',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=18358%3A3135&mode=design&t=FzNrQV6ZZaLoxzcj-1',
      }}
    />
  );
};

const propsCategory = { CHIP: 'Chip Props', CHIP_GROUP: 'ChipGroup Props' };

export default {
  title: 'Components/Chip/Chip',
  args: {
    isDisabled: false,
  },
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
      description:
        'Value of the Chip group Acts as a controlled component by specifying the ChipGroup value Use onChange to update its value.',
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
    intent: {
      description:
        'Sets the intent of the Chip. This overwrites the intent set by the parent `ChipGroup` component',
      table: {
        category: propsCategory.CHIP,
        type: {
          summary: '"none" | "positive" | "negative"',
        },
      },
      options: ['none', 'positive', 'negative'],
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

const ChipTemplate: ComponentStory<typeof ChipComponent> = ({ children, ...args }) => {
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
  intent: 'none',
};
