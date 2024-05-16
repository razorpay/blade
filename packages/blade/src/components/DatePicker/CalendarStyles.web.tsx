/* eslint-disable @typescript-eslint/restrict-plus-operands */
import styled from 'styled-components';
import dayjs from 'dayjs';
import type { PickerType } from './types';
import BaseBox from '~components/Box/BaseBox';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { size } from '~tokens/global';
import { makeSpace } from '~utils';
import getIn from '~utils/lodashButBetter/get';
import { useIsMobile } from '~utils/useIsMobile';

const cell = {
  gap: {
    x: size[0],
    y: size[2],
  },
  size: {
    desktop: size[40],
    mobile: size[48],
  },
  background: {
    default: 'transparent',
    hover: 'interactive.background.gray.highlighted',
    disabled: 'transparent',
  },
  text: {
    default: 'interactive.text.gray.normal',
    disabled: 'interactive.text.gray.disabled',
  },
} as const;

const todayCell = {
  background: {
    default: 'transparent',
    hover: 'interactive.background.primary.faded',
  },
  border: {
    default: 'interactive.border.primary.default',
    hover: 'interactive.border.primary.default',
  },
  text: {
    default: 'interactive.text.primary.normal',
    hover: 'interactive.text.primary.normal',
  },
} as const;

const selectedCell = {
  background: {
    default: 'interactive.background.primary.default',
    hover: 'interactive.background.primary.highlighted',
  },
  border: {
    default: 'interactive.border.primary.default',
    hover: 'surface.border.primary.muted',
  },
  text: {
    default: 'interactive.text.onPrimary.normal',
    hover: 'interactive.text.onPrimary.normal',
  },
} as const;

const inRangeCell = {
  background: {
    default: 'surface.background.primary.subtle',
    hover: 'interactive.background.primary.faded',
  },
  border: {
    default: 'interactive.border.primary.default',
    hover: 'interactive.border.primary.default',
  },
  text: {
    default: 'interactive.text.primary.normal',
    hover: 'interactive.text.primary.normal',
  },
} as const;

const CalendarGradientStyles = styled(BaseBox)<{ date: Date; isRange: boolean }>(
  ({ theme, date, isRange }) => {
    const isMobile = useIsMobile();
    // Bail out if datepicker is not in range mode or on mobile
    if (isMobile || !isRange) return {};

    const cal1 = dayjs(date);
    const cal1FirstDay = cal1.startOf('month');
    const cal1LastDay = cal1.endOf('month');
    const cal1IsFirstDayStartOfTheWeek = cal1FirstDay.day() === 0;
    const cal1IsLastDayEndOfTheWeek = cal1LastDay.day() === 6;

    const cal2 = dayjs(date).add(1, 'month');
    const cal2FirstDay = cal2.startOf('month');
    const cal2LastDay = cal2.endOf('month');
    const cal2IsFirstDayStartOfTheWeek = cal2FirstDay.day() === 0;
    const cal2IsLastDayEndOfTheWeek = cal2LastDay.day() === 6;

    const calendar1FirstGradient = `${cal1.month()}-${cal1FirstDay.date()}`;
    const calendar1LastGradient = `${cal1.month()}-${cal1LastDay.date()}`;
    const calendar2FirstGradient = `${cal2.month()}-${cal2FirstDay.date()}`;
    const calendar2LastGradient = `${cal2.month()}-${cal2LastDay.date()}`;

    const gradientCell = {
      pointerEvents: 'none',
      position: 'relative',
      width: 'inherit',
      height: 'inherit',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    } as const;
    const gradientBefore = {
      content: '""',
      position: 'absolute',
      width: '100%',
      top: 0,
      bottom: 0,
      right: 0,
    } as const;
    const rightGradient = {
      ...gradientBefore,
      left: '-100%',
      background: `linear-gradient(to right, transparent, ${getIn(
        theme.colors,
        inRangeCell.background.default,
      )})`,
    };
    const leftGradient = {
      ...gradientBefore,
      left: '100%',
      background: `linear-gradient(to left, transparent, ${getIn(
        theme.colors,
        inRangeCell.background.default,
      )})`,
    };

    return {
      '.DatePicker-cell': {
        [`&[data-in-range]:not(&[data-first-in-range]) [data-date="${calendar1FirstGradient}"]`]: {
          ...gradientCell,
          '&:before': cal1IsFirstDayStartOfTheWeek ? {} : rightGradient,
        },
        [`&[data-in-range]:not(&[data-last-in-range]) [data-date="${calendar1LastGradient}"]`]: {
          ...gradientCell,
          '&:before': cal1IsLastDayEndOfTheWeek ? {} : leftGradient,
        },
        // Second calendar column
        [`&[data-in-range]:not(&[data-first-in-range]) [data-date="${calendar2FirstGradient}"]`]: {
          ...gradientCell,
          '&:before': cal2IsFirstDayStartOfTheWeek ? {} : rightGradient,
        },
        [`&[data-in-range]:not(&[data-last-in-range]) [data-date="${calendar2LastGradient}"]`]: {
          ...gradientCell,
          '&:before': cal2IsLastDayEndOfTheWeek ? {} : leftGradient,
        },
      },
    };
  },
);

const CalendarStyles = styled(BaseBox)<{ pickerType?: PickerType }>(({ theme, pickerType }) => {
  const isMobile = useIsMobile();
  const device = isMobile ? 'mobile' : 'desktop';
  const isDayPicker = pickerType === 'day';

  const today = {
    '&[data-today]': {
      position: 'relative',
      ':before': {
        content: '""',
        position: 'absolute',
        left: '50%',
        bottom: makeSpace(size[5]),
        transform: 'translate(-50%, -50%)',
        // TODO use icon level tokens
        backgroundColor: getIn(theme.colors, todayCell.text.default),
        width: makeSpace(theme.spacing[2]),
        height: makeSpace(theme.spacing[2]),
        borderRadius: theme.border.radius.max,
      },
    },
    '&[data-today]:hover': {
      backgroundColor: getIn(theme.colors, todayCell.background.hover),
      outlineColor: getIn(theme.colors, todayCell.border.hover),
      color: getIn(theme.colors, todayCell.text.hover),
    },
  } as const;

  const selected = {
    '&[data-selected]': {
      backgroundColor: getIn(theme.colors, selectedCell.background.default),
      outlineColor: getIn(theme.colors, selectedCell.border.default),
      color: getIn(theme.colors, selectedCell.text.default),
      ':before': {
        backgroundColor: getIn(theme.colors, selectedCell.text.default),
      },
    },
    '&[data-selected] [data-date]': {
      background: 'none !important',
    },
    '&[data-selected]:hover': {
      backgroundColor: getIn(theme.colors, selectedCell.background.hover),
      outlineColor: getIn(theme.colors, selectedCell.border.hover),
      color: getIn(theme.colors, selectedCell.text.hover),
    },
  } as const;

  const ranges = {
    '&[data-in-range]': {
      borderRadius: 0,
      backgroundColor: getIn(theme.colors, inRangeCell.background.default),
      outlineColor: getIn(theme.colors, inRangeCell.border.default),
      color: getIn(theme.colors, inRangeCell.text.default),
      position: 'relative',
    },
    '&[data-in-range]:hover': {
      backgroundColor: getIn(theme.colors, inRangeCell.background.hover),
      outlineColor: getIn(theme.colors, inRangeCell.border.hover),
      color: getIn(theme.colors, inRangeCell.text.hover),
    },
    '&[data-first-in-range]': {
      borderRadius: theme.border.radius.medium,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    '&[data-last-in-range]': {
      borderRadius: theme.border.radius.medium,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    '&[data-first-in-range][data-last-in-range]': {
      borderRadius: theme.border.radius.medium,
    },
  } as const;

  return {
    width: '100%',
    '.DatePicker-levelsGroup': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      gap: makeSpace(theme.spacing[8]),
      table: {
        borderCollapse: 'collapse',
        width: '100%',
      },
      '> div': { width: isMobile || !isDayPicker ? '100%' : undefined },
      th: {
        flex: 1,
      },
      tr: {
        marginBottom: makeSpace(cell.gap.y),
      },
      td: {
        flex: 1,
        padding: '0px !important',
      },
    },
    '.DatePicker-row': {
      textAlign: 'center',
      display: 'flex',
    },
    '.DatePicker-header': {
      display: 'none',
    },
    '.DatePicker-weekday': {
      ...getTextStyles({
        theme,
        variant: 'body',
        size: 'small',
        weight: 'medium',
        color: 'surface.text.gray.muted',
      }),
      paddingBottom: makeSpace(theme.spacing[4]),
    },
    '.DatePicker-cell': {
      cursor: 'pointer',
      width: isMobile || !isDayPicker ? '100%' : makeSpace(cell.size[device]),
      height: isDayPicker && isMobile ? undefined : makeSpace(cell.size[device]),
      aspectRatio: isDayPicker && isMobile ? '1 / 1' : undefined,
      borderRadius: theme.border.radius.medium,
      backgroundColor: getIn(theme.colors, cell.background.default),
      border: 'none',
      ...getTextStyles({ theme, variant: 'body', size: 'medium', weight: 'regular' }),

      '&:hover': {
        backgroundColor: getIn(theme.colors, cell.background.hover),
      },
      '&[data-disabled]': {
        color: getIn(theme.colors, cell.text.disabled),
        backgroundColor: getIn(theme.colors, cell.background.disabled),
        cursor: 'not-allowed',
      },
      '&[data-outside]': {
        color: theme.colors.interactive.text.gray.muted,
      },
      '&[data-outside]:hover': {
        color: getIn(theme.colors, cell.text.default),
      },
      ...ranges,
      ...today,
      ...selected,
    },
  };
});

export { CalendarStyles, CalendarGradientStyles };
