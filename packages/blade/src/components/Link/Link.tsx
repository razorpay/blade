import type { ReactElement } from 'react';
import styled from 'styled-components';
import type { DurationString, EasingString } from '../../tokens/global/motion';
import type { ActionStates } from '../../tokens/theme/theme.d';
import getIn from '../../utils/getIn';
import makeBorderSize from '../../utils/makeBorderSize';
import makeMotionTime from '../../utils/makeMotionTime';
import type { DotNotationSpacingStringToken } from '../../_helpers/types';
import type { Theme } from '../BladeProvider';
import { useTheme } from '../BladeProvider';
import Box from '../Box';
import type { IconComponent, IconProps } from '../Icons';

import type { BaseTextProps } from '../Typography/BaseText';
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
};

const getProps = ({
  theme,
  variant,
  currentInteraction,
}: {
  theme: Theme;
  variant: NonNullable<LinkCommonProps['variant']>;
  currentInteraction: keyof ActionStates;
}): LinkStyleProps => {
  const props: LinkStyleProps = {
    as: variant === 'anchor' ? 'a' : 'button',
    textDecoration: variant === 'anchor' && currentInteraction !== 'default' ? 'underline' : 'none',
    iconColor: `action.icon.link.${currentInteraction}`,
    iconPadding: 'spacing.1',
    textColor: `action.text.link.${currentInteraction}`,
    focusRingColor:
      currentInteraction == 'focus' || currentInteraction == 'active'
        ? getIn(theme.colors, 'brand.primary.400')
        : 'none',
    motionDuration: 'duration.2xquick',
    motionEasing: 'easing.standard.effective',
  };
  return props;
};

const StyledBox = styled(Box)<{
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
}>(({ theme, focusRingColor, motionEasing, motionDuration }) => ({
  boxShadow: `0px 0px 0px 4px ${focusRingColor}`,
  borderRadius: makeBorderSize(theme.border.radius.small),
  transitionProperty: 'box-shadow',
  transitionTimingFunction: getIn(theme.motion, motionEasing),
  transitionDuration: makeMotionTime(getIn(theme.motion, motionDuration)),
  '*': {
    transitionProperty: 'color, fill',
    transitionTimingFunction: getIn(theme.motion, motionEasing),
    transitionDuration: makeMotionTime(getIn(theme.motion, motionDuration)),
  },
}));

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
  const {
    as,
    textDecoration,
    iconColor,
    iconPadding,
    textColor,
    focusRingColor,
    motionDuration,
    motionEasing,
  } = getProps({
    theme,
    variant,
    currentInteraction,
  });

  return (
    <StyledLink {...syntheticEvents} as={as} href={href} target={target} onClick={onClick}>
      <StyledBox
        display="flex"
        flexDirection="row"
        width="fit-content"
        justifyContent="center"
        alignItems="center"
        focusRingColor={focusRingColor}
        motionDuration={motionDuration}
        motionEasing={motionEasing}
      >
        {Icon && iconPosition == 'left' ? (
          <Box paddingRight={iconPadding}>
            <Icon color={iconColor} size="xsmall" />
          </Box>
        ) : null}
        <BaseText textDecorationLine={textDecoration} color={textColor} fontSize={100}>
          {children}
        </BaseText>
        {Icon && iconPosition == 'right' ? (
          <Box paddingLeft={iconPadding} display="flex" alignSelf="center">
            <Icon color={iconColor} size="xsmall" />
          </Box>
        ) : null}
      </StyledBox>
    </StyledLink>
  );
};

export default Link;
