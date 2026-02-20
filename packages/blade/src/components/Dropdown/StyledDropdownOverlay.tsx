import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeSize } from '~utils';

const StyledDropdownOverlay = styled(BaseBox)<{
  isInBottomSheet?: boolean;
}>((props) => {
  const { theme, isInBottomSheet } = props;

  const dropshadow = castWebType(theme.elevation.midRaised);
  const innerShadow = `inset 0px 0px 0px 1px ${theme.colors.popup.border.gray.subtle}`;

  return {
    backgroundColor: theme.colors.popup.background.gray.moderate,
    borderWidth: 'none',
    borderTopWidth: isInBottomSheet ? undefined : theme.border.width.thin,
    borderColor: theme.colors.popup.border.gray.moderate,
    borderTopStyle: isInBottomSheet ? undefined : 'solid',
    borderRadius: makeSize(theme.border.radius.medium),
    backdropFilter: `blur(${theme.backdropBlur.medium}px)`,
    boxShadow: isInBottomSheet ? undefined : `${dropshadow}, ${innerShadow}`,
  };
});

export { StyledDropdownOverlay };
