import React from 'react';
import type { InputRowProps } from './types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';

type ColumnSpec = { flex: number } | { width: number };

const parseGridTemplateColumns = (gridTemplateColumns: string): ColumnSpec[] => {
  const tokens = gridTemplateColumns.trim().split(/\s+/);
  return tokens.map((token) => {
    const frMatch = token.match(/^([\d.]+)fr$/);
    if (frMatch) {
      return { flex: parseFloat(frMatch[1]) };
    }
    const pxMatch = token.match(/^([\d.]+)px$/);
    if (pxMatch) {
      return { width: parseFloat(pxMatch[1]) };
    }
    return { flex: 1 };
  });
};

export const _InputRow = React.forwardRef<typeof BaseBox, InputRowProps>(
  ({ gridTemplateColumns = '1fr', children, testID }, ref): JSX.Element => {
    const specs = parseGridTemplateColumns(gridTemplateColumns);
    const childArray = React.Children.toArray(children);

    return (
      <BaseBox display="flex" flexDirection="row" ref={ref as never} testID={testID}>
        {childArray.map((child, index) => {
          const spec = specs[index] ?? { flex: 1 };
          const style: { flex?: number; width?: number } =
            'flex' in spec ? { flex: spec.flex } : { width: spec.width };

          return (
            <BaseBox key={index} style={style}>
              {child}
            </BaseBox>
          );
        })}
      </BaseBox>
    );
  },
);

const InputRow = assignWithoutSideEffects(_InputRow, {
  displayName: 'InputRow',
  componentId: 'InputRow',
});
export { InputRow };
