import React from 'react';
import type { CSSObject } from 'styled-components';
import { getPlatformType, makeAccessible } from '~utils';
import Box from '~components/Box';

type SelectorGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
  position?: 'top' | 'left';
};

const SelectorGroupField = ({
  children,
  labelledBy,
  position,
}: SelectorGroupFieldProps): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';
  let labelPosition: CSSObject['flexDirection'] = position === 'top' ? 'column' : 'row';
  if (isReactNative) labelPosition = 'column';

  return (
    <Box
      display="flex"
      flexDirection={labelPosition}
      {...makeAccessible({ role: 'group', labelledBy })}
    >
      {children}
    </Box>
  );
};

export { SelectorGroupField };
