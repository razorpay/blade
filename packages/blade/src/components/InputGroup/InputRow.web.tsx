import React from 'react';
import styled from 'styled-components';
import type { InputRowProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const StyledInputRow = styled.div<{ $templateColumns: string }>`
  display: grid;
  grid-template-columns: ${(props) => props.$templateColumns};
`;

// Helper function to recursively add _inputPosition to all children
const addInputPositionToChildren = (
  children: React.ReactNode,
  inputPosition: { row: string; col: string },
): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const clonedChild = React.cloneElement(child, {
        _inputPosition: inputPosition,
      } as Record<string, unknown>);

      if (child.props.children) {
        const clonedChildren = addInputPositionToChildren(child.props.children, inputPosition);
        return React.cloneElement(clonedChild, {
          children: clonedChildren,
        } as Record<string, unknown>);
      }

      return clonedChild;
    }
    return child;
  });
};

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
          const _colPosition =
            childCount === 1
              ? 'only'
              : colIndex === 0
              ? 'first'
              : colIndex === childCount - 1
              ? 'last'
              : 'middle';

          const inputPosition = {
            row: _rowPosition,
            col: _colPosition,
          };

          return addInputPositionToChildren(child, inputPosition);
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
