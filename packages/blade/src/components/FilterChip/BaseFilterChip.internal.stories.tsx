import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import dayjs from 'dayjs';
import { BaseFilterChip } from './BaseFilterChip';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { FilterChipDatePicker } from '~components/DatePicker';
import type { DatesRangeValue } from '~components/DatePicker';
import { Code, Text } from '~components/Typography';
import { Dropdown, DropdownOverlay, FilterChipSelectInput } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';

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

/**
 * Date filter with the clear button (default). Selecting a date shows the cross; pressing it
 * clears the selection.
 */
const ClearDateEnabled = (): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="semibold" size="small">
        Date filter
      </Text>
      <Box>
        <FilterChipDatePicker
          label="Date"
          selectionType="single"
          defaultValue={dayjs('1999-04-22').toDate()}
        />
      </Box>
    </Box>
  );
};

/**
 * Dropdown filter with the clear button (default). It starts with a pre-selected option so the
 * cross is visible; pressing it clears the selection.
 */
const ClearDropdownEnabled = (): React.ReactElement => {
  const [value, setValue] = React.useState('active');
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="semibold" size="small">
        Dropdown filter
      </Text>
      <Box>
        <Dropdown selectionType="single">
          <FilterChipSelectInput
            label="Status"
            value={value}
            onChange={({ values }) => setValue(values[0] ?? '')}
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Active" value="active" />
              <ActionListItem title="Pending" value="pending" />
              <ActionListItem title="Failed" value="failed" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    </Box>
  );
};

/**
 * Date filter with `showClearButton={false}`. The cross never shows, so a mandatory-default
 * filter can never be cleared to an empty state.
 */
const ClearDateDisabled = (): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="semibold" size="small">
        Date filter
      </Text>
      <Box>
        <FilterChipDatePicker
          label="Date"
          selectionType="single"
          defaultValue={dayjs('1999-04-22').toDate()}
          showClearButton={false}
        />
      </Box>
    </Box>
  );
};

/**
 * Dropdown filter with `showClearButton={false}`. It starts with a pre-selected option to show
 * that it holds a value without ever rendering a cross — use this for filters that should always
 * hold a value.
 */
const ClearDropdownDisabled = (): React.ReactElement => {
  const [value, setValue] = React.useState('latest');
  return (
    <Box display="flex" flexDirection="column" gap="spacing.2">
      <Text weight="semibold" size="small">
        Dropdown filter
      </Text>
      <Box>
        <Dropdown selectionType="single">
          <FilterChipSelectInput
            label="Sort"
            value={value}
            showClearButton={false}
            onChange={({ values }) => setValue(values[0] ?? '')}
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Latest first" value="latest" />
              <ActionListItem title="Oldest first" value="oldest" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    </Box>
  );
};

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
          BaseFilterChip also powers the Dropdown&apos;s FilterChipSelectInput. Open the chip to
          select an option.
        </Text>
        <Dropdown selectionType="single">
          <FilterChipSelectInput label="Status" />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Active" value="active" />
              <ActionListItem title="Pending" value="pending" />
              <ActionListItem title="Failed" value="failed" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
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

/**
 * Demonstrates how the clear (cross) button behaves across common wirings of the
 * FilterChipDatePicker, and how to hide it with `showClearButton={false}`.
 */
export const ClearButtonBehavior: StoryFn<typeof BaseFilterChip> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8" maxWidth="760px">
      <Box display="flex" flexDirection="column" gap="spacing.2">
        <Text weight="semibold">Clear button behaviour</Text>
        <Text size="small" color="surface.text.gray.muted">
          Use <Code>showClearButton</Code> to control the clear (cross) button on the date and
          dropdown filters that BaseFilterChip powers.
        </Text>
      </Box>

      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Text weight="semibold" size="medium">
          With clear button (default)
        </Text>
        <Box
          display="grid"
          gridTemplateColumns="repeat(2, minmax(280px, 1fr))"
          gap="spacing.7"
          alignItems="flex-start"
        >
          <ClearDateEnabled />
          <ClearDropdownEnabled />
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap="spacing.4">
        <Text weight="semibold" size="medium">
          Without clear button (showClearButton={'{false}'})
        </Text>
        <Box
          display="grid"
          gridTemplateColumns="repeat(2, minmax(280px, 1fr))"
          gap="spacing.7"
          alignItems="flex-start"
        >
          <ClearDateDisabled />
          <ClearDropdownDisabled />
        </Box>
      </Box>
    </Box>
  );
};

ClearButtonBehavior.storyName = 'Clear Button Behaviour';
