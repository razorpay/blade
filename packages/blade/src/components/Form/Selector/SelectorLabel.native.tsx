// Selector* components are used in Checkbox/Radio
import React from 'react';
import styled from 'styled-components/native';
import type { SelectorLabelProps } from './types';
import { metaAttribute } from '~utils/metaAttribute';
import { makeSpace } from '~utils/makeSpace';

const StyledSelectorLabel = styled.Pressable(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: makeSpace(theme.spacing[1]),
  marginBottom: makeSpace(theme.spacing[1]),
}));

const SelectorLabel = ({
  children,
  inputProps,
  testID,
}: SelectorLabelProps): React.ReactElement => {
  return (
    <StyledSelectorLabel {...inputProps} {...metaAttribute({ testID })}>
      {children}
    </StyledSelectorLabel>
  );
};

export { SelectorLabel };
