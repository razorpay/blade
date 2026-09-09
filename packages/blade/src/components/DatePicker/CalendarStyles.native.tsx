import styled from 'styled-components/native';
import { Pressable, View } from 'react-native';
import getIn from '~utils/lodashButBetter/get';

type DayCellStyleProps = {
  isSelected?: boolean;
  isInRange?: boolean;
  isFirstInRange?: boolean;
  isLastInRange?: boolean;
  isDisabled?: boolean;
};

type ListCellStyleProps = {
  isSelected?: boolean;
  isDisabled?: boolean;
};

/**
 * Interactive day cell for the calendar day grid.
 * Selected / in-range / first / last states are driven by boolean props
 * (instead of the `data-*` selectors used on web) since React Native has no
 * class-name / attribute selector styling.
 */
const DayCell = styled(Pressable)<DayCellStyleProps>((props) => {
  const { theme, isSelected, isInRange, isFirstInRange, isLastInRange } = props;
  const smallRadius = theme.border.radius.small;
  const mediumRadius = theme.border.radius.medium;

  let backgroundColor = 'transparent';
  if (isSelected) {
    backgroundColor = getIn(theme.colors, 'interactive.background.primary.default');
  } else if (isInRange) {
    backgroundColor = getIn(theme.colors, 'interactive.background.gray.fadedHighlighted');
  }

  // Border radius: range edges are half-rounded, middle cells are square.
  let borderRadiusStyles: Record<string, number> = { borderRadius: smallRadius };
  if (isFirstInRange && isLastInRange) {
    borderRadiusStyles = { borderRadius: mediumRadius };
  } else if (isFirstInRange) {
    borderRadiusStyles = {
      borderTopLeftRadius: mediumRadius,
      borderBottomLeftRadius: mediumRadius,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    };
  } else if (isLastInRange) {
    borderRadiusStyles = {
      borderTopRightRadius: mediumRadius,
      borderBottomRightRadius: mediumRadius,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    };
  } else if (isInRange) {
    borderRadiusStyles = { borderRadius: 0 };
  }

  return {
    flex: 1,
    // NOTE: `aspectRatio` is intentionally NOT set here — `styled-components/native`
    // (css-to-react-native) mis-parses the numeric value as "1px". It is applied via an
    // inline `style` prop on the cell instead (see Calendar.native.tsx).
    alignItems: 'center',
    justifyContent: 'center',
    // Android clips border-radius bleed on the selected/in-range background
    overflow: 'hidden',
    backgroundColor,
    ...borderRadiusStyles,
  };
});

/**
 * Interactive cell for the month / year picker grids. Rendered three-per-row
 * (`width: 33.33%`) to replace the web CSS `grid-template-columns: repeat(3, 1fr)`.
 */
const ListCell = styled(Pressable)<ListCellStyleProps>((props) => {
  const { theme, isSelected } = props;

  return {
    width: '33.33%',
    paddingTop: theme.spacing[3],
    paddingBottom: theme.spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: theme.border.radius.small,
    backgroundColor: isSelected
      ? getIn(theme.colors, 'interactive.background.gray.fadedHighlighted')
      : 'transparent',
  };
});

/**
 * Small dot rendered under "today" — replaces the web `::before` pseudo element.
 */
const TodayDot = styled(View)<{ isSelected?: boolean }>((props) => {
  const { theme, isSelected } = props;
  const dotSize = theme.spacing[2];

  return {
    position: 'absolute',
    bottom: theme.spacing[2],
    width: dotSize,
    height: dotSize,
    borderRadius: theme.border.radius.max,
    backgroundColor: isSelected
      ? getIn(theme.colors, 'interactive.text.onPrimary.normal')
      : getIn(theme.colors, 'interactive.text.primary.normal'),
  };
});

export { DayCell, ListCell, TodayDot };
export type { DayCellStyleProps, ListCellStyleProps };
