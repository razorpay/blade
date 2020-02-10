import React from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure, addDecorator } from '@storybook/react-native';
import styled, { ThemeProvider } from 'styled-components';

import theme from '../../src/tokens/theme';
import './rn-addons';

// import stories
configure(() => {
  require('../../src/atoms/Button/Button.stories');
}, module);

// add decorators
const SpaceAround = styled.View`
  margin: 20px;
`;

addDecorator((Story) => (
  <ThemeProvider theme={theme}>
    <SpaceAround>
      <Story />
    </SpaceAround>
  </ThemeProvider>
));

// configure storybook
const StorybookUIRoot = getStorybookUI({
  asyncStorage: require('@react-native-community/async-storage').AsyncStorage,
});

// register app
AppRegistry.registerComponent('blade', () => StorybookUIRoot);

export default StorybookUIRoot;
