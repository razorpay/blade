import React from 'react';
import styled from 'styled-components';
import { Text } from '../Typography';

const StyledCheckboxHelpText = styled(Text)({
  margin: 0,
});

const CheckboxHelpText = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <StyledCheckboxHelpText contrast="low" type="muted" variant="caption">
      {children}
    </StyledCheckboxHelpText>
  );
};

export { CheckboxHelpText };
