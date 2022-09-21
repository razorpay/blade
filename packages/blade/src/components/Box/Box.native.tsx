import styled from 'styled-components/native';
import type { BoxProps } from './types';
import getBoxStyles from './getBoxStyles';

const Box = styled.View<BoxProps>(getBoxStyles);

export default Box;
