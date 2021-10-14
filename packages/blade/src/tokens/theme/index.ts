import type { ColorSchemeNamesInput } from './theme.d';

export { default as paymentTheme } from './paymentTheme';
export { default as bankingTheme } from './bankingTheme';
export { default as overrideTheme } from './overrideTheme';
export {
  ColorSchemeNames,
  ColorSchemeNamesInput,
  Shadows,
  ColorsWithModes,
  ThemeTokens,
} from './theme.d';
// export type { Theme } from './theme.d';
export const colorSchemeNamesInput: ColorSchemeNamesInput[] = ['light', 'dark', 'system'];
