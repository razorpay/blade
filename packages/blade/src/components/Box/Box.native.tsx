import styled from 'styled-components/native';
import type { BoxProps } from './Box.d';
import getBoxStyles from './getBoxStyles';

const Box = styled.View<BoxProps>(getBoxStyles);

export default Box;
