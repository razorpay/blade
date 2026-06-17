import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('RnWebApp', () => App);
AppRegistry.runApplication('RnWebApp', {
  rootTag: document.getElementById('root'),
});
