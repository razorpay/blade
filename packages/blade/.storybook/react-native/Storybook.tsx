import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI } from '@storybook/react-native';
import { BladeProvider } from '../../src/components/BladeProvider';
import { paymentTheme, bankingTheme } from '../../src/tokens/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PortalProvider, PortalHost } from '@gorhom/portal';
import './storybook.requires';

import { name as appName } from '../../app.json';

const App = (): React.ReactElement => {
  const Storybook = getStorybookUI({
    shouldPersistSelection: true,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PortalProvider>
        <BladeProvider
          // key={`${context.globals.themeTokens}-${context.globals.colorScheme}`}
          themeTokens={paymentTheme}
        >
          <Storybook />
          <PortalHost name="BladeBottomSheetPortal" />
        </BladeProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent(appName, () => App);
