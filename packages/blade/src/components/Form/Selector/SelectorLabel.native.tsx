// Selector* components are used in Checkbox/Radio
import React from 'react';
import styled from 'styled-components/native';
import type { SelectorLabelProps } from './types';
import { makeSpace } from '~utils';

const StyledSelectorLabel = styled.Pressable({
  display: 'flex',
  flexDirection: 'row',
  // TODO: We don't have 2px spacing token
  marginTop: makeSpace(2),
  marginBottom: makeSpace(2),
});

const SelectorLabel = ({ children, inputProps }: SelectorLabelProps): React.ReactElement => {
  return <StyledSelectorLabel {...inputProps}>{children}</StyledSelectorLabel>;
};

export { SelectorLabel };
