import React from 'react';
import type { CSSObject } from 'styled-components';
import { metaAttribute, getPlatformType, makeAccessible, MetaConstants } from '~utils';
import Box from '~components/Box';
import type { AriaRoles } from '~utils';

type SelectorGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
  position?: 'top' | 'left';
  accessibilityRole?: AriaRoles;
  componentName: 'checkbox-group' | 'radio-group';
};

const SelectorGroupField = ({
  children,
  labelledBy,
  position,
  accessibilityRole = 'group',
  componentName,
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
      {...metaAttribute(MetaConstants.Component, componentName)}
    >
      {children}
    </Box>
  );
};

export { SelectorGroupField };
