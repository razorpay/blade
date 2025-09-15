import type { StyledComponent } from 'styled-components';
import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';

const StyledDropdownOverlay: StyledComponent<
  typeof BaseBox,
  any,
  {
    isInBottomSheet?: boolean;
  },
  never
> = styled(BaseBox)<{
  isInBottomSheet?: boolean;
}>((props) => {
  const { theme, isInBottomSheet } = props;

  return {
    backgroundColor: theme.colors.popup.background.subtle,
    borderWidth: isInBottomSheet ? undefined : theme.border.width.thin,
    borderColor: theme.colors.interactive.border.gray.faded,
    borderStyle: isInBottomSheet ? undefined : 'solid',
    borderRadius: makeSize(theme.border.radius.medium),
  };
});

export { StyledDropdownOverlay };
