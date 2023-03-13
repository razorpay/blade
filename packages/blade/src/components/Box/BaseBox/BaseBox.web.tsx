import styled from 'styled-components';
import type { BaseBoxProps } from './types';
import getBaseBoxStyles from './getBaseBoxStyles';

const BaseBox = styled.div<BaseBoxProps>(getBaseBoxStyles);

export default BaseBox;
