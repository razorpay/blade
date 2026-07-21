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
import type { AccessibilityProps, AriaRoles } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
  color?: 'primary' | 'white' | 'positive' | 'negative';
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  /**
   * Type of loading indicator to show.
   * - `indefinite`: 3-dot loader controlled by `isLoading`
   * - `definite`: left-to-right progress bar over `loadingTimer` ms
   * @default 'indefinite'
   */
  loadingType?: BaseButtonProps['loadingType'];
  /**
   * Duration (in milliseconds) over which the `definite` progress bar fills from 0% to 100%.
   * Required when `loadingType` is `definite`.
   */
  loadingTimer?: BaseButtonProps['loadingTimer'];
  /**
   * Called once when the `definite` progress bar reaches 100%.
   */
  onLoadingComplete?: BaseButtonProps['onLoadingComplete'];
  /**
   * Avatars to render after the button text as an avatar group.
   * Only rendered for `large` buttons; ignored for smaller sizes.
   */
  avatars?: BaseButtonProps['avatars'];
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
  'aria-haspopup'?: AccessibilityProps['hasPopup'];
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
  BladeCommonEvents;

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
    loadingType = 'indefinite',
    loadingTimer,
    onLoadingComplete,
    avatars,
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
        controls: rest['aria-controls'],
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
      loadingType={loadingType}
      loadingTimer={loadingTimer}
      onLoadingComplete={onLoadingComplete}
      avatars={avatars}
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
