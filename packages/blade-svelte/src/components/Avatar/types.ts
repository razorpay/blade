import type { Snippet, Component } from 'svelte';
import type { StyledPropsBlade } from '@razorpay/blade-core/utils';
import type { IconProps } from '../Icons/types';

/**
 * Icon component type for Avatar
 */
export type IconComponent = Component<IconProps>;

/**
 * Avatar size options
 */
export type AvatarSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/**
 * Avatar shape variant
 */
export type AvatarVariant = 'circle' | 'square';

/**
 * Avatar color options
 */
export type AvatarColor =
  | 'primary'
  | 'positive'
  | 'negative'
  | 'notice'
  | 'information'
  | 'neutral';

/**
 * Avatar image-related props
 */
export type AvatarImgProps = {
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
  referrerPolicy?: ReferrerPolicy;
};

/**
 * Props for the Avatar component.
 *
 * An avatar component is a standardized visual representation of a user or entity.
 *
 * @example
 * ```svelte
 * <Avatar name="Nitin Kumar" src="https://avatars.githubusercontent.com/u/46647141?v=4" />
 * ```
 */
export type AvatarProps = {
  /**
   * The size of the avatar.
   * @default 'medium'
   */
  size?: AvatarSize;
  /**
   * The visual variant of the avatar.
   * @default 'circle'
   */
  variant?: AvatarVariant;
  /**
   * The color theme of the avatar.
   * @default 'neutral'
   */
  color?: AvatarColor;
  /**
   * Custom icon component to use as the avatar.
   */
  icon?: IconComponent;
  /**
   * The name of the avatar, used to generate initials.
   * If src has loaded, the name will be used as the alt attribute of the img.
   * If src is not loaded, the name will be used to create the initials.
   */
  name?: string;
  /**
   * Automatically renders avatar with `a` tag with `href` on web
   */
  href?: string;
  /**
   * Anchor target attribute.
   * Should only be used alongside `href`.
   */
  target?: string;
  /**
   * Anchor rel attribute.
   * Should only be used alongside `href`.
   */
  rel?: string;
  /**
   * Click handler for the avatar.
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * Whether the avatar is selected. Adds a thicker primary border.
   */
  isSelected?: boolean;
  /**
   * Custom icon component to render at bottom of the avatar.
   * Only accepts IconComponent.
   */
  bottomAddon?: IconComponent;
  /**
   * Custom snippet to render at top of the avatar.
   * Typically used with an Indicator component.
   *
   * Size mapping for Indicator:
   * - xsmall/small → 'small'
   * - medium/large → 'medium'
   * - xlarge → 'large'
   */
  topAddon?: Snippet;
  /**
   * Test ID for the element.
   */
  testID?: string;
  /**
   * Function called when the avatar loses focus.
   */
  onBlur?: (event: FocusEvent) => void;
  /**
   * Function called when the avatar gains focus.
   */
  onFocus?: (event: FocusEvent) => void;
  /**
   * Function called when the mouse leaves the avatar.
   */
  onMouseLeave?: (event: MouseEvent) => void;
  /**
   * Function called when the mouse moves over the avatar.
   */
  onMouseMove?: (event: MouseEvent) => void;
  /**
   * Function called when the mouse button is pressed on the avatar.
   */
  onMouseDown?: (event: MouseEvent) => void;
  /**
   * Function called when a pointer is pressed on the avatar.
   */
  onPointerDown?: (event: PointerEvent) => void;
  /**
   * Function called when a pointer enters the avatar.
   */
  onPointerEnter?: (event: PointerEvent) => void;
  /**
   * Function called when a touch starts on the avatar.
   */
  onTouchStart?: (event: TouchEvent) => void;
  /**
   * Function called when a touch ends on the avatar.
   */
  onTouchEnd?: (event: TouchEvent) => void;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
} & AvatarImgProps &
  StyledPropsBlade;

/**
 * Internal props for AvatarButton sub-component.
 */
export type AvatarButtonProps = {
  /**
   * The size of the avatar button.
   * @default 'medium'
   */
  size?: AvatarSize;
  /**
   * The visual variant of the avatar button.
   * @default 'circle'
   */
  variant?: AvatarVariant;
  /**
   * The color theme of the avatar button.
   * @default 'neutral'
   */
  color?: AvatarColor;
  /**
   * Custom icon component to use as the avatar.
   */
  icon?: IconComponent;
  /**
   * Image-related props for the avatar button.
   */
  imgProps?: AvatarImgProps;
  /**
   * Text content (initials or overflow count).
   */
  children?: string;
  /**
   * Automatically renders avatar with `a` tag with `href`
   */
  href?: string;
  /**
   * Anchor target attribute.
   */
  target?: string;
  /**
   * Anchor rel attribute.
   */
  rel?: string;
  /**
   * Click handler.
   */
  onClick?: (event: MouseEvent) => void;
  /**
   * Whether the avatar is selected.
   */
  isSelected?: boolean;
  /**
   * Function called when the avatar loses focus.
   */
  onBlur?: (event: FocusEvent) => void;
  /**
   * Function called when the avatar gains focus.
   */
  onFocus?: (event: FocusEvent) => void;
  /**
   * Function called when the mouse leaves.
   */
  onMouseLeave?: (event: MouseEvent) => void;
  /**
   * Function called when the mouse moves.
   */
  onMouseMove?: (event: MouseEvent) => void;
  /**
   * Function called when the mouse button is pressed.
   */
  onMouseDown?: (event: MouseEvent) => void;
  /**
   * Function called when a pointer is pressed.
   */
  onPointerDown?: (event: PointerEvent) => void;
  /**
   * Function called when a pointer enters.
   */
  onPointerEnter?: (event: PointerEvent) => void;
  /**
   * Function called when a touch starts.
   */
  onTouchStart?: (event: TouchEvent) => void;
  /**
   * Function called when a touch ends.
   */
  onTouchEnd?: (event: TouchEvent) => void;
};

/**
 * Props for the AvatarGroup component.
 *
 * The AvatarGroup component is used to group Avatars together.
 *
 * @example
 * ```svelte
 * <AvatarGroup>
 *   <Avatar name="Kamlesh Chandnani" />
 *   <Avatar name="Rama Krushna Behera" />
 * </AvatarGroup>
 * ```
 */
export type AvatarGroupProps = {
  /**
   * Children elements representing the avatars to stack.
   */
  children: Snippet;
  /**
   * The size of each avatar within the group. Propagates to all avatars.
   * @default 'medium'
   */
  size?: AvatarSize;
  /**
   * The maximum number of avatars to display before truncating.
   */
  maxCount?: number;
  /**
   * Test ID for the element.
   */
  testID?: string;
  /** Analytics data attributes. */
  [key: `data-analytics-${string}`]: string;
};

/**
 * Registration handle returned to a child Avatar from its AvatarGroup.
 * `isHidden` is reactive — it tracks the avatar's index against the group's `maxCount`.
 */
export type AvatarGroupRegistration = {
  readonly isHidden: boolean;
};

/**
 * Context type for AvatarGroup.
 */
export type AvatarGroupContextType = {
  size?: AvatarSize;
  /**
   * Each child Avatar calls this once during setup to claim an index in the group.
   * The returned registration's `isHidden` flips reactively based on `maxCount`.
   */
  register: () => AvatarGroupRegistration;
};
