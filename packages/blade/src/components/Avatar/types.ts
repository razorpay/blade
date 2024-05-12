import type { HTMLAttributeReferrerPolicy } from 'react';
import type { ButtonProps } from '~components/Button/Button';
import type { IconComponent } from '~components/Icons';

type AvatarGroupProps = {
  /**
   * Children elements representing the avatars to stack.
   */
  children: React.ReactNode;
  /**
   * The size of each avatar within the group. Propagates to all avatars.
   * @default "xsmall"
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * The maximum number of avatars to display before truncating.
   */
  maxCount?: number;
  testID?: string;
};

type AvatarProps = {
  /**
   * The size of the avatar.
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * The visual variant of the avatar.
   */
  variant?: 'circle' | 'square';
  /**
   * The color theme of the avatar.
   */
  color?: 'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
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
   * Custom image source for an image avatar.
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

type AvatarGroupContextType = Pick<AvatarGroupProps, 'size'>;

type StyledAvatarProps = {
  size: NonNullable<AvatarProps['size']>;
  variant: NonNullable<AvatarProps['variant']>;
  color: NonNullable<AvatarProps['color']>;
};

export type { AvatarGroupProps, AvatarProps, StyledAvatarProps, AvatarGroupContextType };
