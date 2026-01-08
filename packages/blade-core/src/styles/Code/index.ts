// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './code.module.css';

export { codeStyles, getCodeClasses, getCodeFontSizeAndLineHeight, getCodeColor } from './code';
export type { CodeVariants, CodeSize, FontSize, LineHeight } from './code';
