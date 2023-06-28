import styled from 'styled-components';
import React from 'react';
import type { DividerProps, StyledDividerProps } from './types';
import { getDividerStyles, makeStyledDividerProps } from './getDividerStyles';

const StyledDivider = styled.div<StyledDividerProps>(
  ({ theme, orientation, type, variant, thickness, contrast }) =>
    getDividerStyles({ orientation, type, variant, thickness, contrast, theme }),
);

const Divider = (props: DividerProps): React.ReactElement => (
  <StyledDivider {...makeStyledDividerProps(props)} />
);

export { Divider };
