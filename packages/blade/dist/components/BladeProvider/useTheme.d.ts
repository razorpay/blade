import { Theme } from './';
import { UseColorScheme } from '../../utils/useColorScheme';
import { TypographyPlatforms } from '../../tokens/global';
export type ThemeContext = UseColorScheme & {
    theme: Theme;
    platform: TypographyPlatforms;
};
export declare const ThemeContext: import('react').Context<ThemeContext>;
declare const useTheme: () => ThemeContext;
export default useTheme;
