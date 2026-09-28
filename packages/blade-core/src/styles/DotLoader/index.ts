// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './dotLoader.module.css';

export {
  dotLoaderClass,
  dotLoaderLargeClass,
  getDotLoaderClasses,
  getDotLoaderTemplateClasses,
  DOT_LOADER_COLOR_CSS_VAR,
} from './dotLoader';
export type { DotLoaderSize } from './dotLoader';
