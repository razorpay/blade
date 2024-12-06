import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI } from '@storybook/react-native';
import { BladeProvider } from '../../src/components/BladeProvider';
import { bladeTheme } from '../../src/tokens/theme';
import './storybook.requires';

import { name as appName } from '../../app.json';

const App = () => {
  const Storybook = getStorybookUI({
    shouldPersistSelection: true,
    // keeping in comments becuase this is not documented properly in the docs
    theme: {
      backgroundColor: bladeTheme.colors.onLight.surface.background.gray.subtle,
      // headerTextColor: 'black',
      // labelColor: 'black',
      // borderColor: '#e6e6e6',
      // previewBorderColor: '#b3b3b3',
      // buttonTextColor: '#999999',
      // buttonActiveTextColor: '#444444',
    },
  });

  return (
    <BladeProvider
      // key={`${context.globals.themeTokens}-${context.globals.colorScheme}`}
      themeTokens={bladeTheme}
    >
      <Storybook />
    </BladeProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);
