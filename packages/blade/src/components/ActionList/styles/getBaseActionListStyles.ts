import type { CSSObject } from 'styled-components';
import type { ActionListProps } from '../ActionList';
import type { Theme } from '~components/BladeProvider';
import { isReactNative, makeSize } from '~utils';

type StyledActionListProps = {
  surfaceLevel: ActionListProps['surfaceLevel'];
  elevation?: number;
  id?: string;
  isInBottomSheet?: boolean;
};

const getBaseActionListStyles = (props: StyledActionListProps & { theme: Theme }): CSSObject => {
  const { theme, surfaceLevel = 2, isInBottomSheet } = props;

  const shadowColor = theme.shadows.color.level[1];

  // @TODO: tokenize shadows and replace the logic here
  const elevation200 = `${makeSize(theme.shadows.offsetX.level[1])} ${makeSize(0)} ${makeSize(
    theme.shadows.blurRadius.level[1],
  )} 0px ${shadowColor}, ${makeSize(theme.shadows.offsetX.level[1])} ${makeSize(
    theme.shadows.offsetY.level[2],
  )} ${makeSize(theme.shadows.blurRadius.level[2])} 0px ${shadowColor}`;

  const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

  return {
    backgroundColor,
    borderWidth: isInBottomSheet ? undefined : theme.border.width.thin,
    borderColor: theme.colors.surface.border.normal.lowContrast,
    borderRadius: makeSize(theme.border.radius.medium),
    boxShadow: isInBottomSheet || isReactNative() ? undefined : elevation200,
  };
};

export { getBaseActionListStyles, StyledActionListProps };
