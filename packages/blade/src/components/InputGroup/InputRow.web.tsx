import React from 'react';
import type { InputRowProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';

export const _InputRow = ({
  gridTemplateColumns = '1fr',
  children,
  testID,
}: InputRowProps): JSX.Element => {
  return (
    <BaseBox
      display="grid"
      gridTemplateColumns={gridTemplateColumns}
      data-testid={testID}
      className="__blade-input-row"
    >
      {children}
    </BaseBox>
  );
};

const InputRow = assignWithoutSideEffects(React.forwardRef(_InputRow), {
  displayName: 'InputRow',
  componentId: 'InputRow',
});
export { InputRow };
