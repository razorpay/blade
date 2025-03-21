import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { BaseFilterChip } from './BaseFilterChip';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Chips represents a collection of selectable objects which enable users to make selections, filter content, and trigger relevant actions. Chips can have either single selection or multiple (based on context)."
      componentName="BaseFilterChip"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75272-53870&t=TGcKiXJiozSRKwOG-1&scaling=min-zoom&page-id=52377%3A23885&mode=design"
    />
  );
};

export default {
  title: 'Components/BaseFilterChip',
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<typeof BaseFilterChip>;

const FilterChipTemplate: StoryFn<typeof BaseFilterChip> = (args) => {
  return (
    <Box>
      <Box display="flex" gap="spacing.4">
        <BaseFilterChip {...args} />
        <BaseFilterChip label="Unselected Chip" />
        <BaseFilterChip
          label="Phone Numbers"
          value={['9999999999', '0000000000']}
          selectionType="multiple"
        />
        <BaseFilterChip
          label="Disabled"
          value={['9999999999', '0000000000']}
          selectionType="multiple"
          isDisabled
        />
      </Box>
    </Box>
  );
};

export const Default = FilterChipTemplate.bind({});
Default.args = {
  label: 'Date',
  value: '22/04/1999 - 14/02/2025',
};
