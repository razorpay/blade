import React from 'react';
import { CardSurface } from './CardSurface';
import { CardProvider, useVerifyInsideCard, useVerifyAllowedComponents } from './CardContext';
import { LinkOverlay } from './LinkOverlay';
import { CardRoot } from './CardRoot';
import type { LinkOverlayProps } from './types';
import type { SpacingValueType } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { Elevation } from '~tokens/global';
import type { SurfaceLevels } from '~tokens/theme/theme';
import type { BoxProps } from '~components/Box';
import { makeAccessible } from '~utils/makeAccessible';
import { isReactNative } from '~utils';

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
  CardHeaderText: 'CardHeaderText',
  CardHeaderLink: 'CardHeaderLink',
  CardHeaderIconButton: 'CardHeaderIconButton',
};

export type CardProps = {
  /**
   * Card contents
   */
  children: React.ReactNode;
  /**
   * Sets the background color of the Card according to the surface level tokens
   *
   * eg: `theme.colors.surface.background.level1`
   *
   * @default `2`
   *
   * **Description:**
   *
   * - 2: Used in layouts which are on top of the main background
   * - 3: Used over the cards template or as a text input backgrounds.
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-colors--page#-theme-tokens
   * - Figma: https://shorturl.at/fsvwK
   */
  surfaceLevel?: Exclude<SurfaceLevels, 1>;
  /**
   * Sets the elevation for Cards
   *
   * eg: `theme.elevation.midRaised`
   *
   * @default `theme.elevation.lowRaised`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-elevation--page
   */
  elevation?: keyof Elevation;
  /**
   * Sets the padding equally on all sides. Only few `spacing` tokens are allowed deliberately
   * @default `spacing.7`
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-spacing--page
   */
  padding?: Extract<SpacingValueType, 'spacing.0' | 'spacing.3' | 'spacing.5' | 'spacing.7'>;
  /**
   * Sets the width of the card
   */
  width?: BoxProps['width'];
  /**
   * Sets the height of the card
   */
  height?: BoxProps['height'];
  /**
   * If `true`, the card will be in selected state
   * Card will have a visual ring around it.
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
   * Sets the accessibility label for the card
   * This is useful when the card has an `href` prop and is used as a link
   * Setting this will announce the label when the card is focused
   */
  accessibilityLabel?: string;
  /**
   * If `true`, the card will scale up on hover
   *
   * On mobile devices it will scale down on press
   *
   * @default false
   */
  scaleOnHover?: boolean;
  /**
   * Callback to trigger when the card is hovered
   */
  onHover?: () => void;
  /**
   * Callback to trigger when the card is clicked
   */
  onClick?: () => void;
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
  StyledPropsBlade;

const Card = ({
  children,
  surfaceLevel = 2,
  elevation = 'lowRaised',
  testID,
  padding = 'spacing.7',
  width,
  height,
  onClick,
  isSelected = false,
  accessibilityLabel,
  scaleOnHover = false,
  onHover,
  href,
  as,
  ...styledProps
}: CardProps): React.ReactElement => {
  const [isFocused, setIsFocused] = React.useState(false);
  useVerifyAllowedComponents(children, 'Card', [
    ComponentIds.CardHeader,
    ComponentIds.CardBody,
    ComponentIds.CardFooter,
  ]);

  const linkOverlayProps: LinkOverlayProps = {
    ...metaAttribute({ name: 'card-link-overlay' }),
    ...makeAccessible({ label: accessibilityLabel, pressed: isSelected }),
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
  };

  return (
    <CardProvider>
      <CardRoot
        as={as}
        onMouseEnter={onHover}
        scaleOnHover={scaleOnHover}
        isSelected={isSelected}
        isFocused={isFocused}
        borderRadius="medium"
        // on react native we need to pass onClick to root, because we don't need the LinkOverlay in RN
        onClick={isReactNative() ? onClick : undefined}
        width={width}
        height={height}
        href={href}
        accessibilityLabel={accessibilityLabel}
        {...metaAttribute({ name: MetaConstants.Card, testID })}
        {...getStyledProps(styledProps)}
      >
        <CardSurface
          height={height}
          padding={padding}
          borderRadius="medium"
          surfaceLevel={surfaceLevel}
          elevation={elevation}
          textAlign={'left' as never}
        >
          {href ? <LinkOverlay href={href} {...linkOverlayProps} /> : null}
          {onClick ? <LinkOverlay as="button" onClick={onClick} {...linkOverlayProps} /> : null}
          {children}
        </CardSurface>
      </CardRoot>
    </CardProvider>
  );
};

type CardBodyProps = {
  children: React.ReactNode;
  height?: BoxProps['height'];
} & TestID;

const _CardBody = ({ height, children, testID }: CardBodyProps): React.ReactElement => {
  useVerifyInsideCard('CardBody');

  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.CardBody, testID })} height={height}>
      {children}
    </BaseBox>
  );
};

const CardBody = assignWithoutSideEffects(_CardBody, { componentId: ComponentIds.CardBody });

export { Card, CardBody };
