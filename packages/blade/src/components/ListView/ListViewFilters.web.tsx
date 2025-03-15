import { useState } from 'react';
import type { ListViewFilterProps } from './types';
import { ListViewFiltersProvider } from './ListViewFiltersContext.web';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { FilterIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';
import { SearchInput } from '~components/Input/SearchInput';
import { useId } from '~utils/useId';
import { useControllableState } from '~utils/useControllable';

const ListViewFilters = ({
  testID,
  children,
  quickFilters,
  onSearchChange,
  searchValue,
  searchValuePlaceholder,
  searchName,
  showQuickFilters,
  onShowQuickFiltersChange,
  ...rest
}: ListViewFilterProps): React.ReactElement => {
  const [showFilters, setShowFilters] = useControllableState({
    defaultValue: showQuickFilters,
    value: showQuickFilters,
    onChange: onShowQuickFiltersChange,
  });
  const [listViewSelectedFilters, setListViewSelectedFilters] = useState<string[]>([]);
  const searchId = useId('search-input');
  const searchNameValue = searchName || searchId;

  return (
    <ListViewFiltersProvider
      value={{
        listViewSelectedFilters,
        setListViewSelectedFilters,
      }}
    >
      <BaseBox>
        <BaseBox
          {...metaAttribute({ name: MetaConstants.ListViewFilter, testID })}
          {...makeAnalyticsAttribute(rest)}
          display="flex"
          justifyContent="space-between"
          paddingY="spacing.5"
        >
          {quickFilters}

          <BaseBox display="flex" gap="spacing.8">
            <Box position="relative" display="inline-block">
              <Button
                variant="tertiary"
                size="small"
                onClick={() => {
                  setShowFilters((prev) => !prev);
                }}
                icon={FilterIcon}
              />
              <Box
                position="absolute"
                top="spacing.0"
                right="spacing.0"
                transform="translate(50%, -50%)"
              >
                <Counter
                  value={listViewSelectedFilters.length}
                  color="primary"
                  emphasis="intense"
                />
              </Box>
            </Box>
            <Box display="flex">
              <SearchInput
                label=""
                value={searchValue}
                placeholder={searchValuePlaceholder}
                name={searchNameValue || searchId}
                onChange={({ name, value }) => onSearchChange?.({ name, value })}
              />{' '}
            </Box>
          </BaseBox>
        </BaseBox>
        <BaseBox
          display="flex"
          backgroundColor="surface.background.gray.moderate"
          borderTop="1px solid"
          borderTopColor="surface.border.gray.muted"
        >
          {showFilters ? children : null}{' '}
        </BaseBox>
      </BaseBox>
    </ListViewFiltersProvider>
  );
};

export { ListViewFilters };
