import { Platform } from 'react-native';

const fontFamily = {
  text: 'Lato',
  code: Platform.OS === 'ios' ? 'Courier' : 'monospace',
};

export default fontFamily;
