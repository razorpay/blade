/* eslint-disable @typescript-eslint/restrict-plus-operands */
import styled from 'styled-components';
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
  },
  text: {
    default: 'interactive.text.gray.normal',
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
      table: {
        borderCollapse: 'collapse',
        width: '100%',
      },
      '> div': { width: isMobile ? '100%' : undefined },
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
      width: isMobile ? '100%' : makeSpace(cell.size[device]),
      height: isDayPicker && isMobile ? undefined : makeSpace(cell.size[device]),
      aspectRatio: isDayPicker && isMobile ? '1 / 1' : undefined,
      borderRadius: theme.border.radius.medium,
      backgroundColor: getIn(theme.colors, cell.background.default),
      border: 'none',
      ...getTextStyles({ theme, variant: 'body', size: 'medium', weight: 'regular' }),

      '&:hover': {
        backgroundColor: getIn(theme.colors, cell.background.hover),
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

export { CalendarStyles };
