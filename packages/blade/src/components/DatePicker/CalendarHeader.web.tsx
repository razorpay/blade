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
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Button
        size="xsmall"
        variant="tertiary"
        onClick={handlePrevious}
        accessibilityLabel="Previous"
        icon={ArrowLeftIcon}
      />
      <Box flexShrink={0} display="flex" gap={isRange ? '190px' : 'spacing.4'} alignItems="center">
        {isRange ? (
          <>
            <Text>
              {month} {year}
            </Text>
            <Text>
              {nextMonth} {nextYear}
            </Text>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                onLevelChange('year');
              }}
              size="small"
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
              size="small"
              variant="tertiary"
              iconPosition="right"
              icon={ChevronDownIcon}
            >
              {year}
            </Button>
          </>
        )}
      </Box>
      <Button
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
