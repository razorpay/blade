import styled from 'styled-components';
import type { StyledActionListItemProps } from './getBaseActionListItemStyles';
import { getBaseActionListItemStyles } from './getBaseActionListItemStyles';
import BaseBox from '~components/Box/BaseBox';

const StyledActionListItem = styled(BaseBox)<StyledActionListItemProps>((props) => {
  return {
    ...getBaseActionListItemStyles(props),
    // fixes bug in web where the if rendered as a link it's messing the styles
    display: 'block',
    // Web-specific styles
    '&:hover:not([aria-disabled=true])': {
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
