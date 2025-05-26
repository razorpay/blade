import React from 'react';
import { InputRowProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren';
import { Box } from '~components/Box/Box';

export const _InputRow = ({
  templateColumns,
  children,
  testID,
  _rowPosition = 'only',
}: InputRowProps): JSX.Element => {
  useVerifyAllowedChildren({
    componentName: 'InputRow',
    children,
    allowedComponents: [
      'TextInput',
      'SearchInput',
      'PhoneNumberInput',
      'TextArea',
      'PasswordInput',
      'OTPInput',
    ],
  });
  const childCount = React.Children.count(children);

  return (
    <Box display="grid" gridTemplateColumns={templateColumns || '1fr'} data-testid={testID}>
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
          } as any);
        }
        return child;
      })}
    </Box>
  );
};

const InputRow = assignWithoutSideEffects(React.forwardRef(_InputRow), {
  displayName: 'InputRow',
  componentId: 'InputRow',
});
export { InputRow };
