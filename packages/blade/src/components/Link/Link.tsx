import type { ReactElement } from 'react';
import type { IconComponent } from '../Icons';
import { CreditCardIcon } from '../Icons';
import BaseText from '../Typography/BaseText';
import StyledLink from './StyledLink.web';
import useInteraction from './useInteraction';

type LinkCommonProps = {
  variant?: 'anchor' | 'button';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: () => void;
  href?: string;
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

type LinkStyleProps = {
  as: 'a' | 'button';
  textDecoration: 'underline' | 'none';
};

const getProps = ({
  variant,
}: {
  variant: NonNullable<LinkCommonProps['variant']>;
}): LinkStyleProps => {
  const props: LinkStyleProps = {
    as: variant === 'anchor' ? 'a' : 'button',
    textDecoration: variant === 'anchor' ? 'underline' : 'none',
  };
  return props;
};

const Link = ({
  children,
  icon,
  iconPosition,
  isDisabled,
  onClick,
  variant = 'anchor',
  href,
}: LinkProps): ReactElement => {
  console.log('unused props', icon, iconPosition, isDisabled, onClick, variant);
  const { currentInteraction, ...syntheticEvents } = useInteraction();
  const { as, textDecoration } = getProps({ variant });
  console.log('🚀 ~ file: Link.tsx ~ line 60 ~ textDecoration', textDecoration);
  return (
    <StyledLink as={as} href={href} {...syntheticEvents}>
      <CreditCardIcon color="action.icon.link.default" size="large" />
      <BaseText
        textDecorationLine={textDecoration}
        color={`action.text.link.${currentInteraction}`}
      >
        {children}
      </BaseText>
    </StyledLink>
  );
};

export default Link;
