import styled from 'styled-components/native';
import { getStyledChipStyles } from './getStyledChipStyles';
import type { StyledChipProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledChip = styled(BaseBox)<StyledChipProps>((props) => ({
  ...getStyledChipStyles(props),
  alignSelf: 'center',
}));

export { StyledChip };
