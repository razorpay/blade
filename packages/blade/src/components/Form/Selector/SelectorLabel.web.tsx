// Selector* components are used in Checkbox/Radio
import React from 'react';
import styled from 'styled-components';
import type { SelectorLabelProps } from './SelectorLabel.d';
import { makeSpace } from '~utils';

const StyledSelectorLabel = styled.label({
  display: 'flex',
  // TODO: We don't have 2px spacing token
  marginTop: makeSpace(2),
  marginBottom: makeSpace(2),
});

const SelectorLabel = ({ children }: SelectorLabelProps): React.ReactElement => {
  return <StyledSelectorLabel>{children}</StyledSelectorLabel>;
};

export { SelectorLabel };
