import { classes, tableRow } from './tokens';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationToken } from '~utils/lodashButBetter/get';

import { makeMotionTime } from '~utils';
import getIn from '~utils/lodashButBetter/get';

const getTableRowBackgroundTransition = (theme: Theme): string => {
  const rowBackgroundTransition = `background-color ${makeMotionTime(
    getIn(theme.motion, tableRow.backgroundColorMotionDuration),
  )} ${getIn(theme.motion, tableRow.backgroundColorMotionEasing)}`;

  return rowBackgroundTransition;
};

const getTableActionsHoverStyles = ({
  hoverColor,
  theme,
  backgroundGradientColor,
}: {
  hoverColor: DotNotationToken<Theme['colors']>;
  backgroundGradientColor?: DotNotationToken<Omit<Theme['colors'], 'name'>>;
  theme: Theme;
}): React.CSSProperties => {
  const rowBackgroundTransition = getTableRowBackgroundTransition(theme);

  return {
    // Solid layer 1 background - should match the table background
    [`& .${classes.HOVER_ACTIONS}`]: {
      backgroundColor: 'transparent',
      transition: rowBackgroundTransition,
    },
    // Alpha layer 2 background - Stripped row background, Hover background in selected state, etc
    [`& .${classes.HOVER_ACTIONS_LAYER2}`]: {
      backgroundColor: 'transparent',
      transition: rowBackgroundTransition,
    },
    // Alpha layer 3 background - Hover, selection, active background
    [`& .${classes.HOVER_ACTIONS_LAYER3}`]: {
      background: `linear-gradient(90deg, transparent 0%, ${getIn(theme.colors, 'surface.background.gray.intense')} 10.08%, ${getIn(theme.colors, 'surface.background.gray.intense')} 100%)`,
      transition: rowBackgroundTransition,
    },
  };
};

export { getTableActionsHoverStyles, getTableRowBackgroundTransition };
