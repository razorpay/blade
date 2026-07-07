/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import type { CSSObject } from 'styled-components';
import { CardSurface } from './CardSurface';
import { CardProvider, useVerifyInsideCard } from './CardContext';
import { LinkOverlay } from './LinkOverlay';
import { CardRoot } from './CardRoot';
import { CardTicketSurface } from './CardTicketSurface';
import { CardInfoSurface } from './CardInfoSurface';
import type { CardSpacingValueType, CardVariant, LinkOverlayProps } from './types';
import { CARD_LINK_OVERLAY_ID } from './constants';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute, BladeElementRef, TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { Elevation } from '~tokens/global';
import type { BoxProps } from '~components/Box';
import { makeAccessible } from '~utils/makeAccessible';
import { useVerifyAllowedChildren } from '~utils/useVerifyAllowedChildren/useVerifyAllowedChildren';
import type { Platform } from '~utils';
import { isReactNative, useTheme } from '~utils';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { useCheckboxGroupContext } from '~components/Checkbox/CheckboxGroup/CheckboxGroupContext';
import { useRadioGroupContext } from '~components/Radio/RadioGroup/RadioContext';
import type { CheckboxGroupContextType } from '~components/Checkbox/CheckboxGroup/CheckboxGroupContext';
import type { RadioGroupContextType } from '~components/Radio/RadioGroup/RadioContext';

export const ComponentIds = {
  CardHeader: 'CardHeader',
  CardHeaderTrailing: 'CardHeaderTrailing',
  CardHeaderLeading: 'CardHeaderLeading',
  CardFooter: 'CardFooter',
  CardFooterTrailing: 'CardFooterTrailing',
  CardFooterLeading: 'CardFooterLeading',
  CardBody: 'CardBody',
  CardHeaderIcon: 'CardHeaderIcon',
  CardHeaderCounter: 'CardHeaderCounter',
  CardHeaderBadge: 'CardHeaderBadge',
  CardHeaderAmount: 'CardHeaderAmount',
  CardHeaderText: 'CardHeaderText',
  CardHeaderLink: 'CardHeaderLink',
  CardHeaderIconButton: 'CardHeaderIconButton',
  CardTearLine: 'CardTearLine',
};

type CardSurfaceBackgroundColors = `surface.background.gray.${DotNotationToken<
  Theme['colors']['surface']['background']['gray']
>}`;

export type CardProps = {
  /**
   * Card contents.
   *
   * The expected structure depends on `variant`:
   * - `primary` / `secondary`: standard `CardHeader`, `CardBody`, `CardFooter` composition.
   * - `ticket`: exactly `<CardBody> … <CardTearLine /> <CardBody> …`. The `CardTearLine` marks the
   *   split point; the scalloped perforation and notched edges are drawn by the ticket surface.
   * - `info`: exactly two `CardBody` elements — the first becomes the emphasized header section, the
   *   second becomes the subtle body section.
   */
  children: React.ReactNode;
  /**
   * Sets the background color of the Card
   *
   * @default `surface.background.gray.intense`
   *
   * @deprecated The `backgroundColor` prop is deprecated and is a no-op. The Card always uses `surface.background.gray.intense`. This prop will be removed in a future major version.
   */
  backgroundColor?: CardSurfaceBackgroundColors;
  /**
   * Sets the border radius of the Card
   *
   * @default `medium`
   *
   * @deprecated The `borderRadius` prop is deprecated and is a no-op. The Card always uses `medium` borderRadius. This prop will be removed in a future major version.
   */
  borderRadius?: Extract<BoxProps['borderRadius'], 'medium' | 'large' | 'xlarge'>;
  /**
   * Sets the elevation for Cards
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-elevation--docs
   *
   * @deprecated The `elevation` prop is deprecated and is a no-op. The Card always uses a custom elevation. This prop will be removed in a future major version.
   */
  elevation?: keyof Elevation;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.7`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--docs
   */
  padding?: CardSpacingValueType;
  /**
   * Sets the width of the card
   */
  width?: BoxProps['width'];
  /**
   * Sets the height of the card
   */
  height?: BoxProps['height'];
  /**
   * Sets minimum height of the card
   */
  minHeight?: BoxProps['minHeight'];
  /**
   * Sets minimum width of the card
   */
  minWidth?: BoxProps['minWidth'];
  /**
   * Sets maximum width of the card
   */
  maxWidth?: BoxProps['maxWidth'];
  /**
   * If `true`, the card will be in selected state
   * Card will have a primary color border around it.
   *
   * @default false
   */
  isSelected?: boolean;
  /**
   * If `true`, the card is disabled: it becomes non-interactive (`href`/`onClick` are ignored) and
   * is announced as disabled to assistive tech.
   *
   * `isDisabled` takes precedence over `isSelected`. For the `ticket` variant it also renders a
   * dashed border.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Makes the Card linkable by setting the `href` prop
   *
   * @default undefined
   */
  href?: string;
  /**
   * Sets the `target` attribute for the linkable card
   */
  target?: string;
  /**
   * Sets the `rel` attribute for the linkable card
   */
  rel?: string;
  /**
   * Sets the accessibility label for the card
   * This is useful when the card has an `href` or `onClick` prop
   * Setting this will announce the label when the card is focused
   */
  accessibilityLabel?: string;
  /**
   * If `true`, the card will scale up on hover
   *
   * On mobile devices it will scale down on press
   *
   * **This prop is deprecated in favour of motion presets released in v12**
   *
   * ### Migration
   *
   * ```diff
   * - <Card
   * -  shouldScaleOnHover
   * - />
   *
   * + <Scale motionTriggers={['hover']}>
   * +   <Card />
   * + </Scale>
   * ```
   *
   * @default false
   *
   * @deprecated This prop is deprecated in favour of motion presets released in v12
   */
  shouldScaleOnHover?: boolean;
  /**
   * Callback triggered when the card is hovered
   */
  onHover?: () => void;
  /**
   * Sets the visual variant of the Card
   *
   * - `primary`: Standard card with full composition (CardHeader, CardBody, CardFooter)
   * - `secondary`: Simplified card that only accepts CardBody as children
   * - `ticket`: Ticket/coupon style card split into two sections by a perforated tear line with
   *   notched edges. Accepts two `CardBody` sections separated by a `CardTearLine`.
   * - `info`: Two-tone card with an emphasized header section and a subtle body section wrapped by
   *   a single rounded border. Accepts two `CardBody` sections (first = header, second = body).
   *
   * @default 'primary'
   */
  variant?: CardVariant;
  /**
   * Sets the size of the card header title
   *
   * @default 'large'
   */
  size?: 'large' | 'medium';
  /**
   * Callback triggered when the card is clicked
   */
  onClick?: (
    event: Platform.Select<{
      web: React.MouseEvent;
      native: GestureResponderEvent;
    }>,
  ) => void;
  /**
   * Sets the HTML element for the Card
   *
   * When `as` is set to `label`, the card will be rendered as a label element
   * This can be used to create a custom checkbox or radio button using the card
   *
   * @default undefined
   */
  as?: 'label';
  cursor?: Platform.Select<{
    web: CSSObject['cursor'];
    native: undefined;
  }>;
  opacity?: BoxProps['opacity'];
  transition?: BoxProps['transition'];
  flexShrink?: BoxProps['flexShrink'];
  /**
   * Sets the overflow behavior of the card content
   */
  overflow?: BoxProps['overflow'];
  /**
   * Sets the horizontal overflow behavior of the card content
   */
  overflowX?: BoxProps['overflowX'];
  /**
   * Sets the vertical overflow behavior of the card content
   */
  overflowY?: BoxProps['overflowY'];
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

const _Card: React.ForwardRefRenderFunction<BladeElementRef, CardProps> = (
  {
    children,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    backgroundColor,
    borderRadius = 'medium',
    elevation = 'lowRaised',
    testID,
    padding = 'spacing.7',
    width,
    height,
    minHeight,
    minWidth,
    maxWidth,
    onClick,
    isSelected = false,
    isDisabled = false,
    accessibilityLabel,
    shouldScaleOnHover = false,
    onHover,
    href,
    target,
    rel,
    as,
    variant = 'primary',
    size = 'large',
    cursor,
    opacity,
    transition,
    flexShrink,
    overflow,
    overflowX,
    overflowY,
    ...rest
  },
  ref,
): React.ReactElement => {
  const [isFocused, setIsFocused] = React.useState(false);
  const { colorScheme } = useTheme();

  useVerifyAllowedChildren({
    children,
    componentName: 'Card',
    allowedComponents:
      // eslint-disable-next-line no-nested-ternary
      variant === 'secondary' || variant === 'info'
        ? [ComponentIds.CardBody]
        : variant === 'ticket'
        ? [ComponentIds.CardBody, ComponentIds.CardTearLine]
        : [ComponentIds.CardHeader, ComponentIds.CardBody, ComponentIds.CardFooter],
  });

  const checkboxGroupProps = useCheckboxGroupContext();
  const radioGroupProps = useRadioGroupContext();

  const getGroupProps = (): CheckboxGroupContextType | RadioGroupContextType | undefined => {
    if (Object.keys(checkboxGroupProps).length > 0) return checkboxGroupProps;
    if (Object.keys(radioGroupProps).length > 0) return radioGroupProps;
    return undefined;
  };

  const groupProps = getGroupProps();
  const _validationState = groupProps?.validationState;

  // `isDisabled` takes precedence over `isSelected`. A Card used as a selection control inside a
  // disabled Checkbox/Radio group is disabled too.
  const isCardDisabled = isDisabled || Boolean(groupProps?.isDisabled);
  const isCardSelected = isSelected && !isCardDisabled;

  const linkOverlayProps: LinkOverlayProps = {
    ...metaAttribute({ name: CARD_LINK_OVERLAY_ID }),
    ...makeAccessible({ label: accessibilityLabel, pressed: href ? undefined : isCardSelected }),
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
  };
  const defaultRel = target && target === '_blank' ? 'noreferrer noopener' : undefined;

  if (variant === 'ticket') {
    const childrenArray = React.Children.toArray(children);
    const tearLineIndex = childrenArray.findIndex(
      (child) => React.isValidElement(child) && getComponentId(child) === ComponentIds.CardTearLine,
    );

    if (__DEV__ && tearLineIndex === -1) {
      throwBladeError({
        message:
          'A `ticket` variant Card must contain a `CardTearLine` between its two `CardBody` sections.',
        moduleName: 'Card',
      });
    }

    const splitIndex = tearLineIndex === -1 ? childrenArray.length : tearLineIndex;
    const topContent = childrenArray.slice(0, splitIndex);
    const tearLineNode = tearLineIndex === -1 ? null : childrenArray[tearLineIndex];
    const bottomContent = tearLineIndex === -1 ? [] : childrenArray.slice(tearLineIndex + 1);

    return (
      <CardProvider size={size} variant={variant}>
        <CardRoot
          as={as}
          ref={ref as never}
          display={'block' as never}
          onMouseEnter={onHover as never}
          isSelected={false}
          isFocused={isFocused}
          onClick={isReactNative() && !isCardDisabled ? onClick : undefined}
          width={width}
          height={height}
          minHeight={minHeight}
          minWidth={minWidth}
          maxWidth={maxWidth}
          href={isCardDisabled ? undefined : href}
          accessibilityLabel={accessibilityLabel}
          cursor={
            (isReactNative()
              ? undefined
              : (isCardDisabled ? 'not-allowed' : cursor)) as never
          }
          opacity={opacity}
          transition={transition}
          flexShrink={flexShrink}
          {...makeAccessible({ disabled: isCardDisabled })}
          {...metaAttribute({ name: MetaConstants.Card, testID })}
          {...getStyledProps(rest)}
          {...makeAnalyticsAttribute(rest)}
        >
          <CardTicketSurface
            top={topContent}
            bottom={bottomContent}
            tearLine={tearLineNode}
            isSelected={isCardSelected}
            isDisabled={isCardDisabled}
          >
            {!isCardDisabled && href ? (
              <LinkOverlay
                onClick={onClick}
                href={href}
                target={target}
                rel={rel ?? defaultRel}
                {...linkOverlayProps}
              />
            ) : null}
            {!isCardDisabled && !href && onClick ? (
              <LinkOverlay as="button" onClick={onClick} {...linkOverlayProps} />
            ) : null}
          </CardTicketSurface>
        </CardRoot>
      </CardProvider>
    );
  }

  if (variant === 'info') {
    const childrenArray = React.Children.toArray(children);
    const [topContent, ...bottomContent] = childrenArray;

    return (
      <CardProvider size={size} variant={variant}>
        <CardRoot
          as={as}
          ref={ref as never}
          display={'block' as never}
          onMouseEnter={onHover as never}
          isSelected={false}
          isFocused={isFocused}
          onClick={isReactNative() && !isCardDisabled ? onClick : undefined}
          width={width}
          height={height}
          minHeight={minHeight}
          minWidth={minWidth}
          maxWidth={maxWidth}
          href={isCardDisabled ? undefined : href}
          accessibilityLabel={accessibilityLabel}
          cursor={
            (isReactNative()
              ? undefined
              : (isCardDisabled ? 'not-allowed' : cursor)) as never
          }
          opacity={opacity}
          transition={transition}
          flexShrink={flexShrink}
          {...makeAccessible({ disabled: isCardDisabled })}
          {...metaAttribute({ name: MetaConstants.Card, testID })}
          {...getStyledProps(rest)}
          {...makeAnalyticsAttribute(rest)}
        >
          <CardInfoSurface
            top={topContent}
            bottom={bottomContent}
            isSelected={isCardSelected}
            isDisabled={isCardDisabled}
          >
            {!isCardDisabled && href ? (
              <LinkOverlay
                onClick={onClick}
                href={href}
                target={target}
                rel={rel ?? defaultRel}
                {...linkOverlayProps}
              />
            ) : null}
            {!isCardDisabled && !href && onClick ? (
              <LinkOverlay as="button" onClick={onClick} {...linkOverlayProps} />
            ) : null}
          </CardInfoSurface>
        </CardRoot>
      </CardProvider>
    );
  }

  return (
    <CardProvider size={size} variant={variant}>
      <CardRoot
        as={as}
        ref={ref as never}
        display={'block' as never}
        borderRadius="medium"
        onMouseEnter={onHover as never}
        shouldScaleOnHover={shouldScaleOnHover}
        isSelected={isCardSelected}
        isFocused={isFocused}
        // on react native we need to pass onClick to root, because we don't need the LinkOverlay in RN
        onClick={isReactNative() && !isCardDisabled ? onClick : undefined}
        width={width}
        height={height}
        minHeight={minHeight}
        minWidth={minWidth}
        maxWidth={maxWidth}
        href={isCardDisabled ? undefined : href}
        accessibilityLabel={accessibilityLabel}
        validationState={_validationState}
        cursor={
          (isReactNative()
            ? undefined
            : (isCardDisabled ? 'not-allowed' : cursor)) as never
        }
        opacity={opacity}
        transition={transition}
        flexShrink={flexShrink}
        {...makeAccessible({ disabled: isCardDisabled })}
        {...metaAttribute({ name: MetaConstants.Card, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <CardSurface
          height={height}
          minHeight={minHeight}
          padding={padding}
          borderRadius="medium"
          textAlign={'left' as never}
          backgroundColor="surface.background.gray.intense"
          colorScheme={colorScheme}
          isSelected={isCardSelected}
          elevation={elevation}
          overflow={overflow}
          overflowX={overflowX}
          overflowY={overflowY}
          variant={variant}
          $isCard={true}
        >
          {!isCardDisabled && href ? (
            <LinkOverlay
              onClick={onClick}
              href={href}
              target={target}
              rel={rel ?? defaultRel}
              {...linkOverlayProps}
            />
          ) : null}
          {!isCardDisabled && !href && onClick ? (
            <LinkOverlay as="button" onClick={onClick} {...linkOverlayProps} />
          ) : null}
          {children}
        </CardSurface>
      </CardRoot>
    </CardProvider>
  );
};

type CardBodyProps = {
  children: React.ReactNode;
  height?: BoxProps['height'];
} & TestID &
  DataAnalyticsAttribute;

const _CardBody = ({ height, children, testID, ...rest }: CardBodyProps): React.ReactElement => {
  useVerifyInsideCard('CardBody');

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.CardBody, testID })}
      {...makeAnalyticsAttribute(rest)}
      height={height}
    >
      {children}
    </BaseBox>
  );
};

type CardTearLineProps = TestID & DataAnalyticsAttribute;

/**
 * Marks the split between the two `CardBody` sections of a `ticket` variant Card. Render it
 * between the two `CardBody` sections. It renders no visual of its own — the scalloped perforation
 * and edge notches are drawn by the ticket surface — so the two sections stay flush at the seam.
 */
const _CardTearLine = ({ testID, ...rest }: CardTearLineProps): React.ReactElement => {
  useVerifyInsideCard('CardTearLine');

  return (
    <BaseBox
      height="0px"
      {...metaAttribute({ name: MetaConstants.CardTearLine, testID })}
      {...makeAnalyticsAttribute(rest)}
    />
  );
};

const Card = React.forwardRef(_Card);
const CardBody = assignWithoutSideEffects(_CardBody, { componentId: ComponentIds.CardBody });
const CardTearLine = assignWithoutSideEffects(_CardTearLine, {
  componentId: ComponentIds.CardTearLine,
});

export { Card, CardBody, CardTearLine };
