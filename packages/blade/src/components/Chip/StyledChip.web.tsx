import styled from 'styled-components';
import { getStyledChipStyles } from './getStyledChipStyles';
import type { StyledChipProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const StyledChip = styled(BaseBox)<StyledChipProps>((props) => ({
  ...getStyledChipStyles(props),
  width: 'fit-content',
}));

export { StyledChip };
