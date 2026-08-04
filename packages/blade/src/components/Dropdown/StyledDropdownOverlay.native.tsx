import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize, makeSize } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';

// Web-only CSS properties (backdropFilter, borderTopStyle) are intentionally
// excluded here — they are invalid in React Native and crash Fabric/New Architecture.
// On web the menu's defined edge comes from the elevation drop-shadow combined with an inset
// border-shadow (see getPopupBoxShadowString). Native can't render inset box-shadows, and the web
// popup border token (popup.border.gray.subtle) is a ~9% opacity color that reads as invisible on a
// white surface. To make the native edge as clearly visible as web's perceived edge, we use a real
// 1px border with the standard opaque neutral border token.
const StyledDropdownOverlay = styled(BaseBox)<{
  isInBottomSheet?: boolean;
  colorScheme: ColorSchemeNames;
}>((props) => {
  const { theme } = props;
  return {
    backgroundColor: theme.colors.popup.background.gray.moderate,
    borderRadius: makeSize(theme.border.radius.medium),
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderStyle: 'solid',
    borderColor: theme.colors.surface.border.gray.normal,
  };
});

export { StyledDropdownOverlay };
