import { ColorInput } from 'tinycolor2';
import { ThemeTokens } from './theme';
import { ColorChromaticScale } from '../global/colors';
/**
 * @param {Object} themeConfig - The brand color and overrides to apply to the theme
 * @param {string} themeConfig.brandColor - The brand color to use to generate the theme. Can be in hex, rgb, or hsl format.
 * @description
 * Creates a Blade Theme based on the custom brand color
 * @returns The Theme Tokens with the custom brand colors
 * @example
 * const { theme, brandColors } = createTheme({ brandColor: '#19BEA2'})
 **/
export declare const createTheme: ({ brandColor, }: {
    brandColor: ColorInput;
}) => {
    theme: ThemeTokens;
    brandColors: ColorChromaticScale;
};
