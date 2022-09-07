import styled from 'styled-components';
import type { BoxProps } from './types';
import getBoxStyles from './getBoxStyles';

const Box = styled.div<BoxProps>(getBoxStyles);

export default Box;
