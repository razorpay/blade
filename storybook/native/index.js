import React from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure, addDecorator } from '@storybook/react-native';
import { ThemeProvider } from 'styled-components';
import SpaceAround from '../../src/decorators/SpaceAround/SpaceAround.native';

import './rn-addons';

const theme = {};

// import stories
configure(() => {
  require('../../src/atoms/Button/Button.stories');
}, module);

addDecorator((Story) => (
  <ThemeProvider theme={theme}>
    <SpaceAround>
      <Story />
    </SpaceAround>
  </ThemeProvider>
));

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({});

// If you are using React Native vanilla write your app name here.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent('blade', () => StorybookUIRoot);

export default StorybookUIRoot;
