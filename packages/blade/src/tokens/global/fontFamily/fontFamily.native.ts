import { Platform } from 'react-native';
import type { FontFamily } from './types';

export const fontFamily: FontFamily = {
  text: 'Inter',
  heading: 'Tasa Orbiter',
  code: Platform.OS === 'ios' ? 'Courier' : 'monospace',
};
