import type { ReactElement, SyntheticEvent } from 'react';
import React from 'react';
import type { BaseLinkProps } from '../BaseLink';
import { BaseLink } from '../BaseLink';
import type { IconComponent } from '~components/Icons';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import type { StringChildrenType, TestID, BladeElementRef } from '~utils/types';
import type { Platform } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeCommonEvents } from '~components/types';

type LinkCommonProps = {
  variant?: 'anchor' | 'button';
  icon?: IconComponent;
  color?: 'default' | 'white' | 'neutral';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: (event: SyntheticEvent) => void;
  href?: string;
  target?: string;
  accessibilityLabel?: string;

  /**
   * It is exposed for internal usage with tooltip.
   *
   * @private
   */
  'aria-describedby'?: string;

  /**
   * Sets the size of the link
   *
   * @default medium
   */
  size?: BaseLinkProps['size'];
} & TestID &
  StyledPropsBlade &
  BladeCommonEvents &
  Platform.Select<{
    native: {
      /**
       * Defines how far your touch can start away from the link
       */
      hitSlop?:
        | {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
          }
        | number;
      /**
       * This is a web only prop and has no effect on react-native.
       */
      htmlTitle?: undefined;
    };
    web: {
      /**
       * This is a react-native only prop and has no effect on web.
       */
      hitSlop?: undefined;
      /**
       * The title of the link which is displayed as a tooltip.
       */
      htmlTitle?: string;
    };
  }>;

/*
  Mandatory children prop when icon is not provided
*/
type LinkWithoutIconProps = LinkCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
};

/*
  Optional children prop when icon is provided
*/
type LinkWithIconProps = LinkCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
};

/*
  Link Props with or without an icon
*/
type LinkPropsWithOrWithoutIcon = LinkWithIconProps | LinkWithoutIconProps;

/*
  Link Props when variant is anchor
*/
type LinkAnchorVariantProps = LinkPropsWithOrWithoutIcon & {
  variant?: 'anchor';
  href?: string;
  target?: string;
  rel?: string;
  isDisabled?: undefined;
};

/*
  Link Props when variant is button
*/
export type LinkButtonVariantProps = LinkPropsWithOrWithoutIcon & {
  variant?: 'button';
  isDisabled?: boolean;
  href?: undefined;
  target?: undefined;
  rel?: undefined;
};

/*
  Link Props when variant is anchor or button
*/
export type LinkProps = LinkAnchorVariantProps | LinkButtonVariantProps;

const _Link: React.ForwardRefRenderFunction<BladeElementRef, LinkProps> = (
  {
    children,
    icon,
    iconPosition = 'left',
    isDisabled = false,
    onClick,
    variant = 'anchor',
    color = 'default',
    href,
    target,
    rel,
    accessibilityLabel,
    size = 'medium',
    testID,
    hitSlop,
    htmlTitle,
    onBlur,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    onTouchStart,
    onTouchEnd,
    ...rest
  },
  ref,
): ReactElement => {
  return (
    <BaseLink
      {...(icon ? { icon, children } : { children })}
      {...(variant === 'anchor' ? { variant, href, target, rel } : { variant, isDisabled })}
      ref={ref as never}
      iconPosition={iconPosition}
      onClick={onClick}
      accessibilityProps={{ label: accessibilityLabel, describedBy: rest['aria-describedby'] }}
      size={size}
      color={color}
      testID={testID}
      hitSlop={hitSlop}
      htmlTitle={htmlTitle}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      {...getStyledProps(rest)}
    />
  );
};

const Link = assignWithoutSideEffects(React.forwardRef(_Link), {
  displayName: 'Link',
  componentId: 'Link',
});

export default Link;
