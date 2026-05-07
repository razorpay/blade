// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './baseLink.module.css';

export {
  baseLinkStyles,
  getBaseLinkClasses,
  getBaseLinkContentClasses,
  getBaseLinkTemplateClasses,
  baseLinkContentClass,
  baseLinkIconClass,
  getLinkColorToken,
  getLinkTextSizes,
  getLinkIconSizeMap,
} from './baseLink';
export type {
  BaseLinkVariants,
  LinkColor,
  LinkVariant,
  ActionStatesType,
  ColorType,
} from './baseLink';
