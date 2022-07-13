import type { ReactElement } from 'react';
import type { IconComponent } from '../../Icons';
import { BaseLink } from '../BaseLink';

type LinkCommonProps = {
  variant?: 'anchor' | 'button';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
  accessibilityLabel?: string;
};

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

export type LinkProps = LinkWithIconProps | LinkWithoutIconProps;

const Link = ({
  children,
  icon,
  iconPosition = 'left',
  isDisabled = false,
  onClick,
  variant = 'anchor',
  href,
  target,
  accessibilityLabel,
}: LinkProps): ReactElement => {
  return (
    <BaseLink
      {...(icon ? { icon, children } : { children })}
      iconPosition={iconPosition}
      isDisabled={isDisabled}
      onClick={onClick}
      variant={variant}
      href={href}
      target={target}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default Link;
