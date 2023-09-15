import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';

const StyledDropdownOverlay = styled(BaseBox)<{
  isInBottomSheet?: boolean;
}>((props) => {
  const { theme, isInBottomSheet } = props;

  return {
    backgroundColor: theme.colors.surface.background.level2.lowContrast,
    borderWidth: isInBottomSheet ? undefined : theme.border.width.thin,
    borderColor: theme.colors.surface.border.normal.lowContrast,
    borderStyle: isInBottomSheet ? undefined : 'solid',
    borderRadius: makeSize(theme.border.radius.medium),
  };
});

export { StyledDropdownOverlay };
