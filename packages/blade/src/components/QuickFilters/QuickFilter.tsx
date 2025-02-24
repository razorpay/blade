import React, { forwardRef } from 'react';
import type { QuickFilterProps, QuickFilterContentProps } from './types';
import { useQuickFilterGroupContext } from './QuickFilterGroup';
import { Card, CardBody } from '~components/Card';
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
}: QuickFilterContentProps): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      gap="spacing.3"
      width="fit-content"
      justifyContent="center"
      alignItems="center"
      paddingY="spacing.3"
      paddingLeft="spacing.3"
      paddingRight="spacing.4"
    >
      <Box
        display="flex"
        flexDirection="row"
        gap="spacing.2"
        justifyContent="center"
        alignItems="center"
      >
        {selectionType === 'single' ? <Radio value={value} /> : <Checkbox value={value} />}
        <Text
          variant="body"
          size="medium"
          color={isSelected ? 'interactive.text.primary.subtle' : 'interactive.text.gray.subtle'}
          weight="medium"
        >
          {title}
        </Text>
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
      <Card
        padding="spacing.0"
        as="label"
        accessibilityLabel={title}
        borderRadius="medium"
        elevation="none"
        isSelected={isQuickFilterSelected}
        ref={ref}
        {...makeAnalyticsAttribute(rest)}
        {...metaAttribute({ testID })}
      >
        <CardBody>
          <QuickFilterContent
            value={value}
            title={title}
            trailing={trailing}
            selectionType={selectionType}
            isSelected={isQuickFilterSelected}
            {...rest}
          />
        </CardBody>
      </Card>
    );
  },
);
export { QuickFilter };
