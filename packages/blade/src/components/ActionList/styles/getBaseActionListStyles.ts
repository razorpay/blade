import type { CSSObject } from 'styled-components';
import type { ActionListProps } from '../ActionList';
import type { Theme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { castWebType, isReactNative } from '~utils';

type StyledActionListProps = {
  surfaceLevel: ActionListProps['surfaceLevel'];
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
    borderStyle: isInBottomSheet ? undefined : 'solid',
    borderRadius: makeSize(theme.border.radius.medium),
    boxShadow:
      isInBottomSheet || isReactNative() ? undefined : castWebType(theme.elevation.midRaised),
  };
};

export { getBaseActionListStyles, StyledActionListProps };
