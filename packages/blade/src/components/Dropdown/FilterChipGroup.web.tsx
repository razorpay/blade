import { useState } from 'react';
import { useListViewFilterContext } from '../ListView/ListViewFiltersContext.web';
import type { FilterChipGroupProps } from './types';
import { FilterChipGroupProvider } from './FilterChipGroupContext.web';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { Link } from '~components/Link';

const FilterChipGroup = ({
  testID,
  children,
  showClearButton = true,
  onClearButtonClick,
  ...rest
}: FilterChipGroupProps): React.ReactElement => {
  const [filterChipGroupSelectedFilters, setFilterChipGroupSelectedFilters] = useState<string[]>(
    [],
  );
  const [clearFilterCallbackTriggerer, setClearFilterCallbackTriggerer] = useState<number>(0);
  const { selectedFiltersCount, setListViewSelectedFilters } = useListViewFilterContext();
  const handleClearButtonClick = (): void => {
    onClearButtonClick?.();
    setListViewSelectedFilters({});
    setFilterChipGroupSelectedFilters([]);
    setClearFilterCallbackTriggerer((prev) => prev + 1);
  };
  return (
    <FilterChipGroupProvider
      value={{
        filterChipGroupSelectedFilters,
        setFilterChipGroupSelectedFilters,
        clearFilterCallbackTriggerer,
        setClearFilterCallbackTriggerer,
      }}
    >
      <BaseBox
        {...metaAttribute({ name: MetaConstants.FilterChipGroup, testID })}
        {...makeAnalyticsAttribute(rest)}
        display="flex"
        padding={['spacing.4', 'spacing.1']}
        alignItems="center"
        justifyContent="flex-start"
        width="100%"
        gap="spacing.3"
        flexWrap="wrap"
      >
        {children}
        {showClearButton &&
        (filterChipGroupSelectedFilters.length > 0 || selectedFiltersCount > 0) ? (
          <Link size="xsmall" color="neutral" onClick={handleClearButtonClick}>{`Clear Filter${
            filterChipGroupSelectedFilters.length > 1 || selectedFiltersCount > 1 ? 's' : ''
          }`}</Link>
        ) : null}
      </BaseBox>
    </FilterChipGroupProvider>
  );
};

export { FilterChipGroup };
