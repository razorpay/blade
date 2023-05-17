import type { CSSObject } from 'styled-components';
import type { ActionListProps } from '../ActionList';
import type { Theme } from '~components/BladeProvider';
import { castWebType, isReactNative, makeSize } from '~utils';

type StyledActionListProps = {
  surfaceLevel: ActionListProps['surfaceLevel'];
  elevation?: number;
  id?: string;
  isInBottomSheet?: boolean;
};

const getBaseActionListStyles = (props: StyledActionListProps & { theme: Theme }): CSSObject => {
  const { theme, surfaceLevel = 2, isInBottomSheet } = props;

  const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;

  return {
    backgroundColor,
    borderWidth: isInBottomSheet ? undefined : theme.border.width.thin,
    borderColor: theme.colors.surface.border.normal.lowContrast,
    borderRadius: makeSize(theme.border.radius.medium),
    boxShadow:
      isInBottomSheet || isReactNative() ? undefined : castWebType(theme.shadows.midRaised),
  };
};

export { getBaseActionListStyles, StyledActionListProps };
