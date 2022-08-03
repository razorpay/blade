import styled from 'styled-components';
import getBaseInputStyles from './getBaseInputStyles';
import getTextStyles from '~components/Typography/Text/getTextStyles';

export const StyledBaseInput = styled.input((props) => ({
  ...getBaseInputStyles({ theme: props.theme }),
  '::placeholder': getTextStyles({
    size: 'medium',
    variant: 'body',
    type: 'placeholder',
    weight: 'regular',
    contrast: 'low',
    theme: props.theme,
  }),
  ':focus': {
    backgroundColor: props.theme.colors.brand.primary[300],
    borderBottomColor: props.theme.colors.brand.primary[500],
    outline: 'none',
  },
  borderTopStyle: 'hidden',
  borderLeftStyle: 'hidden',
  borderRightStyle: 'hidden',
  boxSizing: 'border-box',
}));
