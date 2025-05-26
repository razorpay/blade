import React from 'react';
import styled from 'styled-components';
import type { InputRowProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const StyledInputRow = styled.div<{ $templateColumns: string }>`
  display: grid;
  grid-template-columns: ${(props) => props.$templateColumns};
`;

export const _InputRow = ({
  templateColumns = '1fr',
  children,
  testID,
  _rowPosition = 'only',
}: InputRowProps): JSX.Element => {
  const childCount = React.Children.count(children);

  return (
    <StyledInputRow $templateColumns={templateColumns} data-testid={testID}>
      {React.Children.map(children, (child, colIndex) => {
        if (React.isValidElement(child)) {
          // Calculate column position
          const _colPosition =
            childCount === 1
              ? 'only'
              : colIndex === 0
              ? 'first'
              : colIndex === childCount - 1
              ? 'last'
              : 'middle';

          return React.cloneElement(child, {
            _inputPosition: {
              row: _rowPosition,
              col: _colPosition,
            },
          } as Record<string, unknown>);
        }
        return child;
      })}
    </StyledInputRow>
  );
};

const InputRow = assignWithoutSideEffects(React.forwardRef(_InputRow), {
  displayName: 'InputRow',
  componentId: 'InputRow',
});
export { InputRow };
