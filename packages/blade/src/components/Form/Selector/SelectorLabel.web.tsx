// Selector* components are used in Checkbox/Radio
import React from 'react';
import styled from 'styled-components';
import type { SelectorLabelProps } from './SelectorLabel.d';

const StyledSelectorLabel = styled.label({
  display: 'flex',
});

const SelectorLabel = ({ children }: SelectorLabelProps): React.ReactElement => {
  return <StyledSelectorLabel>{children}</StyledSelectorLabel>;
};

export { SelectorLabel };
