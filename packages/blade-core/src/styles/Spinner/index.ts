// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './spinner.module.css';

export {
  spinnerStyles,
  getSpinnerClasses,
  spinnerClass,
  spinnerBoxClass,
  spinnerIconClass,
} from './spinner';
export type { SpinnerVariants, SpinnerSize, SpinnerColor } from './spinner';
