import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { castWebType, isReactNative } from '~utils';

type StyledActionListProps = {
  id?: string;
  isInBottomSheet?: boolean;
};

const getBaseActionListStyles = (props: StyledActionListProps & { theme: Theme }): CSSObject => {
  const { theme, isInBottomSheet } = props;

  return {
    borderWidth: isInBottomSheet ? undefined : theme.border.width.thin,
    borderColor: theme.colors.surface.border.gray.normal,
    borderStyle: isInBottomSheet ? undefined : 'solid',
    borderRadius: makeSize(theme.border.radius.medium),
    boxShadow:
      isInBottomSheet || isReactNative() ? undefined : castWebType(theme.elevation.midRaised),
  };
};

export type { StyledActionListProps };
export { getBaseActionListStyles };
