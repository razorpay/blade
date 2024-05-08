import React from 'react';
import type { CSSObject } from 'styled-components';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~utils/types';
import type { AriaRoles } from '~utils/makeAccessible';
import { makeAccessible } from '~utils/makeAccessible';
import { getPlatformType } from '~utils';

type SelectorGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
  position?: 'top' | 'left';
  accessibilityRole?: AriaRoles;
  componentName: 'checkbox-group' | 'radio-group' | 'chip-group';
} & TestID;

const SelectorGroupField = ({
  children,
  labelledBy,
  position,
  accessibilityRole = 'group',
  componentName,
  testID,
}: SelectorGroupFieldProps): React.ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';
  let labelPosition: CSSObject['flexDirection'] = position === 'top' ? 'column' : 'row';
  if (isReactNative) labelPosition = 'column';
  const role = accessibilityRole === 'group' && isReactNative ? undefined : accessibilityRole;

  return (
    <BaseBox
      display="flex"
      flexDirection={labelPosition}
      {...makeAccessible({
        role,
        labelledBy,
      })}
      {...metaAttribute({ name: componentName, testID })}
    >
      {children}
    </BaseBox>
  );
};

export { SelectorGroupField };
