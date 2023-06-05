import styled from 'styled-components/native';
import { getDividerStyles } from './getDividerStyles';

const Divider = styled.View(({ theme }) => {
  return getDividerStyles(theme);
});

export { Divider };
