import React from 'react';
import { Dropdown, DropdownOverlay, FilterChipGroup } from '..';
import { FilterChipSelectInput } from '../FilterChipSelectInput';
import { ActionList, ActionListItem } from '~components/ActionList';
import { FilterChipDatePicker } from '~components/DatePicker';

const DropdownStoryMeta = {
  title: 'Components/FilterChipGroup',
  component: FilterChipGroup,
  args: {},
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

export const Default = (): React.ReactElement => {
  const [value, setSelectedValue] = React.useState<string | undefined>(undefined);

  return (
    <FilterChipGroup>
      <Dropdown>
        <FilterChipSelectInput
          label="Filter"
          value={value}
          onClearButtonClick={() => {
            setSelectedValue(undefined);
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setSelectedValue(name);
              }}
              isSelected={status === 'latest-added'}
              title="Latest Added"
              value="latest-added"
            />
            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setSelectedValue(name);
              }}
              isSelected={value === 'latest-invoice'}
              title="Latest Invoice"
              value="latest-invoice"
            />

            <ActionListItem
              onClick={({ name, value }) => {
                console.log({ name, value });
                setSelectedValue(name);
              }}
              isSelected={value === 'oldest-due-date'}
              title="Oldest Due Date"
              value="oldest-due-date"
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <FilterChipDatePicker label="Date" selectionType="range" />
    </FilterChipGroup>
  );
};

/**
 * Group-level "Reset" (Phase 1).
 *
 * The action button belongs to the whole `FilterChipGroup`, not to individual chips.
 * `clearButtonText` relabels it to "Reset", and `clearButtonBehavior="reset"` makes the group fire
 * a single `onClearButtonClick` WITHOUT emptying the chips — so the consumer restores every
 * filter's default in one place. Below, one "Reset" restores BOTH the Sort and Status filters to
 * their defaults. (Restoring defaults for uncontrolled filters is Phase 2 — see
 * `_decisions/filter-chip-reset.md`.)
 */
export const WithResetButton = (): React.ReactElement => {
  const SORT_DEFAULT = 'latest-added';
  const STATUS_DEFAULT = ['active'];
  const [sort, setSort] = React.useState<string | undefined>(SORT_DEFAULT);
  const [status, setStatus] = React.useState<string[]>(STATUS_DEFAULT);

  const handleReset = (): void => {
    setSort(SORT_DEFAULT);
    setStatus(STATUS_DEFAULT);
  };

  return (
    <FilterChipGroup
      clearButtonText="Reset"
      clearButtonBehavior="reset"
      onClearButtonClick={handleReset}
    >
      <Dropdown>
        <FilterChipSelectInput
          label="Sort"
          value={sort}
          onChange={({ values }) => setSort(values[0])}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Latest Added" value="latest-added" />
            <ActionListItem title="Latest Invoice" value="latest-invoice" />
            <ActionListItem title="Oldest Due Date" value="oldest-due-date" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput
          label="Status"
          value={status}
          onChange={({ values }) => setStatus(values)}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Active" value="active" />
            <ActionListItem title="Pending" value="pending" />
            <ActionListItem title="Failed" value="failed" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </FilterChipGroup>
  );
};

export default DropdownStoryMeta;
