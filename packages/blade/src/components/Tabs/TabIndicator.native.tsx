/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { TabBarIndicatorProps } from 'react-native-tab-view';
import { TabBarIndicator as RNTabBarIndicator } from 'react-native-tab-view';
import { useTabsContext } from './TabsContext';
import { useTheme } from '~utils';

const TabIndicator = (props: TabBarIndicatorProps<any>): React.ReactElement => {
  const { theme } = useTheme();
  const { variant } = useTabsContext();
  const isFilled = variant === 'filled';
  return (
    <RNTabBarIndicator
      {...props}
      width="auto"
      getTabWidth={(index) => {
        if (!isFilled) return props.getTabWidth(index);
        if (index === props.navigationState.routes.length - 1) {
          return props.getTabWidth(index) - theme.spacing[2] * 3;
        }
        return props.getTabWidth(index);
      }}
      style={{
        ...(isFilled
          ? {
              height: props.layout.height - theme.border.width.thick - theme.spacing[2] * 2,
              left: theme.spacing[2],
              bottom: theme.spacing[2],
              backgroundColor: theme.colors.brand.primary[300],
              borderRadius: theme.border.radius.small,
            }
          : {
              height: theme.border.width.thick,
              backgroundColor: theme.colors.brand.primary[500],
            }),
      }}
    />
  );
};

export { TabIndicator };
