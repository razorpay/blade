/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import type { GestureResponderEvent } from 'react-native';
import type { BaseLinkProps } from '../../Link/BaseLink';
import StyledBaseButton from './StyledBaseButton';
import type { ButtonTypography, ButtonMinHeight } from './buttonTokens';
import {
  buttonIconOnlyPadding,
  buttonIconOnlySizeToIconSizeMap,
  typography as buttonTypography,
  minHeight as buttonMinHeight,
  buttonSizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  textPadding,
  buttonPadding,
} from './buttonTokens';
import type { Theme } from '~components/BladeProvider';
import type { IconComponent, IconProps, IconSize } from '~components/Icons';
import type { DurationString, EasingString } from '~tokens/global';
import type { BorderRadiusValues, BorderWidthValues, SpacingValues } from '~tokens/theme/theme';
import type { Platform } from '~utils';
import type { StyledPropsBlade } from '~components/Box/styledProps';

import {
  MetaConstants,
  metaAttribute,
  makeAccessible,
  usePrevious,
  makeSize,
  makeSpace,
  makeBorderSize,
  getIn,
  isReactNative,
} from '~utils';

import { BaseText } from '~components/Typography/BaseText';
import { useTheme } from '~components/BladeProvider';
import { announce } from '~components/LiveAnnouncer';
import type { BaseSpinnerProps } from '~components/Spinner/BaseSpinner';
import { BaseSpinner } from '~components/Spinner/BaseSpinner';
import BaseBox from '~components/Box/BaseBox';
import type {
  DotNotationSpacingStringToken,
  StringChildrenType,
  TestID,
} from '~src/_helpers/types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import type { BladeElementRef } from '~src/hooks/useBladeInnerRef';
import { getStringFromReactText } from '~src/utils/getStringChildren';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';
import type { BladeCommonEvents } from '~components/Tooltip/types';

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
  accessibilityLabel?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  contrast?: 'low' | 'high';
  intent?: 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
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
  property: 'background' | 'border' | 'text' | 'icon';
  variant: NonNullable<BaseButtonProps['variant']>;
  state: 'default' | 'hover' | 'active' | 'focus' | 'disabled';
  intent: BaseButtonProps['intent'];
  contrast: BaseButtonProps['contrast'];
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

const getColorToken = ({
  property,
  variant,
  state,
  contrast,
  intent,
}: BaseButtonColorTokenModifiers):
  | `action.${BaseButtonColorTokenModifiers['property']}.${BaseButtonColorTokenModifiers['variant']}.${BaseButtonColorTokenModifiers['state']}`
  | `feedback.${NonNullable<
      BaseButtonColorTokenModifiers['intent']
    >}.action.${BaseButtonColorTokenModifiers['property']}.primary.${BaseButtonColorTokenModifiers['state']}.${NonNullable<
      BaseButtonColorTokenModifiers['contrast']
    >}Contrast` => {
  if (intent && contrast) {
    // TODO: Add support for secondary & tertiary variants for feedback buttons here when a use-case is identified
    return `feedback.${intent}.action.${property}.primary.${state}.${contrast}Contrast`;
  }
  return `action.${property}.${variant}.${state}`;
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
  activeBackgroundColor: string;
  activeBorderColor: string;
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
  intent,
  contrast,
  hasIcon,
}: {
  buttonTypographyTokens: ButtonTypography;
  children?: string;
  isDisabled: boolean;
  hasIcon: boolean;
  theme: Theme;
  size: NonNullable<BaseButtonProps['size']>;
  variant: NonNullable<BaseButtonProps['variant']>;
  intent: BaseButtonProps['intent'];
  contrast: NonNullable<BaseButtonProps['contrast']>;
}): BaseButtonStyleProps => {
  const isIconOnly = hasIcon && (!children || children?.trim().length === 0);
  const props: BaseButtonStyleProps = {
    iconSize: isIconOnly ? buttonIconOnlySizeToIconSizeMap[size] : buttonSizeToIconSizeMap[size],
    spinnerSize: buttonSizeToSpinnerSizeMap[size],
    fontSize: buttonTypographyTokens.fonts.size[size],
    lineHeight: buttonTypographyTokens.lineHeights[size],
    minHeight: makeSize(buttonMinHeight[size]),
    iconPadding: hasIcon && children?.trim() ? `spacing.${textPadding[size]}` : undefined,
    iconColor: getColorToken({
      property: 'icon',
      variant,
      contrast,
      intent,
      state: 'default',
    }) as IconColor,
    textColor: getColorToken({
      property: 'text',
      variant,
      contrast,
      intent,
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
      getColorToken({ property: 'background', variant, contrast, intent, state: 'default' }),
    ),
    defaultBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'default' }),
    ),
    hoverBackgroundColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'hover' }),
    ),
    hoverBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'hover' }),
    ),
    activeBackgroundColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'active' }),
    ),
    activeBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'active' }),
    ),
    focusBackgroundColor: getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'focus' }),
    ),
    focusBorderColor: getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'focus' }),
    ),
    focusRingColor: getIn(theme.colors, 'brand.primary.400'),
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderRadius: makeBorderSize(theme.border.radius.small),
    motionDuration: 'duration.xquick',
    motionEasing: 'easing.standard.effective',
  };

  if (isDisabled) {
    const disabledBackgroundColor = getIn(
      theme.colors,
      getColorToken({ property: 'background', variant, contrast, intent, state: 'disabled' }),
    );
    const disabledBorderColor = getIn(
      theme.colors,
      getColorToken({ property: 'border', variant, contrast, intent, state: 'disabled' }),
    );
    props.iconColor = getColorToken({
      property: 'icon',
      variant,
      contrast,
      intent,
      state: 'disabled',
    }) as IconColor;
    props.textColor = getColorToken({
      property: 'text',
      variant,
      contrast,
      intent,
      state: 'disabled',
    }) as BaseTextProps['color'];
    props.defaultBackgroundColor = disabledBackgroundColor;
    props.defaultBorderColor = disabledBorderColor;
    props.hoverBackgroundColor = disabledBackgroundColor;
    props.hoverBorderColor = disabledBorderColor;
    props.activeBackgroundColor = disabledBackgroundColor;
    props.activeBorderColor = disabledBorderColor;
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
    intent,
    contrast = 'low',
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
    accessibilityLabel,
    testID,
    onFocus,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onPointerEnter,
    ...styledProps
  },
  ref,
) => {
  const isLink = Boolean(href);
  const childrenString = getStringFromReactText(children);
  // Button cannot be disabled when its rendered as Link
  const disabled = isLoading || (isDisabled && !isLink);
  const { theme } = useTheme();
  if (!Icon && !childrenString?.trim()) {
    throw new Error(
      `[Blade: BaseButton]: At least one of icon or text is required to render a button.`,
    );
  }

  const prevLoading = usePrevious(isLoading);

  React.useEffect(() => {
    if (isLoading) announce('Started loading');

    if (!isLoading && prevLoading) announce('Stopped loading');
  }, [isLoading, prevLoading]);

  const {
    activeBorderColor,
    activeBackgroundColor,
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
    intent,
    contrast,
    hasIcon: Boolean(Icon),
  });

  const renderElement = React.useMemo(() => getRenderElement(href), [href]);
  const defaultRel = target === '_blank' ? 'noreferrer noopener' : undefined;

  return (
    <StyledBaseButton
      ref={ref as never}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore: On React Native it will always be undefined but TS doesn't understand that
      as={renderElement}
      href={href}
      target={target}
      rel={rel ?? defaultRel}
      accessibilityProps={{
        ...makeAccessible({
          role: isLink ? 'link' : 'button',
          label: accessibilityLabel,
        }),
      }}
      isLoading={isLoading}
      disabled={disabled}
      activeBorderColor={activeBorderColor}
      activeBackgroundColor={activeBackgroundColor}
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
      type={type}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      {...metaAttribute({ name: MetaConstants.Button, testID })}
      {...styledProps}
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
        >
          <BaseSpinner
            accessibilityLabel="Loading"
            size={spinnerSize}
            intent={intent}
            contrast={contrast}
          />
        </BaseBox>
      ) : null}
      <ButtonContent
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flex={1}
        isHidden={isLoading}
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
            fontWeight="bold"
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
