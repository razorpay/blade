import type { FilterChipGroupProps } from './types';
import { useListViewFilterContext } from './ListViewFiltersContext.web';
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
  ...rest
}: FilterChipGroupProps): React.ReactElement => {
  const { setSelectedFilters } = useListViewFilterContext();
  const handleClearButtonClick = (): void => {
    onClearButtonClick?.();
    setSelectedFilters([]);
  };
  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ListView, testID })}
      {...makeAnalyticsAttribute(rest)}
      display="flex"
      padding="spacing.4"
      gap="spacing.3"
      backgroundColor="surface.background.gray.moderate"
      borderTop="1px solid"
      borderTopColor="surface.border.gray.muted"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
    >
      {children}
      {showClearButton ? <Link onClick={handleClearButtonClick}>{clearButtonText}</Link> : null}
    </BaseBox>
  );
};

export { FilterChipGroup };
