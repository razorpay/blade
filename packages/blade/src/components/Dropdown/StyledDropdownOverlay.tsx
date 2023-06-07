import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, isReactNative, makeSize } from '~utils';

const StyledDropdownOverlay = styled(BaseBox)((props) => {
  const { theme } = props;
  const isInBottomSheet = false;
  return {
    backgroundColor: theme.colors.surface.background.level2.lowContrast,
    borderWidth: isInBottomSheet ? undefined : theme.border.width.thin,
    borderColor: theme.colors.surface.border.normal.lowContrast,
    borderStyle: isInBottomSheet ? undefined : 'solid',
    borderRadius: makeSize(theme.border.radius.medium),
    boxShadow:
      isInBottomSheet || isReactNative() ? undefined : castWebType(theme.elevation.midRaised),
  };
});

export { StyledDropdownOverlay };
