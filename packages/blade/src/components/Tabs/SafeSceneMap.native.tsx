/* eslint-disable @typescript-eslint/no-explicit-any */

// Copy of SceneMap component with an additional check for null component,
// So we don't get runtime error if a TabPanel doesn't exist, instead it throws an warning
// https://github.com/react-navigation/react-navigation/blob/main/packages/react-native-tab-view/src/SceneMap.tsx

import React from 'react';
import type { SceneRendererProps } from 'react-native-tab-view/src/types';
import { logger } from '~utils/logger';

type SafeSceneProps = {
  route: any;
} & Omit<SceneRendererProps, 'layout'>;

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
  return ({ route, jumpTo, position }: SafeSceneProps) => (
    <SafeSceneComponent
      key={route.key}
      component={scenes[route.key]}
      route={route}
      jumpTo={jumpTo}
      position={position}
    />
  );
};

export { SafeSceneMap };
