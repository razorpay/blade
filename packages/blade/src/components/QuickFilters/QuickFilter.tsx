import React, { forwardRef } from 'react';
import type { QuickFilterProps, QuickFilterContentProps } from './types';
import { useQuickFilterGroupContext } from './QuickFilterGroup';
import { StyledQuickFilterWrapper } from './StyledQuickFilterWrapper';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Radio } from '~components/Radio';
import { Checkbox } from '~components/Checkbox';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import type { BladeElementRef } from '~utils/types';

const QuickFilterContent = ({
  value,
  title,
  trailing,
  selectionType = 'single',
  isSelected = false,
  ...rest
}: QuickFilterContentProps): React.ReactElement => {
  const isSingleSelection = selectionType === 'single';

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      gap="spacing.3"
      width="fit-content"
      justifyContent="center"
      alignItems="center"
      paddingY="spacing.3"
      paddingLeft={isSingleSelection ? 'spacing.4' : 'spacing.3'}
      paddingRight="spacing.4"
    >
      <Box
        display="flex"
        flexDirection="row"
        gap={isSingleSelection ? 'spacing.0' : 'spacing.2'}
        justifyContent="center"
        alignItems="center"
      >
        {isSingleSelection ? (
          <Radio value={value} _hideRadioIcon {...makeAnalyticsAttribute(rest)} />
        ) : (
          <Checkbox value={value} {...makeAnalyticsAttribute(rest)} />
        )}
        <BaseBox display="grid">
          {/* Invisible bold text to reserve space and prevent layout shift */}
          <BaseBox gridArea="1 / 1" visibility="hidden" aria-hidden="true">
            <Text variant="body" size="medium" weight="semibold">
              {title}
            </Text>
          </BaseBox>
          {/* Visible text in the same grid cell */}
          <BaseBox gridArea="1 / 1">
            <Text
              variant="body"
              size="medium"
              color={isSelected ? 'interactive.text.gray.normal' : 'interactive.text.gray.subtle'}
              weight={isSelected ? 'semibold' : 'medium'}
            >
              {title}
            </Text>
          </BaseBox>
        </BaseBox>
      </Box>

      {trailing}
    </BaseBox>
  );
};

const QuickFilter = forwardRef<BladeElementRef, QuickFilterProps>(
  ({ title, value, trailing, testID, ...rest }, ref): React.ReactElement => {
    const { selectedQuickFilters, selectionType } = useQuickFilterGroupContext();

    const isQuickFilterSelected = selectedQuickFilters.includes(value);

    return (
      <StyledQuickFilterWrapper
        as="label"
        ref={ref as React.Ref<HTMLLabelElement>}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        borderRadius="small"
        isSelected={isQuickFilterSelected}
        {...makeAnalyticsAttribute(rest)}
        {...metaAttribute({ testID })}
      >
        <QuickFilterContent
          value={value}
          title={title}
          trailing={trailing}
          selectionType={selectionType}
          isSelected={isQuickFilterSelected}
          {...rest}
        />
      </StyledQuickFilterWrapper>
    );
  },
);
export { QuickFilter };
