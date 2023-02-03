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
      // @TODO: ask designer for exact color here (couldn't figure out from figma)
      borderColor: props.theme.colors.brand.primary[300],
    },
    // @TODO: ask designer what happens on selected item's hover
    '&[aria-selected=true]': {
      backgroundColor:
        props.selectionType === 'single' ? props.theme.colors.brand.primary[300] : undefined,
    },
  };
});

export { StyledActionListItem };
