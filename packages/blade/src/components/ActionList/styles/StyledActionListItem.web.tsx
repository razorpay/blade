import styled from 'styled-components';
import type { StyledActionListItemProps } from './getBaseActionListItemStyles';
import { getBaseActionListItemStyles } from './getBaseActionListItemStyles';
import BaseBox from '~components/Box/BaseBox';

const StyledActionListItem = styled(BaseBox)<StyledActionListItemProps>((props) => {
  return {
    ...getBaseActionListItemStyles(props),
    // fixes bug in web where the if rendered as a link it's messing the styles
    display: props.isVisible ? 'block' : 'none',
    // Web-specific styles
    '&:hover:not([aria-disabled=true])': {
      backgroundColor:
        props.intent === 'negative'
          ? props.theme.colors.interactive.background.negative.faded
          : props.theme.colors.interactive.background.gray.default,
    },
    '&.active-focus': {
      borderColor: props.isKeydownPressed
        ? props.theme.colors.surface.border.primary.muted
        : undefined,
    },
    '&[aria-selected=true]': {
      backgroundColor:
        props.selectionType === 'single'
          ? props.theme.colors.interactive.background.primary.faded
          : undefined,
    },
    '&[aria-selected=true]:hover': {
      backgroundColor: props.theme.colors.interactive.background.primary.fadedHighlighted,
    },
  };
});

export { StyledActionListItem };
