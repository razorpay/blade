import { ColorSchemeNames, ColorSchemeNamesInput } from '../../tokens/theme';
export type UseColorScheme = {
    colorScheme: ColorSchemeNames;
    setColorScheme: (colorScheme: ColorSchemeNamesInput) => void;
};
export declare const useColorScheme: (initialColorScheme?: ColorSchemeNamesInput) => UseColorScheme;
