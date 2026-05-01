import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BladeProvider } from '../../src/components/BladeProvider';
import { bladeTheme } from '../../src/tokens/theme';
import { view } from './storybook.requires';

import { name as appName } from '../../app.json';

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
  },
});

const App = () => {
  return (
    <BladeProvider themeTokens={bladeTheme}>
      <StorybookUIRoot />
    </BladeProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);
