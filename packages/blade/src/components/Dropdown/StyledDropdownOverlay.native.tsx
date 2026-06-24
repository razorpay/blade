import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';
import type { ColorSchemeNames } from '~tokens/theme';

// Web-only CSS properties (borderWidth:'none', backdropFilter, borderTopStyle) are intentionally
// excluded here — they are invalid in React Native and crash Fabric/New Architecture.
const StyledDropdownOverlay = styled(BaseBox)<{
  isInBottomSheet?: boolean;
  colorScheme: ColorSchemeNames;
}>((props) => {
  const { theme } = props;
  return {
    backgroundColor: theme.colors.popup.background.gray.moderate,
    borderRadius: makeSize(theme.border.radius.medium),
  };
});

export { StyledDropdownOverlay };
