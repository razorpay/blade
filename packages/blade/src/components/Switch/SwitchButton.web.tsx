import styled from 'styled-components';
import { makeSpace } from '~utils';

const SwitchButton = styled.button(({ theme }) => {
  return {
    appearance: 'none',
    border: 'none',
    backgroundColor: 'none',
    borderRadius: theme.border.radius.max,
    padding: 0,
    margin: makeSpace(theme.spacing[1]),
    '&:focus': {
      // TODO: Replace with focus outline token
      outline: '1px solid white',
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    },
  };
});

export { SwitchButton };
