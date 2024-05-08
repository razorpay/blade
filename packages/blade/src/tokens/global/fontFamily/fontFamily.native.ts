import { Platform } from 'react-native';
import type { FontFamily } from './types';

export const fontFamily: FontFamily = {
  text: 'Inter',
  heading: 'TASA Orbiter Display',
  code: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
};
