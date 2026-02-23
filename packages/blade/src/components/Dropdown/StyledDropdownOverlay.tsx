import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeSize, getPopupBoxShadowString } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';

const StyledDropdownOverlay = styled(BaseBox)<{
  isInBottomSheet?: boolean;
  colorScheme: ColorSchemeNames;
}>((props) => {
  const { theme, isInBottomSheet, colorScheme } = props;
  return {
    backgroundColor: theme.colors.popup.background.gray.moderate,
    borderWidth: 'none',
    borderTopStyle: undefined,
    borderRadius: makeSize(theme.border.radius.medium),
    backdropFilter: `blur(${theme.backdropBlur.medium}px)`,
    boxShadow: isInBottomSheet ? undefined : getPopupBoxShadowString(theme, colorScheme),
  };
});

export { StyledDropdownOverlay };
