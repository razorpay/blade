import styled from 'styled-components';
import { makeSize } from '~utils';

const Divider = styled.div(({ theme }) => {
  return {
    borderBottomWidth: makeSize(theme.border.width.thin),
    borderBottomStyle: 'solid',
    borderColor: theme.colors.surface.border.normal.lowContrast,
  };
});

export { Divider };
