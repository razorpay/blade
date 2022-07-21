import styled from 'styled-components';
import type { BoxProps } from './Box.d';
import getBoxStyles from './getBoxStyles';

const Box = styled.div<BoxProps>(getBoxStyles);

export default Box;
