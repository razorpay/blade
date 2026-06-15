import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BladeProvider } from '../../src/components/BladeProvider';
import { bladeTheme } from '../../src/tokens/theme';
import { view } from './storybook.requires';

import { name as appName } from '../../app.json';

const App = () => {
  const Storybook = React.useMemo(
    () =>
      view.getStorybookUI({
        storage: {
          getItem: AsyncStorage.getItem,
          setItem: AsyncStorage.setItem,
        },
      }),
    [],
  );

  return (
    <BladeProvider themeTokens={bladeTheme}>
      <Storybook />
    </BladeProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);
