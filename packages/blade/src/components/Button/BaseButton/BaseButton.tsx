/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import styled from 'styled-components';
import type { GestureResponderEvent } from 'react-native';
import StyledBaseButton from './StyledBaseButton';
import type { ButtonTypography } from './buttonTokens';
import {
  textColor,
  backgroundColor,
  buttonIconOnlySizeToIconSizeMap,
  typography as buttonTypography,
  minHeight as buttonMinHeight,
  buttonSizeToIconSizeMap,
  buttonSizeToSpinnerSizeMap,
  buttonIconPadding,
  buttonPadding,
  buttonIconOnlyHeightWidth,
} from './buttonTokens';
import type { BaseButtonStyleProps, IconColor } from './types';
import AnimatedButtonContent from './AnimatedButtonContent';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import getIn from '~utils/lodashButBetter/get';
import type { BaseLinkProps } from '~components/Link/BaseLink';
import type { Theme } from '~components/BladeProvider';
import type { IconComponent } from '~components/Icons';
import type { Platform } from '~utils';
import { isReactNative } from '~utils';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { useButtonGroupContext } from '~components/ButtonGroup/ButtonGroupContext';
import { getStyledProps } from '~components/Box/styledProps';
import { BaseText } from '~components/Typography/BaseText';
import { useTheme } from '~components/BladeProvider';
import { announce } from '~components/LiveAnnouncer';
import { BaseSpinner } from '~components/Spinner/BaseSpinner';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import type {
  BladeElementRef,
  DataAnalyticsAttribute,
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
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type BaseButtonCommonProps = {
  href?: BaseLinkProps['href'];
  target?: BaseLinkProps['target'];
  rel?: BaseLinkProps['rel'];
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  id?: string;
  tabIndex?: BaseBoxProps['tabIndex'];
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
} & DataAnalyticsAttribute;

/*
 Optional children prop when icon is provided
*/
type BaseButtonWithIconProps = BaseButtonCommonProps & {
  icon: IconComponent;
  children?: StringChildrenType;
} & DataAnalyticsAttribute;

/*
 With or without icon prop. We need at least an icon or a children prop present.
*/
export type BaseButtonProps = BaseButtonWithIconProps | BaseButtonWithoutIconProps;

type BaseButtonColorTokenModifiers = {
  variant: NonNullable<BaseButtonProps['variant']>;
  state: 'default' | 'hover' | 'focus' | 'disabled';
  color: BaseButtonProps['color'];
};

const getRenderElement = (href?: string): 'a' | 'button' | undefined => {
  if (isReactNative()) {
    return undefined; // as property doesn't work with react native
  }

  if (href) {
    return 'a';
  }

  return 'button';
};

export const getBackgroundColorToken = ({
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

export const getTextColorToken = ({
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

const getProps = ({
  buttonTypographyTokens,
  childrenString,
  isDisabled,
  size,
  theme,
  variant,
  color,
  hasIcon,
}: {
  buttonTypographyTokens: ButtonTypography;
  childrenString?: string;
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
      message: `Tertiary variant can only be used with color: "primary" or "white" but received "${color}"`,
    });
  }

  const isIconOnly = hasIcon && (!childrenString || childrenString?.trim().length === 0);
  const props: BaseButtonStyleProps = {
    iconSize: isIconOnly ? buttonIconOnlySizeToIconSizeMap[size] : buttonSizeToIconSizeMap[size],
    spinnerSize: buttonSizeToSpinnerSizeMap[size],
    fontSize: buttonTypographyTokens.fonts.size[size],
    lineHeight: buttonTypographyTokens.lineHeights[size],
    minHeight: makeSize(buttonMinHeight[size]),
    height: isIconOnly ? buttonIconOnlyHeightWidth[size] : undefined,
    width: isIconOnly ? buttonIconOnlyHeightWidth[size] : undefined,
    iconPadding:
      hasIcon && childrenString?.trim() ? `spacing.${buttonIconPadding[size]}` : undefined,
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
    buttonPaddingTop: isIconOnly ? makeSpace(0) : makeSpace(theme.spacing[buttonPadding[size].top]),
    buttonPaddingBottom: isIconOnly
      ? makeSpace(0)
      : makeSpace(theme.spacing[buttonPadding[size].bottom]),
    buttonPaddingLeft: isIconOnly
      ? makeSpace(0)
      : makeSpace(theme.spacing[buttonPadding[size].left]),
    buttonPaddingRight: isIconOnly
      ? makeSpace(0)
      : makeSpace(theme.spacing[buttonPadding[size].right]),
    text: childrenString?.trim(),
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
    motionEasing: 'easing.standard',
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
    tabIndex,
    id,
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
    onMouseDown,
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
  const buttonGroupProps = useButtonGroupContext();
  const [isPressed, setIsPressed] = React.useState(false);
  const isLink = Boolean(href);
  const childrenString = getStringFromReactText(children);
  const isChildrenComponent = React.isValidElement(children);

  // Button cannot be disabled when its rendered as Link
  const disabled = buttonGroupProps.isDisabled ?? (isLoading || (isDisabled && !isLink));

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
    height,
    width,
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
    childrenString,
    isDisabled: disabled,
    size: buttonGroupProps.size ?? size,
    variant: buttonGroupProps.variant ?? variant,
    theme,
    color: buttonGroupProps.color ?? color,
    hasIcon: Boolean(Icon),
  });

  const renderElement = React.useMemo(() => getRenderElement(href), [href]);
  const defaultRole = isLink ? 'link' : 'button';

  const handlePointerPressedIn = React.useCallback(() => {
    if (disabled) return;
    setIsPressed(true);
  }, [disabled]);

  const handlePointerPressedOut = React.useCallback(() => {
    if (disabled) return;
    setIsPressed(false);
  }, [disabled]);

  const handleKeyboardPressedIn = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === ' ' || e.key === 'Enter') {
        setIsPressed(true);
      }
    },
    [disabled],
  );

  const handleKeyboardPressedOut = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === ' ' || e.key === 'Enter') {
        setIsPressed(false);
      }
    },
    [disabled],
  );

  return (
    <StyledBaseButton
      ref={ref as any}
      id={id}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore: On React Native it will always be undefined but TS doesn't understand that
      as={renderElement}
      href={href}
      target={target}
      rel={rel}
      accessibilityProps={{
        ...makeAccessible({
          ...accessibilityProps,
          role: accessibilityProps?.role ?? defaultRole,
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
      isFullWidth={buttonGroupProps.isFullWidth ?? isFullWidth}
      onClick={onClick}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      tabIndex={tabIndex}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      // Setting type for web fails it on native typecheck and vice versa
      onKeyDown={(event: any) => {
        handleKeyboardPressedIn(event);
        onKeyDown?.(event);
      }}
      onTouchStart={(event: React.TouchEvent) => {
        handlePointerPressedIn();
        onTouchStart?.(event);
      }}
      onTouchEnd={(event: React.TouchEvent) => {
        handlePointerPressedOut();
        onTouchEnd?.(event);
      }}
      type={type}
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      motionDuration={motionDuration}
      motionEasing={motionEasing}
      height={height}
      width={width}
      isPressed={isPressed}
      onMouseDown={(event: React.MouseEvent) => {
        handlePointerPressedIn();
        onMouseDown?.(event);
      }}
      onMouseUp={handlePointerPressedOut}
      onMouseOut={handlePointerPressedOut}
      onKeyUp={handleKeyboardPressedOut}
      {...metaAttribute({ name: MetaConstants.Button, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <AnimatedButtonContent
        motionDuration={motionDuration}
        motionEasing={motionEasing}
        isPressed={isPressed}
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
            isChildrenComponent ? (
              children
            ) : (
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
            )
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
      </AnimatedButtonContent>
    </StyledBaseButton>
  );
};

const BaseButton = assignWithoutSideEffects(React.forwardRef(_BaseButton), {
  displayName: 'BaseButton',
});

export default BaseButton;
