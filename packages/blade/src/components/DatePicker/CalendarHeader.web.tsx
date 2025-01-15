/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { CalendarLevel as MantineCalendarLevel } from '@mantine/dates';
import dayjs from 'dayjs';
import { useI18nContext } from '@razorpay/i18nify-react';
import type { PickerType, DateValue, DatesRangeValue } from './types';
import { convertIntlToDayjsLocale } from './utils';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '~components/Icons';
import { Link } from '~components/Link';

type CalendarHeaderProps = {
  isRange: boolean;
  date: DateValue | DatesRangeValue;
  pickerType: PickerType;
  showLevelChangeLink?: boolean;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  onNextYear: () => void;
  onPreviousYear: () => void;
  onNextDecade: () => void;
  onPreviousDecade: () => void;
  onLevelChange: (level: MantineCalendarLevel) => void;
};
const CalendarLevelIndicator = ({
  onClick,
  showLevelChangeLink,
  accessibilityLabel,
  text,
}: {
  onClick: () => void;
  showLevelChangeLink?: boolean;
  accessibilityLabel: string;
  text: string;
}): React.ReactElement => {
  return showLevelChangeLink ? (
    <Link
      onClick={onClick}
      size="large"
      variant="button"
      color="neutral"
      iconPosition="right"
      icon={ChevronDownIcon}
      accessibilityLabel={accessibilityLabel}
    >
      {text}
    </Link>
  ) : (
    <Text size="large" weight="medium" color="interactive.text.neutral.normal">
      {text}
    </Text>
  );
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
  showLevelChangeLink,
}: CalendarHeaderProps & {
  showLevelChangeLink?: boolean;
}): React.ReactElement => {
  const { i18nState } = useI18nContext();
  const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');

  const month = dayjs(date as Date)
    .locale(locale)
    .format('MMMM');
  const year = dayjs(date as Date)
    .locale(locale)
    .format('YYYY');
  const currentYear = dayjs(date as Date).year();
  const startYearOfDecade = Math.floor(currentYear / 10) * 10;
  const endYearOfDecade = startYearOfDecade + 9;
  const nextMonth = dayjs(date as Date)
    .locale(locale)
    .add(1, 'month')
    .format('MMMM');
  const nextYear = dayjs(date as Date)
    .locale(locale)
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
      gridTemplateColumns={{ base: 'auto  1fr auto', m: 'auto 1fr 1fr auto' }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Button
        justifySelf="start"
        size="small"
        variant="tertiary"
        onClick={handlePrevious}
        accessibilityLabel="Previous"
        icon={ChevronLeftIcon}
      />
      {isRange ? (
        <>
          <Text
            display={{ base: 'none', m: 'block' }}
            size="large"
            weight="medium"
            marginRight="spacing.7"
            justifySelf="center"
          >
            {month} {year}
          </Text>
          <Text
            display={{ base: 'none', m: 'block' }}
            size="large"
            weight="medium"
            marginLeft="spacing.7"
            justifySelf="center"
          >
            {nextMonth} {nextYear}
          </Text>
          <Text
            display={{ base: 'block', m: 'none' }}
            size="large"
            weight="medium"
            justifySelf="center"
          >
            {month} {year}
          </Text>
        </>
      ) : (
        <Box display="flex" gap="spacing.5" alignItems="center">
          {pickerType === 'day' && (
            <CalendarLevelIndicator
              onClick={() => onLevelChange('year')}
              showLevelChangeLink={showLevelChangeLink}
              accessibilityLabel="Change month"
              text={`${month} ${year}`}
            />
          )}

          {pickerType === 'month' && (
            <CalendarLevelIndicator
              onClick={() => onLevelChange('decade')}
              showLevelChangeLink={showLevelChangeLink}
              accessibilityLabel="Change decade"
              text={year}
            />
          )}
          {pickerType === 'year' && (
            <Text size="large" weight="medium" color="interactive.text.neutral.normal">
              {startYearOfDecade} - {endYearOfDecade}
            </Text>
          )}
        </Box>
      )}
      <Button
        justifySelf="end"
        size="small"
        variant="tertiary"
        onClick={handleNext}
        accessibilityLabel="Next"
        icon={ChevronRightIcon}
      />
    </Box>
  );
};

export { CalendarHeader };
