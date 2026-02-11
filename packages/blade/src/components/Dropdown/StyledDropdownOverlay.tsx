import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';

const StyledDropdownOverlay = styled(BaseBox)<{
  isInBottomSheet?: boolean;
}>((props) => {
  const { theme, isInBottomSheet } = props;

  return {
    backgroundColor: theme.colors.popup.background.gray.moderate,
    borderWidth: isInBottomSheet ? undefined : theme.border.width.thin,
    borderColor: theme.colors.popup.border.gray.moderate,
    borderStyle: isInBottomSheet ? undefined : 'solid',
    borderRadius: makeSize(theme.border.radius.large),
  };
});

export { StyledDropdownOverlay };
