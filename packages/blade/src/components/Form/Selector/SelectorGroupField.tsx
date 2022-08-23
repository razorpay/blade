import React from 'react';
import type { CSSObject } from 'styled-components';
import type { AriaRoles } from '~utils';
import { getPlatformType, makeAccessible } from '~utils';
import Box from '~components/Box';

type SelectorGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
  position?: 'top' | 'left';
  accessibilityRole?: AriaRoles;
};

const SelectorGroupField = ({
  children,
  labelledBy,
  position,
  accessibilityRole = 'group',
}: SelectorGroupFieldProps): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';
  let labelPosition: CSSObject['flexDirection'] = position === 'top' ? 'column' : 'row';
  if (isReactNative) labelPosition = 'column';
  const role = accessibilityRole === 'group' && isReactNative ? undefined : accessibilityRole;

  return (
    <Box
      display="flex"
      flexDirection={labelPosition}
      {...makeAccessible({
        role,
        labelledBy,
      })}
    >
      {children}
    </Box>
  );
};

export { SelectorGroupField };
