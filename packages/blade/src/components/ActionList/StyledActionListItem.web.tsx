import styled from 'styled-components';
import type { StyledActionListItemProps } from './getBaseActionListItemStyles';
import { getBaseActionListItemStyles } from './getBaseActionListItemStyles';
import Box from '~components/Box';

const StyledActionListItem = styled(Box)<StyledActionListItemProps>((props) => {
  return {
    ...getBaseActionListItemStyles(props),
    // Web-specific styles
    '&:hover': {
      backgroundColor:
        props.intent === 'negative'
          ? props.theme.colors.feedback.background.negative.lowContrast
          : props.theme.colors.brand.gray.a50.lowContrast,
    },
    '&.active-focus': {
      borderColor: props.isKeydownPressed ? props.theme.colors.brand.primary[300] : undefined,
    },
    '&[aria-selected=true]': {
      backgroundColor:
        props.selectionType === 'single' ? props.theme.colors.brand.primary[300] : undefined,
    },
  };
});

export { StyledActionListItem };
