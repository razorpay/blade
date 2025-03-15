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
  const { setListViewSelectedFilters } = useListViewFilterContext();
  const handleClearButtonClick = (): void => {
    onClearButtonClick?.();
    setListViewSelectedFilters([]);
    setFilterChipGroupSelectedFilters([]);
  };
  return (
    <FilterChipGroupProvider
      value={{
        filterChipGroupSelectedFilters,
        setFilterChipGroupSelectedFilters,
      }}
    >
      <BaseBox
        {...metaAttribute({ name: MetaConstants.FilterChipGroup, testID })}
        {...makeAnalyticsAttribute(rest)}
        display="flex"
        padding="spacing.4"
        gap="spacing.3"
        alignItems="center"
        justifyContent="flex-start"
        width="100%"
      >
        {children}
        {showClearButton ? <Link onClick={handleClearButtonClick}>Clear Filters</Link> : null}
      </BaseBox>
    </FilterChipGroupProvider>
  );
};

export { FilterChipGroup };
