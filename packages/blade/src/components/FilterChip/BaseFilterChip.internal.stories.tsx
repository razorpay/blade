import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import dayjs from 'dayjs';
import { BaseFilterChip } from './BaseFilterChip';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { FilterChipDatePicker } from '~components/DatePicker';
import type { DatesRangeValue } from '~components/DatePicker';
import { Text } from '~components/Typography';

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

export const Default: StoryFn<typeof BaseFilterChip> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.6">
      <Box display="flex" gap="spacing.4" flexWrap="wrap">
        <BaseFilterChip label="Date" value="22/04/1999 - 14/02/2025" />
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
      <Box>
        <Text marginBottom="spacing.4" color="surface.text.gray.muted" size="small">
          BaseFilterChip powers the FilterChipDatePicker. With{' '}
          <Text as="span" weight="semibold" size="small">
            displayFormat=&quot;compact&quot;
          </Text>
          , selecting a named preset shows the preset label, while a custom range shows a humanised
          date range inside the chip&apos;s selected state.
        </Text>
        <FilterChipDatePicker
          label="Date"
          selectionType="range"
          displayFormat="compact"
          presets={[
            {
              label: 'Past 7 days',
              value: (date) => [dayjs(date).subtract(7, 'days').toDate(), date],
            },
            {
              label: 'Past 15 days',
              value: (date) => [dayjs(date).subtract(15, 'days').toDate(), date],
            },
            {
              label: 'Past month',
              value: (date) => [dayjs(date).subtract(1, 'month').toDate(), date],
            },
            {
              label: 'Custom',
              value: () => [null, null] as DatesRangeValue,
            },
          ]}
          onChange={(date) => {
            console.log(date);
          }}
        />
      </Box>
    </Box>
  );
};
