import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import { CardSurface } from './CardSurface';
import { CardProvider, useVerifyInsideCard } from './CardContext';
import { LinkOverlay } from './LinkOverlay';
import { CardRoot } from './CardRoot';
import type { CardSpacingValueType, LinkOverlayProps } from './types';
import { CARD_LINK_OVERLAY_ID } from './constants';
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
import { isReactNative } from '~utils';
import type { Theme } from '~components/BladeProvider';
import type { DotNotationToken } from '~utils/lodashButBetter/get';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
};

type CardSurfaceBackgroundColors = `surface.background.gray.${DotNotationToken<
  Theme['colors']['surface']['background']['gray']
>}`;

export type CardProps = {
  /**
   * Card contents
   */
  children: React.ReactNode;
  /**
   * Sets the background color of the Card
   *
   * @default `surface.background.gray.intense`
   */
  backgroundColor?: CardSurfaceBackgroundColors;
  /**
   * Sets the border radius of the Card
   *
   * @default `medium`
   */
  borderRadius?: Extract<BoxProps['borderRadius'], 'medium' | 'large' | 'xlarge'>;
  /**
   * Sets the elevation for Cards
   *
   * eg: `theme.elevation.midRaised`
   *
   * @default `theme.elevation.lowRaised`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-elevation--docs
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
   * If `true`, the card will be in selected state
   * Card will have a primary color border around it.
   *
   * @default false
   */

  isSelected?: boolean;
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
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

const _Card: React.ForwardRefRenderFunction<BladeElementRef, CardProps> = (
  {
    children,
    backgroundColor = 'surface.background.gray.intense',
    borderRadius = 'medium',
    elevation = 'lowRaised',
    testID,
    padding = 'spacing.7',
    width,
    height,
    minHeight,
    minWidth,
    onClick,
    isSelected = false,
    accessibilityLabel,
    shouldScaleOnHover = false,
    onHover,
    href,
    target,
    rel,
    as,
    ...rest
  },
  ref,
): React.ReactElement => {
  const [isFocused, setIsFocused] = React.useState(false);

  useVerifyAllowedChildren({
    children,
    componentName: 'Card',
    allowedComponents: [ComponentIds.CardHeader, ComponentIds.CardBody, ComponentIds.CardFooter],
  });

  const linkOverlayProps: LinkOverlayProps = {
    ...metaAttribute({ name: CARD_LINK_OVERLAY_ID }),
    ...makeAccessible({ label: accessibilityLabel, pressed: isSelected }),
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
  };
  const defaultRel = target && target === '_blank' ? 'noreferrer noopener' : undefined;

  return (
    <CardProvider>
      <CardRoot
        as={as}
        ref={ref as never}
        display={'block' as never}
        borderRadius={borderRadius}
        onMouseEnter={onHover as never}
        shouldScaleOnHover={shouldScaleOnHover}
        isSelected={isSelected}
        isFocused={isFocused}
        // on react native we need to pass onClick to root, because we don't need the LinkOverlay in RN
        onClick={isReactNative() ? onClick : undefined}
        width={width}
        height={height}
        minHeight={minHeight}
        minWidth={minWidth}
        href={href}
        accessibilityLabel={accessibilityLabel}
        {...metaAttribute({ name: MetaConstants.Card, testID })}
        {...getStyledProps(rest)}
        {...makeAnalyticsAttribute(rest)}
      >
        <CardSurface
          height={height}
          minHeight={minHeight}
          padding={padding}
          borderRadius={borderRadius}
          elevation={elevation}
          textAlign={'left' as never}
          backgroundColor={backgroundColor}
        >
          {href ? (
            <LinkOverlay
              onClick={onClick}
              href={href}
              target={target}
              rel={rel ?? defaultRel}
              {...linkOverlayProps}
            />
          ) : null}
          {!href && onClick ? (
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

const Card = React.forwardRef(_Card);
const CardBody = assignWithoutSideEffects(_CardBody, { componentId: ComponentIds.CardBody });

export { Card, CardBody };
