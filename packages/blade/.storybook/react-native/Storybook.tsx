import { AppRegistry } from 'react-native';
import { getStorybookUI } from '@storybook/react-native';
import './storybook.requires';
const Storybook = getStorybookUI({});
import { name as appName } from '../../app.json';

AppRegistry.registerComponent(appName, () => Storybook);
