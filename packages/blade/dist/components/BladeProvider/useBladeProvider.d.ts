import { Theme } from './index';
import { ColorSchemeNames, ColorSchemeNamesInput, ThemeTokens } from '../../tokens/theme';
import { TypographyPlatforms } from '../../tokens/global';
type ThemeContextValue = {
    theme: Theme;
    colorScheme: ColorSchemeNames;
    setColorScheme: (colorScheme: ColorSchemeNamesInput) => void;
    platform: TypographyPlatforms;
};
/**
 * Reusable hook to be used in BladeProvider.native & BladeProvider.web file
 *
 * This hook processes incoming themeTokens & initialColorScheme
 * And validates & returns the theme values
 */
declare const useBladeProvider: ({ themeTokens, initialColorScheme, }: {
    themeTokens: ThemeTokens;
    initialColorScheme?: ColorSchemeNamesInput | undefined;
}) => {
    theme: Theme;
    themeContextValue: ThemeContextValue;
};
export { useBladeProvider };
