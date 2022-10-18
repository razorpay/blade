// Selector* components are used in Checkbox/Radio
import React from 'react';
import styled from 'styled-components';
import type { SelectorLabelProps } from './types';
import { makeSpace } from '~utils';

const StyledSelectorLabel = styled.label(({ theme }) => ({
  display: 'flex',
  marginTop: makeSpace(theme.spacing[1]),
  marginBottom: makeSpace(theme.spacing[1]),
}));

const SelectorLabel = ({ children }: SelectorLabelProps): React.ReactElement => {
  return <StyledSelectorLabel>{children}</StyledSelectorLabel>;
};

export { SelectorLabel };
