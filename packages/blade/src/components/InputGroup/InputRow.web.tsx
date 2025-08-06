import React from 'react';
import type { InputRowProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';

export const _InputRow = React.forwardRef<HTMLDivElement, InputRowProps>(
  ({ gridTemplateColumns = '1fr', children, testID }, ref): JSX.Element => {
    return (
      <BaseBox
        display="grid"
        gridTemplateColumns={gridTemplateColumns}
        data-testid={testID}
        className="__blade-input-row"
        ref={ref}
      >
        {children}
      </BaseBox>
    );
  },
);

const InputRow = assignWithoutSideEffects(_InputRow, {
  displayName: 'InputRow',
  componentId: 'InputRow',
});
export { InputRow };
