import type { GestureResponderEvent } from 'react-native';
import React from 'react';
import BaseButton from '../BaseButton';
import type { BaseButtonProps } from '../BaseButton/BaseButton';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import type {
  BladeElementRef,
  DataAnalyticsAttribute,
  StringChildrenType,
  TestID,
} from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeCommonEvents } from '~components/types';
import type { AriaRoles } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { ButtonRayVariant } from '~components/Spark/ButtonRay';

type ButtonCommonProps = {
  /**
   * Automatically renders button with `a` tag with `href` on web
   */
  href?: BaseButtonProps['href'];
  /**
   * anchor target attribute
   *
   * Should only be used alongside `href`
   */
  target?: BaseButtonProps['target'];
  /**
   * anchor rel attribute
   *
   * Should only be used alongside `href`
   */
  rel?: BaseButtonProps['rel'];
  variant?: 'primary' | 'secondary' | 'tertiary';
  /**
   * Color of the button.
   *
   * `neutral` is a filled, high-contrast button: black on light themes and white on dark
   * themes. It is only available with `variant="primary"`, and not on `ButtonGroup`.
   */
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'neutral';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  accessibilityLabel?: string;
  type?: 'button' | 'reset' | 'submit';

  /**
   * It is exposed for internal usage with tooltip.
   *
   * @private
   */
  'aria-describedby'?: string;
  /**
   * It is exposed for internal usage with menu.
   *
   * @private
   */
  'aria-controls'?: string;
  /**
   * It is exposed for internal usage with menu.
   *
   * @private
   */
  'aria-expanded'?: boolean;
  /**
   * It is exposed for internal usage with menu.
   *
   * @private
   */
  'aria-haspopup'?: 'menu';
  /**
   * It is exposed for internal usage with menu.
   *
   * @private
   */
  role?: AriaRoles;
  tabIndex?: BaseButtonProps['tabIndex'];
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
} & TestID &
  StyledPropsBlade &
  DataAnalyticsAttribute &
  BladeCommonEvents &
  Platform.Select<{
    web: {
      /**
       * RazorSense plays on the button while it's hovered (follows the color scheme). Only for `variant="primary"` with
       * `color="neutral"`, at any size: on any other Button it throws in development. In a ButtonGroup the group's variant and
       * color decide, and where it renders the button as another one, or on a full-width button, the button keeps its own
       * hover (with a development warning).
       *
       * **Only available on web**
       *
       * @default false
       */
      hasRazorSense?: boolean;
      /**
       * On hover (follows the color scheme): RazorSense and a text wash, and the button widens to the right for Ray, who plays
       * `rayVariant` for as long as the pointer stays. Only for `variant="secondary"` (on another Button it throws in
       * development), at any size (it all scales with the button's height), on a labelled button that can widen: in a
       * ButtonGroup, full width or icon-only it gives way and the button keeps its own hover (with a development warning).
       * Give it room to its right (its own width, not stretched or held by its container).
       *
       * **Only available on web**
       *
       * @default false
       */
      hasRay?: boolean;
      /**
       * Which Ray `hasRay` plays (only with `hasRay`; alone it does nothing and warns in development). `investigate`: he whips
       * out his magnifying glass and searches (an investigating action). More
       * variants will follow.
       *
       * **Only available on web**
       *
       * @default 'investigate'
       */
      rayVariant?: ButtonRayVariant;
    };
    native: {
      hasRazorSense?: undefined;
      hasRay?: undefined;
      rayVariant?: undefined;
    };
  }>;

/*
  Mandatory children prop when icon is not provided
  */
type ButtonWithoutIconProps = ButtonCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
};

/*
   Optional children prop when icon is provided
  */
type ButtonWithIconProps = ButtonCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
};

export type ButtonProps = ButtonWithoutIconProps | ButtonWithIconProps;

const _Button: React.ForwardRefRenderFunction<BladeElementRef, ButtonProps> = (
  // While adding any prop here, make sure to handle it in DropdownButton as well
  {
    children,
    icon,
    iconPosition = 'left',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    hasRazorSense = false,
    hasRay = false,
    rayVariant,
    href,
    target,
    rel,
    onClick,
    size = 'medium',
    type = 'button',
    variant = 'primary',
    color = 'primary',
    accessibilityLabel,
    role,
    testID,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onMouseDown,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...rest
  },
  ref,
) => {
  return (
    <BaseButton
      {...(icon ? { icon, children } : { children })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      accessibilityProps={{
        label: accessibilityLabel,
        describedBy: rest['aria-describedby'],
        expanded: rest['aria-expanded'],
        hasPopup: rest['aria-haspopup'],
        role,
      }}
      iconPosition={iconPosition}
      color={color}
      isDisabled={isDisabled}
      isFullWidth={isFullWidth}
      onClick={onClick}
      size={size}
      type={type}
      variant={variant}
      isLoading={isLoading}
      hasRazorSense={hasRazorSense}
      hasRay={hasRay}
      rayVariant={rayVariant}
      testID={testID}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    />
  );
};

const Button = assignWithoutSideEffects(React.forwardRef(_Button), {
  displayName: 'Button',
  componentId: 'Button',
});

export default Button;
