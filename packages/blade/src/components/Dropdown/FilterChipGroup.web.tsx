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
  clearButtonText,
  clearButtonBehavior = 'clear',
  ...rest
}: FilterChipGroupProps): React.ReactElement => {
  const [filterChipGroupSelectedFilters, setFilterChipGroupSelectedFilters] = useState<string[]>(
    [],
  );
  const [clearFilterCallbackTriggerer, setClearFilterCallbackTriggerer] = useState<number>(0);
  const { selectedFiltersCount, setListViewSelectedFilters } = useListViewFilterContext();
  const handleClearButtonClick = (): void => {
    onClearButtonClick?.();
    // Clear the group's "has changes" bookkeeping in both modes so the action button hides after
    // it's used (a lingering button post-reset is confusing — there's nothing left to revert). It
    // reappears the next time a filter changes.
    setListViewSelectedFilters({});
    setFilterChipGroupSelectedFilters([]);
    // In "reset" mode we stop here: we intentionally do NOT bump the clear triggerer, so the
    // controlled chips keep the default values the consumer just restored in onClearButtonClick
    // (bumping it would make each chip fire onChange([]) and empty itself).
    // TODO (FilterChip reset — Phase 2): support restoring defaults for UNCONTROLLED filters. That
    // needs a `defaultValue` on FilterChipSelectInput and a reset path that restores it instead of
    // emptying. See packages/blade/src/components/Dropdown/_decisions/filter-chip-reset.md
    if (clearButtonBehavior === 'reset') {
      return;
    }
    setClearFilterCallbackTriggerer((prev) => prev + 1);
  };
  const isPlural = filterChipGroupSelectedFilters.length > 1 || selectedFiltersCount > 1;
  const actionButtonText = clearButtonText ?? `Clear Filter${isPlural ? 's' : ''}`;
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
          <Link size="small" color="neutral" onClick={handleClearButtonClick}>
            {actionButtonText}
          </Link>
        ) : null}
      </BaseBox>
    </FilterChipGroupProvider>
  );
};

export { FilterChipGroup };
