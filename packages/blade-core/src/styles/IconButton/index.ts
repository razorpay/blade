// Import CSS module to ensure it's processed by the bundler
import './iconButton.module.css';

export {
  iconButtonStyles,
  getIconButtonClasses,
  getIconButtonTemplateClasses,
  getIconButtonIconColorToken,
  highlightedButtonSizeMap,
} from './iconButton';
export type { IconButtonVariants, IconButtonEmphasis, IconButtonSize } from './iconButton';
