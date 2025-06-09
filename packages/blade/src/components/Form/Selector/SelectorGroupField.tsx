import React from 'react';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { AriaRoles } from '~utils/makeAccessible';
import { makeAccessible } from '~utils/makeAccessible';
import { getPlatformType, useBreakpoint } from '~utils';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useTheme } from '~components/BladeProvider';

type SelectorGroupFieldProps = {
  children: React.ReactNode;
  labelledBy: string;
  position?: 'top' | 'left';
  accessibilityRole?: AriaRoles;
  componentName: 'checkbox-group' | 'radio-group' | 'chip-group';
} & TestID &
  DataAnalyticsAttribute;

const SelectorGroupField = ({
  children,
  labelledBy,
  position,
  accessibilityRole = 'group',
  componentName,
  testID,
  ...props
}: SelectorGroupFieldProps): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isReactNative = getPlatformType() === 'react-native';

  let isLabelLeftPositioned = position === 'left' && matchedDeviceType === 'desktop';
  if (isReactNative) isLabelLeftPositioned = false;
  const role = accessibilityRole === 'group' && isReactNative ? undefined : accessibilityRole;

  return (
    <BaseBox
      display="flex"
      flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
      {...makeAccessible({
        role,
        labelledBy,
      })}
      {...metaAttribute({ name: componentName, testID })}
      {...makeAnalyticsAttribute(props)}
    >
      {children}
    </BaseBox>
  );
};

export { SelectorGroupField };
