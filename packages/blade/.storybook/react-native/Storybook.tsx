import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import { view } from './storybook.requires';
import { BladeProvider } from '../../src/components/BladeProvider';
import { bladeTheme } from '../../src/tokens/theme';

import { name as appName } from '../../app.json';

const App = () => {
  const Storybook = view.getStorybookUI({
    storage: {
      getItem: async (key: string) => {
        try {
          const { AsyncStorage } = require('@react-native-async-storage/async-storage');
          return AsyncStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          const { AsyncStorage } = require('@react-native-async-storage/async-storage');
          return AsyncStorage.setItem(key, value);
        } catch {
          return;
        }
      },
    },
    theme: {
      backgroundColor: bladeTheme.colors.onLight.surface.background.gray.subtle,
    },
  });

  return (
    <BladeProvider themeTokens={bladeTheme}>
      <Storybook />
    </BladeProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);
