import React, { useState } from 'react';
import styled from 'styled-components';
import type { ListViewFilterProps, ListViewSelectedFiltersType } from './types';
import { ListViewFiltersProvider } from './ListViewFiltersContext.web';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { Box } from '~components/Box';
import { SearchInput } from '~components/Input/SearchInput';
import { useId } from '~utils/useId';
import { useIsMobile } from '~utils/useIsMobile';
import { getComponentId } from '~utils/isValidAllowedChildren';

const StyledQuickFilterContainer = styled(BaseBox)({
  /* For Webkit (Chrome, Safari) */
  '::-webkit-scrollbar': {
    display: 'none',
  },
  /* For Firefox */
  scrollbarWidth: 'none',
  /* For Edge */
  msOverflowStyle: 'none',
});

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
  showFilters: showFiltersProp,
  onShowFiltersChange,
  onSearchClear,
  selectedFiltersCount = 0,
  searchTrailing,
  actions,
  ...rest
}: ListViewFilterProps): React.ReactElement => {
  const [
    listViewSelectedFilters,
    setListViewSelectedFilters,
  ] = useState<ListViewSelectedFiltersType>({});
  const searchId = useId('search-input');
  const searchNameValue = searchName || searchId;
  const isMobile = useIsMobile();

  const showSearchInput = onSearchChange || onSearchClear || searchValuePlaceholder || searchName;
  const isSearchTrailingDropDown =
    React.isValidElement(searchTrailing) && getComponentId(searchTrailing) === 'Dropdown';

  return (
    <ListViewFiltersProvider
      value={{
        listViewSelectedFilters,
        setListViewSelectedFilters,
        selectedFiltersCount,
      }}
    >
      {isMobile && showSearchInput && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder={searchValuePlaceholder}
          name={searchNameValue || searchId}
          onChange={({ name, value }) => onSearchChange?.({ name, value })}
          onClearButtonClick={onSearchClear}
          trailing={searchTrailing}
        />
      )}
      <BaseBox>
        <BaseBox
          {...metaAttribute({ name: MetaConstants.ListViewFilter, testID })}
          {...makeAnalyticsAttribute(rest)}
          display="flex"
          justifyContent="space-between"
        >
          <Box
            position="relative"
            display="flex"
            flexDirection="column"
            marginRight="spacing.3"
            flex="1"
            minWidth="0px"
          >
            <StyledQuickFilterContainer
              overflow="scroll"
              width="100%"
              paddingY="spacing.4"
              paddingLeft="spacing.1"
            >
              {quickFilters}
            </StyledQuickFilterContainer>
          </Box>

          <BaseBox display="flex" alignItems="center" flexShrink="0">
            {!isMobile && showSearchInput && (
              <Box width={isSearchTrailingDropDown ? '280px' : '208px'}>
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder={searchValuePlaceholder}
                  name={searchNameValue || searchId}
                  onChange={({ name, value }) => onSearchChange?.({ name, value })}
                  onClearButtonClick={onSearchClear}
                  size="medium"
                  trailing={searchTrailing}
                />
              </Box>
            )}
            {actions}
          </BaseBox>
        </BaseBox>
        <BaseBox display="flex">{children}</BaseBox>
      </BaseBox>
    </ListViewFiltersProvider>
  );
};

export { ListViewFilters };
