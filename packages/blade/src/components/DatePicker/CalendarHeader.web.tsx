/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { CalendarLevel as MantineCalendarLevel, DatesRangeValue } from '@mantine/dates';
import dayjs from 'dayjs';
import type { PickerType } from './types';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon } from '~components/Icons';

type CalendarHeaderProps = {
  isRange: boolean;
  date: Date | DatesRangeValue;
  pickerType: PickerType;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  onNextYear: () => void;
  onPreviousYear: () => void;
  onNextDecade: () => void;
  onPreviousDecade: () => void;
  onLevelChange: (level: MantineCalendarLevel) => void;
};

const CalendarHeader = ({
  isRange,
  date,
  pickerType,
  onNextMonth,
  onNextYear,
  onNextDecade,
  onPreviousMonth,
  onPreviousYear,
  onPreviousDecade,
  onLevelChange,
}: CalendarHeaderProps): React.ReactElement => {
  const month = dayjs(date as Date).format('MMMM');
  const year = dayjs(date as Date).format('YYYY');
  const nextMonth = dayjs(date as Date)
    .add(1, 'month')
    .format('MMMM');
  const nextYear = dayjs(date as Date)
    .add(1, 'month')
    .format('YYYY');

  const handleNext = () => {
    switch (pickerType) {
      case 'day':
        onNextMonth();
        break;
      case 'month':
        onNextYear();
        break;
      case 'year':
        onNextDecade();
        break;
      default:
        throw new Error('Invalid picker type');
    }
  };

  const handlePrevious = () => {
    switch (pickerType) {
      case 'day':
        onPreviousMonth();
        break;
      case 'month':
        onPreviousYear();
        break;
      case 'year':
        onPreviousDecade();
        break;
      default:
        throw new Error('Invalid picker type');
    }
  };

  return (
    <Box
      display={isRange ? 'grid' : 'flex'}
      gridTemplateColumns="auto 1fr 1fr auto"
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        justifySelf="start"
        size="xsmall"
        variant="tertiary"
        onClick={handlePrevious}
        accessibilityLabel="Previous"
        icon={ArrowLeftIcon}
      />
      {isRange ? (
        <>
          <Text size="medium" weight="medium" marginRight="spacing.7" justifySelf="center">
            {month} {year}
          </Text>
          <Text size="medium" weight="medium" marginLeft="spacing.7" justifySelf="center">
            {nextMonth} {nextYear}
          </Text>
        </>
      ) : (
        <Box display="flex" gap="spacing.5" alignItems="center">
          <Button
            onClick={() => {
              onLevelChange('year');
            }}
            size="xsmall"
            variant="tertiary"
            iconPosition="right"
            icon={ChevronDownIcon}
          >
            {month}
          </Button>
          <Button
            onClick={() => {
              onLevelChange('decade');
            }}
            size="xsmall"
            variant="tertiary"
            iconPosition="right"
            icon={ChevronDownIcon}
          >
            {year}
          </Button>
        </Box>
      )}
      <Button
        justifySelf="end"
        size="xsmall"
        variant="tertiary"
        onClick={handleNext}
        accessibilityLabel="Next"
        icon={ArrowRightIcon}
      />
    </Box>
  );
};

export { CalendarHeader };
