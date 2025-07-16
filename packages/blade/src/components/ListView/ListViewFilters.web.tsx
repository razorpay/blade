import React, { useState, useRef } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import styled from 'styled-components';
import type { ListViewFilterProps, ListViewSelectedFiltersType } from './types';
import { ListViewFiltersProvider } from './ListViewFiltersContext.web';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { FilterIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Counter } from '~components/Counter';
import type { BoxProps } from '~components/Box';
import { Box } from '~components/Box';
import { SearchInput } from '~components/Input/SearchInput';
import { useId } from '~utils/useId';
import { useControllableState } from '~utils/useControllable';
import { useIsMobile } from '~utils/useIsMobile';
import { msToSeconds } from '~utils/msToSeconds';
import { useTheme } from '~components/BladeProvider';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { castWebType } from '~utils';
import { Divider } from '~components/Divider';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useWindowSize } from '~utils/useWindowSize';

const gradientOverlyContainerWidth = '38px'; // 37px + 1px divider width
const gradientOverlyContainerHeight = '38px';

const CHILDREN_COUNTER_WIDTH = 36;
const SEARCH_SPACING = 12;
const QUICK_FILTER_SPACING = 4;
const CHILDREN_TOTAL_WIDTH = CHILDREN_COUNTER_WIDTH + QUICK_FILTER_SPACING;
const CHILDREN_WITH_SEARCH_WIDTH = CHILDREN_COUNTER_WIDTH + SEARCH_SPACING + QUICK_FILTER_SPACING;

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

const GradientOverlay = styled.div<{
  gradientColorLeft: string;
  dividerColor: string;
  gradientColorRight: string;
}>`
  height: 100%;
  width: 37px;
  background: linear-gradient(
    270deg,
    ${({ gradientColorRight }) => gradientColorRight} 30%,
    ${({ gradientColorLeft }) => gradientColorLeft} 100%
  );
  pointer-events: none;
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: ${({ dividerColor }) => dividerColor};
  }
`;

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
  ...rest
}: ListViewFilterProps): React.ReactElement => {
  const [shouldShowDecorationInQuickFilters, setShouldShowDecorationInQuickFilters] = useState(
    false,
  );
  const [showFilters, setShowFilters] = useControllableState({
    defaultValue: showQuickFilters ?? showFiltersProp,
    value: showQuickFilters ?? showFiltersProp,
    onChange: onShowQuickFiltersChange ?? onShowFiltersChange,
  });
  const [
    listViewSelectedFilters,
    setListViewSelectedFilters,
  ] = useState<ListViewSelectedFiltersType>({});
  const searchId = useId('search-input');
  const searchNameValue = searchName || searchId;
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const { width } = useWindowSize();
  const containerRef = useRef<HTMLElement | null>(null);

  // Recalculate gradient visibility when width changes
  useIsomorphicLayoutEffect(() => {
    const node = containerRef.current;
    if (node instanceof HTMLElement && quickFilters) {
      const hasChildren = Boolean(children);
      setShouldShowDecorationInQuickFilters(node.scrollWidth > node.offsetWidth && hasChildren);
    }
  }, [width, children]);

  const showSearchInput = onSearchChange || onSearchClear || searchValuePlaceholder || searchName;
  const getFilterContainerWidth = (): BoxProps['width'] => {
    const hasChildren = Boolean(children);

    if (isMobile) {
      return hasChildren ? '88%' : '100%';
    }

    const searchInputWidth = isSearchTrailingDropDown ? '280px' : '208px';

    if (showSearchInput && hasChildren) {
      return `calc(100% - ${searchInputWidth} - ${CHILDREN_WITH_SEARCH_WIDTH}px)`;
    }
    if (hasChildren) {
      return `calc(100% - ${CHILDREN_TOTAL_WIDTH}px)`;
    }
    if (showSearchInput) {
      return `calc(100% - ${searchInputWidth} - ${QUICK_FILTER_SPACING}px)`;
    }
    return '100%';
  };

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
            width={getFilterContainerWidth()}
            marginRight="spacing.2"
          >
            <StyledQuickFilterContainer
              overflow="scroll"
              width="100%"
              ref={(node) => {
                containerRef.current = node;
              }}
              paddingY="spacing.4"
              paddingLeft="spacing.2"
            >
              {quickFilters}
            </StyledQuickFilterContainer>
            {shouldShowDecorationInQuickFilters ? (
              <Box
                position="absolute"
                right="-1px"
                top="spacing.4"
                width={gradientOverlyContainerWidth}
                height={gradientOverlyContainerHeight}
              >
                <GradientOverlay
                  gradientColorLeft={theme.colors.transparent}
                  gradientColorRight={theme.colors.surface.background.gray.intense}
                  dividerColor={theme.colors.surface.border.gray.muted}
                />
                <Divider orientation="vertical" />
              </Box>
            ) : null}
          </Box>

          <BaseBox display="flex" gap="spacing.4" alignItems="center">
            {children ? (
              <Box position="relative" display="inline-block">
                <Button
                  variant="tertiary"
                  size="medium"
                  color="primary"
                  onClick={() => {
                    setShowFilters((prev) => !prev);
                  }}
                  icon={FilterIcon}
                  accessibilityLabel="Show More Filters"
                />

                <Box
                  position="absolute"
                  right="spacing.0"
                  top="spacing.0"
                  transform="translate(50%, -50%)"
                >
                  <Counter
                    value={selectedFiltersCount || Object.keys(listViewSelectedFilters).length}
                    color="primary"
                    emphasis="intense"
                    size="small"
                  />
                </Box>
              </Box>
            ) : null}
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
          </BaseBox>
        </BaseBox>
        <AnimatePresence>
          {showFilters && (
            <m.div
              initial={{ height: 0 }}
              animate={{ height: showFilters ? 'auto' : 0 }}
              transition={{
                duration: msToSeconds(theme.motion.duration.moderate),
                ease: cssBezierToArray(castWebType(theme.motion.easing.standard)),
              }}
              exit={{ height: 0 }}
            >
              <BaseBox
                display="flex"
                backgroundColor={
                  isMobile ? 'surface.background.white' : 'surface.background.gray.moderate'
                }
                borderTop={!isMobile ? '1ps solid' : undefined}
                borderTopColor={!isMobile ? 'surface.border.gray.muted' : undefined}
              >
                {children}
              </BaseBox>
            </m.div>
          )}
        </AnimatePresence>
      </BaseBox>
    </ListViewFiltersProvider>
  );
};

export { ListViewFilters };
