import type { HTMLAttributeReferrerPolicy } from 'react';
import type React from 'react';
import type { ButtonProps } from '~components/Button/Button';
import type { IconComponent } from '~components/Icons';
import type { FeedbackColors } from '~tokens/theme/theme';

type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

type AvatarImgProps = {
  /**
   * Custom image source
   */
  src?: string;
  /**
   * The `alt` attribute for the `img` element
   */
  alt?: string;
  /**
   * The `srcSet` attribute for the `img` element, useful for responsive images.
   */
  srcSet?: string;
  /**
   * CORS settings attributes
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /**
   * Defines which referrer is sent when fetching the resource.
   */
  referrerPolicy?: HTMLAttributeReferrerPolicy;
};

type AvatarGroupProps = {
  /**
   * Children elements representing the avatars to stack.
   */
  children: React.ReactNode;
  /**
   * The size of each avatar within the group. Propagates to all avatars.
   * @default "xsmall"
   */
  size?: AvatarSize;
  /**
   * The maximum number of avatars to display before truncating.
   */
  maxCount?: number;
  testID?: string;
};

type AvatarCommonProps = {
  /**
   * The size of the avatar.
   * @default "xsmall"
   */
  size?: AvatarSize;
  /**
   * The visual variant of the avatar.
   * @default "circle"
   */
  variant?: 'circle' | 'square';
  /**
   * The color theme of the avatar.
   * @default "neutral"
   */
  color?: 'primary' | FeedbackColors;
  /**
   * Custom icon component to use as the avatar.
   */
  icon?: IconComponent;
  /**
   * The name of the avatar, used to generate initials.
   * If src has loaded, the name will be used as the alt attribute of the img. If src is not loaded, the name will be used to create the initials.
   */
  name?: string;
  /**
   * Automatically renders button with `a` tag with `href` on web
   */
  href?: ButtonProps['href'];
  /**
   * anchor target attribute
   *
   * Should only be used alongside `href`
   */
  target?: ButtonProps['target'];
  /**
   * anchor rel attribute
   *
   * Should only be used alongside `href`
   */
  rel?: ButtonProps['rel'];
  /**
   * Click handler for the avatar.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  testID?: string;
};

type AvatarProps = AvatarCommonProps & AvatarImgProps;

type AvatarButtonProps = AvatarCommonProps & {
  imgProps?: AvatarImgProps;
  children?: React.ReactNode;
  as?: 'a' | 'button';
  accessibilityProps?: Record<string, unknown>;
};

type AvatarGroupContextType = Pick<AvatarGroupProps, 'size'>;

type StyledAvatarProps = {
  size: NonNullable<AvatarProps['size']>;
  variant: NonNullable<AvatarProps['variant']>;
  color: NonNullable<AvatarProps['color']>;
};

export type {
  AvatarGroupProps,
  AvatarProps,
  StyledAvatarProps,
  AvatarGroupContextType,
  AvatarButtonProps,
};
