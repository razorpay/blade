import { Platform } from 'react-native';
import type { FontFamily } from './types';

export const fontFamily: FontFamily = {
  text: 'Inter',
  heading: 'TASA Orbiter Display',
  code: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  // PT Serif is web-only for now (not bundled in the React Native fonts), so native keeps the heading font.
  serif: 'TASA Orbiter Display',
};
