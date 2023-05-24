import React from 'react';
import type { CSSObject } from 'styled-components';
import { metaAttribute, getPlatformType } from '~utils';
import BaseBox from '~components/Box/BaseBox';
import type { AriaRoles } from '~utils';
import type { TestID } from '~src/_helpers/types';
import { makeAccessible } from '~utils/makeAccessible';

type SelectorGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
  position?: 'top' | 'left';
  accessibilityRole?: AriaRoles;
  componentName: 'checkbox-group' | 'radio-group';
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
