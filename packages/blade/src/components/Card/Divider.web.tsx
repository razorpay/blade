import styled from 'styled-components';
import { getDividerStyles } from './getDividerStyles';

const Divider = styled.div(({ theme }) => {
  return getDividerStyles(theme);
});

export { Divider };
