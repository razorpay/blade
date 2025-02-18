import React from 'react';
import type { QuickFilterProps } from './types';
import { useQuickFilterGroupContext } from './QuickFilterGroup/QuickFilterContext';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Radio } from '~components/Radio';
import { Checkbox } from '~components/Checkbox';

const QuickFilterCard = ({
  value,
  label,
  trailingElement,
  selectionType = 'single',
}: {
  value: string;
  label: string;
  trailingElement?: React.ReactNode;
  selectionType?: 'single' | 'multiple';
}): React.ReactNode => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      gap="spacing.4"
      width="fit-content"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="flex"
        flexDirection="row"
        gap="spacing.2"
        justifyContent="center"
        alignItems="center"
      >
        {selectionType === 'single' ? <Radio value={value} /> : <Checkbox value={value} />}
        <Text size="medium" weight="medium" color="interactive.text.gray.subtle">
          {label}
        </Text>
      </Box>

      {trailingElement}
    </Box>
  );
};
const QuickFilter = ({ title, value, trailingElement }: QuickFilterProps): React.ReactNode => {
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
          label={title}
          trailingElement={trailingElement}
          selectionType={selectionType}
        />
      </CardBody>
    </Card>
  );
};
export { QuickFilter };
