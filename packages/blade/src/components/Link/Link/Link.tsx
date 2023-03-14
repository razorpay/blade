import type { ReactElement, SyntheticEvent } from 'react';
import { BaseLink } from '../BaseLink';
import type { IconComponent } from '~components/Icons';
import type { StyledPropsBlade } from '~components/Box/styled-props';
import type { StringChildrenType } from '~src/_helpers/types';

type LinkCommonProps = {
  variant?: 'anchor' | 'button';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: (event: SyntheticEvent) => void;
  href?: string;
  target?: string;
  accessibilityLabel?: string;

  /**
   * Sets the size of the link
   *
   * @default medium
   */
  size?: 'small' | 'medium';
} & StyledPropsBlade;

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
type LinkButtonVariantProps = LinkPropsWithOrWithoutIcon & {
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

const Link = ({
  children,
  icon,
  iconPosition = 'left',
  isDisabled = false,
  onClick,
  variant = 'anchor',
  href,
  target,
  rel,
  accessibilityLabel,
  size = 'medium',
  ...styledProps
}: LinkProps): ReactElement => {
  return (
    <BaseLink
      {...(icon ? { icon, children } : { children })}
      {...(variant === 'anchor' ? { variant, href, target, rel } : { variant, isDisabled })}
      iconPosition={iconPosition}
      onClick={onClick}
      accessibilityLabel={accessibilityLabel}
      size={size}
      {...styledProps}
    />
  );
};

export default Link;
