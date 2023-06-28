import styled from 'styled-components/native';
import { makeSize } from '~utils/makeSize';

const Divider = styled.View(({ theme }) => {
  return {
    borderBottomWidth: makeSize(theme.border.width.thin),
    borderBottomStyle: 'solid',
    borderColor: theme.colors.surface.border.normal.lowContrast,
  };
});

export { Divider };
