// Selector* components are used in Checkbox/Radio
import React from 'react';
import styled from 'styled-components/native';
import type { SelectorLabelProps } from './SelectorLabel.d';

const StyledSelectorLabel = styled.Pressable({
  display: 'flex',
  flexDirection: 'row',
});

const SelectorLabel = ({ children, inputProps }: SelectorLabelProps): React.ReactElement => {
  return <StyledSelectorLabel {...inputProps}>{children}</StyledSelectorLabel>;
};

export { SelectorLabel };
