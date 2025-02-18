import React from 'react';
import type { QuickFilterProps, QuickFilterCardProps } from './types';
import { useQuickFilterGroupContext } from './QuickFilterGroup';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Radio } from '~components/Radio';
import { Checkbox } from '~components/Checkbox';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';

const QuickFilterCard = ({
  value,
  title,
  trailingElement,
  selectionType = 'single',
  isSelected = false,
  testID,
  ...rest
}: QuickFilterCardProps): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      gap="spacing.3"
      width="fit-content"
      justifyContent="center"
      alignItems="center"
      {...makeAnalyticsAttribute(rest)}
      {...metaAttribute({ testID })}
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

      {trailingElement}
    </BaseBox>
  );
};
const QuickFilter = ({
  title,
  value,
  trailingElement,
  ...rest
}: QuickFilterProps): React.ReactElement => {
  const { selectedQuickFilters, selectionType } = useQuickFilterGroupContext();

  const isQuickFilterSelected = selectedQuickFilters.includes(value);
  return (
    <Card
      padding="spacing.3"
      as="label"
      accessibilityLabel={title}
      borderRadius="medium"
      elevation="none"
      isSelected={isQuickFilterSelected}
    >
      <CardBody>
        <QuickFilterCard
          value={value}
          title={title}
          trailingElement={trailingElement}
          selectionType={selectionType}
          isSelected={isQuickFilterSelected}
          {...rest}
        />
      </CardBody>
    </Card>
  );
};
export { QuickFilter };
