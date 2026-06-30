/* eslint-disable @typescript-eslint/no-explicit-any */

// SafeSceneMap is no longer used since Tabs.native.tsx switched from
// react-native-tab-view to react-native-pager-view. Kept for backwards
// compatibility in case external code imports it directly.

import React from 'react';
import { logger } from '~utils/logger';

type SafeSceneProps = {
  route: { key: string };
  jumpTo?: (key: string) => void;
};

const SafeSceneComponent = React.memo(
  <T extends { component: React.ComponentType<any> } & SafeSceneProps>({
    component,
    ...rest
  }: T) => {
    if (!component) {
      logger({
        type: 'warn',
        moduleName: 'Tabs',
        message: `Unable to find TabPanel with value "${rest.route.key}"`,
      });
      return null;
    }
    return React.createElement(component, rest);
  },
);

const SafeSceneMap = <T,>(scenes: { [key: string]: React.ComponentType<T> }) => {
  return ({ route, jumpTo }: SafeSceneProps) => (
    <SafeSceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      jumpTo={jumpTo ?? (() => {})} // no-op fallback; jumpTo is unused in pager-view mode
    />
  );
};

export { SafeSceneMap };
