import { AppRegistry } from 'react-native';
import { getStorybookUI } from '@storybook/react-native';
import './storybook.requires';
const Storybook = getStorybookUI({
  // keeping in comments becuase this is not documented properly in the docs
  // theme: {
  //   backgroundColor: 'white',
  //   headerTextColor: 'black',
  //   labelColor: 'black',
  //   borderColor: '#e6e6e6',
  //   previewBorderColor: '#b3b3b3',
  //   buttonTextColor: '#999999',
  //   buttonActiveTextColor: '#444444',
  // },
});
import { name as appName } from '../../app.json';

AppRegistry.registerComponent(appName, () => Storybook);
