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

const ListViewFilters = ({
  testID,
  children,
  quickFilters,
  onSearchChange,
  searchValue,
  searchValuePlaceholder,
  searchName,
  ...rest
}: ListViewFilterProps): React.ReactElement => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const searchId = useId('search-input');
  const searchNameValue = searchName || searchId;

  return (
    <ListViewFiltersProvider
      value={{
        selectedFilters,
        setSelectedFilters,
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
                <Counter value={selectedFilters.length} color="primary" emphasis="intense" />
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
        <BaseBox display="flex">{showFilters ? children : null} </BaseBox>
      </BaseBox>
    </ListViewFiltersProvider>
  );
};

export { ListViewFilters };
