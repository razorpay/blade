import { useState } from 'react';
import type { ListViewFilterProps } from './types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import { FilterIcon } from '~components/Icons';
import { Button } from '~components/Button';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';

const ListViewFilters = ({
  testID,
  children,
  quickFilters,
  onSearchChange,
  numberOfSelectedFilters,
  ...rest
}: ListViewFilterProps): React.ReactElement => {
  const [showFilters, setShowFilters] = useState(false);
  return (
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
              <Counter value={numberOfSelectedFilters} color="primary" emphasis="intense" />
            </Box>
          </Box>
          <Box display="flex">Searchable DropDown</Box>
        </BaseBox>
      </BaseBox>
      <BaseBox display="flex">{showFilters ? children : null} </BaseBox>
    </BaseBox>
  );
};

export { ListViewFilters };
