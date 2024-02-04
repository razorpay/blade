/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import type { GestureResponderEvent } from 'react-native';
import StyledBaseButton from './StyledBaseButton';
import type { ButtonTypography, ButtonMinHeight } from './buttonTokens';
import {
  textColor,
  backgroundColor,
  buttonIconOnlyPadding,
  buttonIconOnlySizeToIconSizeMap,
  typography as buttonTypography,
  minHeight as buttonMinHeight,
  buttonSizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  buttonIconPadding,
  buttonPadding,
} from './buttonTokens';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import getIn from '~utils/lodashButBetter/get';
import type { BaseLinkProps } from '~components/Link/BaseLink';
import type { Theme } from '~components/BladeProvider';
import type { IconComponent, IconProps, IconSize } from '~components/Icons';
import type { DurationString, EasingString } from '~tokens/global';
import type { BorderRadiusValues, BorderWidthValues, SpacingValues } from '~tokens/theme/theme';
import type { Platform } from '~utils';
import { isReactNative } from '~utils';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { BaseText } from '~components/Typography/BaseText';
import { useTheme } from '~components/BladeProvider';
import { announce } from '~components/LiveAnnouncer';
import type { BaseSpinnerProps } from '~components/Spinner/BaseSpinner';
import { BaseSpinner } from '~components/Spinner/BaseSpinner';
import BaseBox from '~components/Box/BaseBox';
import type {
  BladeElementRef,
  DotNotationSpacingStringToken,
  StringChildrenType,
  TestID,
} from '~utils/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { usePrevious } from '~utils/usePrevious';
import { makeSize } from '~utils/makeSize';
import { makeBorderSize } from '~utils/makeBorderSize';
import type { AccessibilityProps } from '~utils/makeAccessible';
import { makeAccessible } from '~utils/makeAccessible';
import { makeSpace } from '~utils/makeSpace';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import type { BladeCommonEvents } from '~components/types';
import { throwBladeError } from '~utils/logger';

type BaseButtonCommonProps = {
  href?: BaseLinkProps['href'];
  target?: BaseLinkProps['target'];
  rel?: BaseLinkProps['rel'];
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  iconPosition?: 'left' | 'right';
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onKeyDown?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  }>;
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
  type?: 'button' | 'reset' | 'submit';
  isLoading?: boolean;
  accessibilityProps?: Partial<AccessibilityProps>;
  variant?: 'primary' | 'secondary' | 'tertiary';
  color?: 'primary' | 'white' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
} & TestID &
  StyledPropsBlade &
  BladeCommonEvents;

/*
Mandatory children prop when icon is not provided
*/
type BaseButtonWithoutIconProps = BaseButtonCommonProps & {
  icon?: undefined;
  children: StringChildrenType;
};

/*
 Optional children prop when icon is provided
*/
type BaseButtonWithIconProps = BaseButtonCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
};

/*
 With or without icon prop. We need at least an icon or a children prop present.
*/
export type BaseButtonProps = BaseButtonWithIconProps | BaseButtonWithoutIconProps;

type BaseButtonColorTokenModifiers = {
  variant: NonNullable<BaseButtonProps['variant']>;
  state: 'default' | 'hover' | 'focus' | 'disabled';
  color: BaseButtonProps['color'];
};

/**
 * All possible icon colors, derived from `IconProps` minus `currentColor` because possible values should only be from tokens
 */
type IconColor = Exclude<IconProps['color'], 'currentColor'>;

const getRenderElement = (href?: string): 'a' | 'button' | undefined => {
  if (isReactNative()) {
    return undefined; // as property doesn't work with react native
  }

  if (href) {
    return 'a';
  }

  return 'button';
};

const getBackgroundColorToken = ({
  property,
  variant,
  state,
  color,
}: BaseButtonColorTokenModifiers & {
  property: 'background' | 'border';
}): DotNotationToken<Theme['colors']> => {
  const _state = state === 'focus' || state === 'hover' ? 'highlighted' : state;
  const tokens = backgroundColor(property);

  if (color === 'white') {
    return tokens.white[variant][_state];
  }

  if (color && color !== 'primary') {
    if (variant === 'tertiary') {
      throw new Error(
        `Tertiary variant can only be used with color: "primary" or "white" but received "${color}"`,
      );
    }
    return tokens.color(color)[variant][_state];
  }

  return tokens.base[variant][_state];
};

const getTextColorToken = ({
  property,
  variant,
  state,
  color,
}: BaseButtonColorTokenModifiers & {
  property: 'icon' | 'text';
}): DotNotationToken<Theme['colors']> => {
  const tokens = textColor(property);
  const _state = state === 'focus' || state === 'hover' ? 'highlighted' : state;

  if (color === 'white') {
    return tokens.white[variant][_state];
  }

  if (color && color !== 'primary') {
    if (variant === 'tertiary') {
      throw new Error(
        `Tertiary variant can only be used with color: "primary" or "white" but received "${color}"`,
      );
    }
    return tokens.color(color)[variant][_state];
  }

  return tokens.base[variant][_state];
};

type BaseButtonStyleProps = {
  iconSize: IconSize;
  spinnerSize: BaseSpinnerProps['size'];
  fontSize: keyof Theme['typography']['fonts']['size'];
  lineHeight: keyof Theme['typography']['lineHeights'];
  minHeight: `${ButtonMinHeight}px`;
  iconPadding?: DotNotationSpacingStringToken;
  iconColor: IconColor;
  textColor: BaseTextProps['color'];
  buttonPaddingTop: SpacingValues;
  buttonPaddingBottom: SpacingValues;
  buttonPaddingLeft: SpacingValues;
  buttonPaddingRight: SpacingValues;
  text?: string;
  defaultBackgroundColor: string;
  defaultBorderColor: string;
  hoverBackgroundColor: string;
  hoverBorderColor: string;
  focusBackgroundColor: string;
  focusBorderColor: string;
  focusRingColor: string;
  motionDuration: DurationString;
  motionEasing: EasingString;
  borderWidth: BorderWidthValues;
  borderRadius: BorderRadiusValues;
};

const getProps = ({
  buttonTypographyTokens,
  children,
  isDisabled,
  size,
  theme,
  variant,
  color,
  hasIcon,
}: {
  buttonTypographyTokens: ButtonTypography;
  children?: string;
  isDisabled: boolean;
  hasIcon: boolean;
  theme: Theme;
  size: NonNullable<BaseButtonProps['size']>;
  variant: NonNullable<BaseButtonProps['variant']>;
  color: BaseButtonProps['color'];
}): BaseButtonStyleProps => {
  if (variant === 'tertiary' && color !== 'primary' && color !== 'white') {
    throwBladeError({
      moduleName: 'BaseButton',
      message: `Tertiary variant can only be used with color: "default" or "white" but received "${color}"`,
    });
  }

  const isIconOnly = hasIcon && (!children || children?.trim().length === 0);
  const props: BaseButtonStyleProps = {
    iconSize: isIconOnly ? buttonIconOnlySizeToIconSizeMap[size] : buttonSizeToIconSizeMap[size],
    spinnerSize: buttonSizeToSpinnerSizeMap[size],
    fontSize: buttonTypographyTokens.fonts.size[size],
    lineHeight: buttonTypographyTokens.lineHeights[size],
    minHeight: makeSize(buttonMinHeight[size]),
    iconPadding: hasIcon && children?.trim() ? `spacing.${buttonIconPadding[size]}` : undefined,
    iconColor: getTextColorToken({
      property: 'icon',
      variant,
      color,
      state: 'default',
    }) as IconColor,
    textColor: getTextColorToken({
      property: 'text',
      variant,
      color,
      state: 'default',
    }) as BaseTextProps['color'],
    buttonPaddingTop: isIconOnly
      ? makeSpace(theme.spacing[buttonIconOnlyPadding[size].top])
      : makeSpace(theme.spacing[buttonPadding[size].top]),
    buttonPaddingBottom: isIconOnly
      ? makeSpace(theme.spacing[buttonIconOnlyPadding[size].bottom])
      : makeSpace(theme.spacing[buttonPadding[size].bottom]),
    buttonPaddingLeft: isIconOnly
      ? makeSpace(theme.spacing[buttonIconOnlyPadding[size].left])
      : makeSpace(theme.spacing[buttonPadding[size].left]),
    buttonPaddingRight: isIconOnly
      ? makeSpace(theme.spacing[buttonIconOnlyPadding[size].right])
      : makeSpace(theme.spacing[buttonPadding[size].right]),
    text: size === 'xsmall' ? children?.trim().toUpperCase() : children?.trim(),
    defaultBackgroundColor: getIn(
      theme.colors,
      getBackgroundColorToken({ property: 'background', variant, color, state: 'default' }),
    ),
    defaultBorderColor: getIn(
      theme.colors,
      getBackgroundColorToken({ property: 'border', variant, color, state: 'default' }),
    ),
    hoverBackgroundColor: getIn(
      theme.colors,
      getBackgroundColorToken({ property: 'background', variant, color, state: 'hover' }),
    ),
    hoverBorderColor: getIn(
      theme.colors,
      getBackgroundColorToken({ property: 'border', variant, color, state: 'hover' }),
    ),
    focusBackgroundColor: getIn(
      theme.colors,
      getBackgroundColorToken({ property: 'background', variant, color, state: 'focus' }),
    ),
    focusBorderColor: getIn(
      theme.colors,
      getBackgroundColorToken({ property: 'border', variant, color, state: 'focus' }),
    ),
    focusRingColor: getIn(theme.colors, 'surface.border.primary.muted'),
    borderWidth: variant == 'secondary' ? makeBorderSize(theme.border.width.thin) : '0px',
    borderRadius: makeBorderSize(theme.border.radius.medium),
    motionDuration: 'duration.xquick',
    motionEasing: 'easing.standard.effective',
  };

  if (isDisabled) {
    const disabledBackgroundColor = getIn(
      theme.colors,
      getBackgroundColorToken({ property: 'background', variant, color, state: 'disabled' }),
    );
    const disabledBorderColor = getIn(
      theme.colors,
      getBackgroundColorToken({ property: 'border', variant, color, state: 'disabled' }),
    );
    props.iconColor = getTextColorToken({
      property: 'icon',
      variant,
      color,
      state: 'disabled',
    }) as IconColor;
    props.textColor = getTextColorToken({
      property: 'text',
      variant,
      color,
      state: 'disabled',
    }) as BaseTextProps['color'];
    props.defaultBackgroundColor = disabledBackgroundColor;
    props.defaultBorderColor = disabledBorderColor;
    props.hoverBackgroundColor = disabledBackgroundColor;
    props.hoverBorderColor = disabledBorderColor;
    props.focusBackgroundColor = disabledBackgroundColor;
    props.focusBorderColor = disabledBorderColor;
  }

  return props;
};

const ButtonContent = styled(BaseBox)<{ isHidden: boolean }>(({ isHidden }) => ({
  opacity: isHidden ? 0 : 1,
}));

const _BaseButton: React.ForwardRefRenderFunction<BladeElementRef, BaseButtonProps> = (
  {
    href,
    target,
    rel,
    variant = 'primary',
    color = 'primary',
    size = 'medium',
    icon: Icon,
    iconPosition = 'left',
    isDisabled = false,
    isFullWidth = false,
    isLoading = false,
    onClick,
    onBlur,
    onKeyDown,
    type = 'button',
    children,
    testID,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    accessibilityProps,
    onTouchEnd,
    onTouchStart,
    ...rest
  },
  ref,
) => {
  const { theme } = useTheme();
  const isLink = Boolean(href);
  const childrenString = getStringFromReactText(children);
  // Button cannot be disabled when its rendered as Link
  const disabled = isLoading || (isDisabled && !isLink);

  if (__DEV__) {
    if (!Icon && !childrenString?.trim()) {
      throwBladeError({
        message: 'At least one of icon or text is required to render a button.',
        moduleName: 'BaseButton',
      });
    }
  }

  const prevLoading = usePrevious(isLoading);

  React.useEffect(() => {
    if (isLoading) announce('Started loading');

    if (!isLoading && prevLoading) announce('Stopped loading');
  }, [isLoading, prevLoading]);

  const {
    defaultBorderColor,
    defaultBackgroundColor,
    minHeight,
    buttonPaddingTop,
    buttonPaddingBottom,
    buttonPaddingLeft,
    buttonPaddingRight,
    focusBorderColor,
    focusBackgroundColor,
    focusRingColor,
    fontSize,
    hoverBorderColor,
    hoverBackgroundColor,
    iconColor,
    iconSize,
    iconPadding,
    spinnerSize,
    lineHeight,
    text,
    textColor,
    borderWidth,
    borderRadius,
    motionDuration,
    motionEasing,
  } = getProps({
    buttonTypographyTokens: buttonTypography,
    children: childrenString,
    isDisabled: disabled,
    size,
    variant,
    theme,
    color,
    hasIcon: Boolean(Icon),
  });

  const renderElement = React.useMemo(() => getRenderElement(href), [href]);
  const defaultRel = target === '_blank' ? 'noreferrer noopener' : undefined;



  
  return (
    <StyledBaseButton
      ref={ref as any}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore: On React Native it will always be undefined but TS doesn't understand that
      as={renderElement}
      href={href}
      target={target}
      rel={rel ?? defaultRel}
      accessibilityProps={{
        ...makeAccessible({
          role: isLink ? 'link' : 'button',
          ...accessibilityProps,
        }),
      }}
      variant={variant}
      isLoading={isLoading}
      disabled={disabled}
      defaultBorderColor={defaultBorderColor}
      minHeight={minHeight}
      buttonPaddingTop={buttonPaddingTop}
      buttonPaddingBottom={buttonPaddingBottom}
      buttonPaddingLeft={buttonPaddingLeft}
      buttonPaddingRight={buttonPaddingRight}
      defaultBackgroundColor={defaultBackgroundColor}
      focusBorderColor={focusBorderColor}
      focusBackgroundColor={focusBackgroundColor}
      focusRingColor={focusRingColor}
      hoverBorderColor={hoverBorderColor}
      hoverBackgroundColor={hoverBackgroundColor}
      isFullWidth={isFullWidth}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      type={type}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      {...metaAttribute({ name: MetaConstants.Button, testID })}
      {...getStyledProps(rest)}
    >
      {isLoading ? (
        <BaseBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="absolute"
          top="0px"
          left="0px"
          bottom="0px"
          right="0px"
          zIndex={1}
        >
          <BaseSpinner accessibilityLabel="Loading" size={spinnerSize} color={color} />
        </BaseBox>
      ) : null}
      <ButtonContent
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flex={1}
        isHidden={isLoading}
        zIndex={1}
      >
        {Icon && iconPosition == 'left' ? (
          <BaseBox
            paddingRight={iconPadding}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Icon size={iconSize} color={iconColor} />
          </BaseBox>
        ) : null}
        {text ? (
          <BaseText
            lineHeight={lineHeight}
            fontSize={fontSize}
            // figma and web have different font-smoothing properties
            // which causes web version of button text to look much bolder
            // than figma version. To fix this we are changing font-weight from 600 to 500
            // https://forum.figma.com/t/why-does-a-font-weight-in-figma-seem-lighter-than-the-same-weight-in-the-browser/2207
            fontWeight="medium"
            textAlign="center"
            color={textColor}
          >
            {text}
          </BaseText>
        ) : null}
        {Icon && iconPosition == 'right' ? (
          <BaseBox
            paddingLeft={iconPadding}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Icon size={iconSize} color={iconColor} />
          </BaseBox>
        ) : null}
      </ButtonContent>
    </StyledBaseButton>
  );
};

const BaseButton = assignWithoutSideEffects(React.forwardRef(_BaseButton), {
  displayName: 'BaseButton',
});

export default BaseButton;
