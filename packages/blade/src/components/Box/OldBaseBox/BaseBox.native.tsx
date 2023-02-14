import styled from 'styled-components/native';
import type { BaseBoxProps } from './types';
import getBaseBoxStyles from './getBaseBoxStyles';

const BaseBox = styled.View<BaseBoxProps>(getBaseBoxStyles);

export default BaseBox;
