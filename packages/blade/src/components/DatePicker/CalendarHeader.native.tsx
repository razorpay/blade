/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { CalendarLevel as MantineCalendarLevel } from '@mantine/dates';
import dayjs from 'dayjs';
import { useI18nContext } from '@razorpay/i18nify-react';
import type { PickerType } from './types';
import { convertIntlToDayjsLocale } from './utils';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { throwBladeError } from '~utils/logger';

type CalendarHeaderProps = {
  date: Date;
  pickerType: PickerType;
  isRange?: boolean;
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

/**
 * Native calendar header. Uses a flex row (instead of the web `display: grid`)
 * and always renders a single month label — native is always the "mobile"
 * single-column layout.
 */
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
}: CalendarHeaderProps): React.ReactElement => {
  const { i18nState } = useI18nContext();
  const locale = convertIntlToDayjsLocale(i18nState?.locale ?? 'en-IN');

  const month = dayjs(date).locale(locale).format('MMMM');
  const year = dayjs(date).locale(locale).format('YYYY');
  const currentYear = dayjs(date).year();
  const startYearOfDecade = Math.floor(currentYear / 10) * 10;
  const endYearOfDecade = startYearOfDecade + 9;

  const handleNext = (): void => {
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
        throwBladeError({
          message: 'Invalid picker type',
          moduleName: 'DatePicker',
        });
    }
  };

  const handlePrevious = (): void => {
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
        throwBladeError({
          message: 'Invalid picker type',
          moduleName: 'DatePicker',
        });
    }
  };

  return (
    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
      <Button
        size="small"
        variant="tertiary"
        onClick={handlePrevious}
        accessibilityLabel="Previous"
        icon={ChevronLeftIcon}
      />
      <Box display="flex" flexDirection="row" gap="spacing.5" alignItems="center">
        {pickerType === 'day' && (
          <CalendarLevelIndicator
            onClick={() => onLevelChange('year')}
            // Range DatePicker must not expose the month/year picker on native —
            // render the label as plain text (no caret / no press-to-open-picker).
            showLevelChangeLink={isRange ? false : showLevelChangeLink}
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
      <Button
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
