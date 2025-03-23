import { useState } from 'react';
// import styled from 'styled-components';
import { AnimatePresence, m } from 'framer-motion';
import type { ListViewFilterProps, ListViewSelectedFiltersType } from './types';
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
import { useIsMobile } from '~utils/useIsMobile';
import { msToSeconds } from '~utils/msToSeconds';
import { useTheme } from '~components/BladeProvider';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { castWebType } from '~utils';

// import { Divider } from '~components/Divider';

// const FadeContainer = styled.div`
//   width: 20px;
//   height: 36px;
//   background: linear-gradient(270deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
// `;

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
  const [
    listViewSelectedFilters,
    setListViewSelectedFilters,
  ] = useState<ListViewSelectedFiltersType>({});
  const searchId = useId('search-input');
  const searchNameValue = searchName || searchId;
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  return (
    <ListViewFiltersProvider
      value={{
        listViewSelectedFilters,
        setListViewSelectedFilters,
      }}
    >
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder={searchValuePlaceholder}
          name={searchNameValue || searchId}
          onChange={({ name, value }) => onSearchChange?.({ name, value })}
        />
      )}
      <BaseBox>
        <BaseBox
          {...metaAttribute({ name: MetaConstants.ListViewFilter, testID })}
          {...makeAnalyticsAttribute(rest)}
          display="flex"
          justifyContent="space-between"
        >
          <BaseBox
            overflow={isMobile ? 'scroll' : 'visible'}
            width={isMobile ? '100%' : 'auto'}
            marginRight={isMobile ? 'spacing.2' : 'spacing.0'}
            paddingLeft={isMobile ? 'spacing.2' : 'spacing.0'}
            paddingY="spacing.5"
          >
            {quickFilters}
          </BaseBox>
          {/* <Divider orientation="vertical" /> */}

          <BaseBox display="flex" gap="spacing.8" alignItems="center">
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
                  value={Object.keys(listViewSelectedFilters).length}
                  color="primary"
                  emphasis="intense"
                />
              </Box>
            </Box>
            {!isMobile && (
              <Box display="flex">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder={searchValuePlaceholder}
                  name={searchNameValue || searchId}
                  onChange={({ name, value }) => onSearchChange?.({ name, value })}
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
