import type { ReactElement } from 'react';
import type { CSSObject } from 'styled-components';
import type { DurationString, EasingString } from '../../tokens/global/motion';
import type { ActionStates } from '../../tokens/theme/theme.d';
import getIn from '../../utils/getIn';
import type { DotNotationSpacingStringToken } from '../../_helpers/types';
import type { Theme } from '../BladeProvider';
import { useTheme } from '../BladeProvider';
import Box from '../Box';
import type { IconComponent, IconProps } from '../Icons';
import type { BaseTextProps } from '../Typography/BaseText';
import BaseText from '../Typography/BaseText';
import StyledLink from './StyledLink';
import useInteraction from './useInteraction';

type LinkCommonProps = {
  variant?: 'anchor' | 'button';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
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
  iconColor: IconProps['color'];
  iconPadding: DotNotationSpacingStringToken;
  textColor: BaseTextProps['color'];
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  cursor: CSSObject['cursor'];
};

const getProps = ({
  theme,
  variant,
  currentInteraction,
  children,
  isDisabled,
}: {
  theme: Theme;
  variant: NonNullable<LinkCommonProps['variant']>;
  currentInteraction: keyof ActionStates;
  children?: string;
  isDisabled: boolean;
}): LinkStyleProps => {
  const isButton = variant === 'button';
  const props: LinkStyleProps = {
    as: isButton ? 'button' : 'a',
    textDecoration: !isButton && currentInteraction !== 'default' ? 'underline' : 'none',
    iconColor: `action.icon.link.${currentInteraction}`,
    iconPadding: !children?.trim() ? 'spacing.0' : 'spacing.1',
    textColor: `action.text.link.${currentInteraction}`,
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    motionDuration: 'duration.2xquick',
    motionEasing: 'easing.standard.effective',
    cursor: isButton && isDisabled ? 'not-allowed' : 'pointer',
  };

  if (isDisabled && variant == 'button') {
    props.textColor = 'action.text.link.disabled';
    props.iconColor = 'action.icon.link.disabled';
  }

  return props;
};

const Link = ({
  children,
  icon: Icon,
  iconPosition = 'left',
  isDisabled = false,
  onClick,
  variant = 'anchor',
  href,
  target,
}: LinkProps): ReactElement => {
  console.log('unused props', isDisabled);
  const { currentInteraction, ...syntheticEvents } = useInteraction();
  const { theme } = useTheme();
  if (!Icon && !children?.trim()) {
    throw new Error(`[Blade: Link]: At least one of icon or text is required to render a link.`);
  }
  const {
    as,
    textDecoration,
    iconColor,
    iconPadding,
    textColor,
    focusRingColor,
    motionDuration,
    motionEasing,
    cursor,
  } = getProps({
    theme,
    variant,
    currentInteraction,
    children,
    isDisabled,
  });

  return (
    <StyledLink
      {...syntheticEvents}
      as={as}
      href={href}
      target={target}
      onClick={onClick}
      disabled={isDisabled}
      cursor={cursor}
      focusRingColor={focusRingColor}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
    >
      <Box display="flex" flexDirection="row" className="content-container">
        {Icon && iconPosition == 'left' ? (
          <Box paddingRight={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size="xsmall" />
          </Box>
        ) : null}
        <BaseText
          textDecorationLine={textDecoration}
          color={textColor}
          fontSize={100}
          textAlign="center"
        >
          {children}
        </BaseText>
        {Icon && iconPosition == 'right' ? (
          <Box paddingLeft={iconPadding} display="flex" alignItems="center">
            <Icon color={iconColor} size="xsmall" />
          </Box>
        ) : null}
      </Box>
    </StyledLink>
  );
};

export default Link;
