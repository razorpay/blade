import type { ReactElement, SyntheticEvent } from 'react';
import type { IconComponent } from '../../Icons';
import { BaseLink } from '../BaseLink';

type LinkCommonProps = {
  variant?: 'anchor' | 'button';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: (event: SyntheticEvent) => void;
  href?: string;
  target?: string;
  accessibilityLabel?: string;
};

/*
  Mandatory children prop when icon is not provided
*/
type LinkWithoutIconProps = LinkCommonProps & {
  icon?: undefined;
  children: string;
};

/*
  Optional children prop when icon is provided
*/
type LinkWithIconProps = LinkCommonProps & {
  icon: IconComponent;
  children?: string;
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
}: LinkProps): ReactElement => {
  return (
    <BaseLink
      {...(icon ? { icon, children } : { children })}
      {...(variant === 'anchor' ? { variant, href, target, rel } : { variant, isDisabled })}
      iconPosition={iconPosition}
      onClick={onClick}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default Link;
