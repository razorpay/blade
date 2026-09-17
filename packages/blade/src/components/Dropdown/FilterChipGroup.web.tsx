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
  onResetButtonClick,
  clearButtonText,
  resetButtonText,
  ...rest
}: FilterChipGroupProps): React.ReactElement => {
  const [filterChipGroupSelectedFilters, setFilterChipGroupSelectedFilters] = useState<string[]>(
    [],
  );
  const [clearFilterCallbackTriggerer, setClearFilterCallbackTriggerer] = useState<number>(0);
  const { selectedFiltersCount, setListViewSelectedFilters } = useListViewFilterContext();

  // Shared bookkeeping reset: both actions clear the group's "has changes" tracking so the action
  // link(s) hide after use (a lingering action with nothing to revert is confusing). They reappear
  // on the next filter change.
  const clearGroupBookkeeping = (): void => {
    setListViewSelectedFilters({});
    setFilterChipGroupSelectedFilters([]);
  };

  // "Clear" empties every filter. Bumping the triggerer makes each child chip run its clear effect
  // (fires onChange([]) and drops its selection).
  const handleClearButtonClick = (): void => {
    onClearButtonClick?.();
    clearGroupBookkeeping();
    setClearFilterCallbackTriggerer((prev) => prev + 1);
  };

  // "Reset" only fires the consumer callback and clears the group's bookkeeping. We intentionally
  // do NOT bump the clear triggerer, so child chips keep their internal state and do not fire
  // onChange([]) — the consumer restores each filter's default inside onResetButtonClick and those
  // values are not stomped.
  // TODO (FilterChip reset — Phase 2): support restoring defaults for UNCONTROLLED filters. That
  // needs a `defaultValue` on FilterChipSelectInput and a reset path that restores it instead of
  // emptying. See packages/blade/src/components/Dropdown/_decisions/filter-chip-reset.md
  const handleResetButtonClick = (): void => {
    onResetButtonClick?.();
    clearGroupBookkeeping();
  };

  const hasSelectedFilters = filterChipGroupSelectedFilters.length > 0 || selectedFiltersCount > 0;
  const selectedCount = Math.max(filterChipGroupSelectedFilters.length, selectedFiltersCount);
  const isPlural = selectedCount > 1;
  const clearActionText = clearButtonText ?? `Clear Filter${isPlural ? 's' : ''}`;
  const resetActionText = resetButtonText ?? 'Reset';
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
        {hasSelectedFilters && onResetButtonClick ? (
          <Link size="small" color="neutral" onClick={handleResetButtonClick}>
            {resetActionText}
          </Link>
        ) : null}
        {hasSelectedFilters && showClearButton ? (
          <Link size="small" color="neutral" onClick={handleClearButtonClick}>
            {clearActionText}
          </Link>
        ) : null}
      </BaseBox>
    </FilterChipGroupProvider>
  );
};

export { FilterChipGroup };
