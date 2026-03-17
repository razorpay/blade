// Import CSS module to ensure it's processed by bundler
// PostCSS will process nesting and other transforms
import './avatar.module.css';

export {
  avatarWrapperStyles,
  getAvatarWrapperClasses,
  avatarButtonStyles,
  getAvatarButtonClasses,
  avatarGroupStyles,
  getAvatarGroupClasses,
  avatarIconSizeTokens,
  avatarTextSizeMapping,
  avatarToBottomAddonSize,
  avatarToIndicatorSize,
  getAvatarTemplateClasses,
  getTopAddonClass,
  getBottomAddonClass,
} from './avatar';
export type {
  AvatarWrapperVariants,
  AvatarButtonVariants,
  AvatarGroupVariants,
} from './avatar';
