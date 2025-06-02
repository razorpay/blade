import React from 'react';
import styled from 'styled-components';
import type { InputRowProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const StyledInputRow = styled.div<{ $gridTemplateColumns: string }>`
  display: grid;
  grid-template-columns: ${(props) => props.$gridTemplateColumns};
`;

export const _InputRow = ({
  gridTemplateColumns = '1fr',
  children,
  testID,
}: InputRowProps): JSX.Element => {
  return (
    <StyledInputRow
      $gridTemplateColumns={gridTemplateColumns}
      data-testid={testID}
      className="input-row"
    >
      {children}
    </StyledInputRow>
  );
};

const InputRow = assignWithoutSideEffects(React.forwardRef(_InputRow), {
  displayName: 'InputRow',
  componentId: 'InputRow',
});
export { InputRow };
