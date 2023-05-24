// Selector* components are used in Checkbox/Radio
import React from 'react';
import styled from 'styled-components';
import type { SelectorLabelProps } from './types';
import { makeSpace, metaAttribute } from '~utils';

const StyledSelectorLabel = styled.label(({ theme }) => {
  return {
    display: 'flex',
    marginTop: makeSpace(theme.spacing[1]),
    marginBottom: makeSpace(theme.spacing[1]),
  };
});

const SelectorLabel = ({
  children,
  componentName,
  testID,
}: SelectorLabelProps): React.ReactElement => {
  return (
    <StyledSelectorLabel
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      {...metaAttribute({ name: componentName, testID })}
    >
      {children}
    </StyledSelectorLabel>
  );
};

export { SelectorLabel };
