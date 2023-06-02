import { Platform } from 'react-native';
import type { FontFamily } from './types';

export const fontFamily: FontFamily = {
  text: 'Lato',
  code: Platform.OS === 'ios' ? 'Courier' : 'monospace',
};
