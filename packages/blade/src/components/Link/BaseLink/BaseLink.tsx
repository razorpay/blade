import type { ReactElement } from 'react';
import type { CSSObject } from 'styled-components';
import type { DurationString, EasingString } from '../../../tokens/global/motion';
import type { ActionStates } from '../../../tokens/theme/theme';
import getIn from '../../../utils/getIn';
import type { DotNotationSpacingStringToken } from '../../../_helpers/types';
import type { Theme } from '../../BladeProvider';
import { useTheme } from '../../BladeProvider';
import Box from '../../Box';
import type { IconComponent, IconProps } from '../../Icons';
import type { BaseTextProps } from '../../Typography/BaseText';
import BaseText from '../../Typography/BaseText';
import StyledBaseLink from './StyledBaseLink';
import useInteraction from './useInteraction';

type BaseLinkCommonProps = {
  variant?: 'anchor' | 'button';
  icon?: IconComponent;
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
};

type BaseLinkWithoutIconProps = BaseLinkCommonProps & {
  icon?: undefined;
  children: string;
};

/*
   Optional children prop when icon is provided
  */
type BaseLinkWithIconProps = BaseLinkCommonProps & {
  icon: IconComponent;
  children?: string;
};

export type BaseLinkProps = BaseLinkWithIconProps | BaseLinkWithoutIconProps;

type BaseLinkStyleProps = {
  as: 'a' | 'button';
  textDecoration: 'underline' | 'none';
  iconColor: IconProps['color'];
  iconPadding: DotNotationSpacingStringToken;
  textColor: BaseTextProps['color'];
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  cursor: CSSObject['cursor'];
  disabled: boolean;
};

const getProps = ({
  theme,
  variant,
  currentInteraction,
  children,
  isDisabled,
}: {
  theme: Theme;
  variant: NonNullable<BaseLinkCommonProps['variant']>;
  currentInteraction: keyof ActionStates;
  children?: string;
  isDisabled: boolean;
}): BaseLinkStyleProps => {
  const isButton = variant === 'button';
  const props: BaseLinkStyleProps = {
    as: isButton ? 'button' : 'a',
    textDecoration: !isButton && currentInteraction !== 'default' ? 'underline' : 'none',
    iconColor: `action.icon.link.${currentInteraction}`,
    iconPadding: !children?.trim() ? 'spacing.0' : 'spacing.1',
    textColor: `action.text.link.${currentInteraction}`,
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    motionDuration: 'duration.2xquick',
    motionEasing: 'easing.standard.effective',
    cursor: isButton && isDisabled ? 'not-allowed' : 'pointer',
    disabled: variant === 'button' && isDisabled,
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
}: BaseLinkProps): ReactElement => {
  console.log('unused props', isDisabled);
  const { currentInteraction, setCurrentInteraction, ...syntheticEvents } = useInteraction();
  const { theme } = useTheme();
  if (!Icon && !children?.trim()) {
    throw new Error(
      `[Blade: BaseLink]: At least one of icon or text is required to render a link.`,
    );
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
    disabled,
  } = getProps({
    theme,
    variant,
    currentInteraction,
    children,
    isDisabled,
  });

  return (
    <StyledBaseLink
      {...syntheticEvents}
      as={as}
      href={href}
      target={target}
      onClick={onClick}
      disabled={disabled}
      cursor={cursor}
      focusRingColor={focusRingColor}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      setCurrentInteraction={setCurrentInteraction}
    >
      <Box display="flex" flexDirection="row" className="content-container" alignItems="center">
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
    </StyledBaseLink>
  );
};

export default Link;
