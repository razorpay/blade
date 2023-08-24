import React from 'react';
import type { CSSObject } from 'styled-components';
import styled from 'styled-components';
import { CardSurface } from './CardSurface';
import { CardProvider, useVerifyInsideCard, useVerifyAllowedComponents } from './CardContext';
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
import { castWebType, makeMotionTime } from '~utils';

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
  width?: BoxProps['width'];
  height?: BoxProps['height'];
  onClick?: () => void;
  isSelected?: boolean;
  href?: string;
  accessibilityLabel?: string;
  scaleOnHover?: boolean;
  onHover?: () => void;
  as?: 'label';
} & TestID &
  StyledPropsBlade;

const CardRoot = styled(BaseBox)<{
  isSelected?: boolean;
  isFocused?: boolean;
  scaleOnHover?: boolean;
}>(({ theme, isSelected, isFocused, scaleOnHover }) => {
  const selectedColor = isSelected ? theme.colors.brand.primary[500] : 'transparent';
  return {
    // Selected state
    // TODO: use thicker
    boxShadow: `0px 0px 0px ${theme.border.width.thick}px ${selectedColor}`,
    transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
    transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
    transitionProperty: 'transform, box-shadow',

    // link focused state
    ...(isFocused && {
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
    }),

    // Hover state
    ...(scaleOnHover && {
      '&:hover': {
        transform: 'scale(1.05)',
      },
    }),

    // uplift all the nested links so they receive clicks and events
    // https://www.sarasoueidan.com/blog/nested-links
    '& a[href]:not(.blade-card-linkoverlay)': {
      zIndex: 1,
      position: 'relative',
    },
  };
});

const LinkOverlay = styled.a(
  (): CSSObject => {
    return {
      position: 'static',
      '&:before': {
        content: "''",
        cursor: 'inherit',
        display: 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
      },
    };
  },
);

const Card = ({
  children,
  surfaceLevel = 2,
  elevation = 'lowRaised',
  testID,
  padding = 'spacing.7',
  width,
  height,
  onClick,
  isSelected,
  accessibilityLabel,
  scaleOnHover,
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

  return (
    <CardProvider>
      <CardRoot
        as={as}
        onMouseEnter={onHover}
        scaleOnHover={scaleOnHover}
        isSelected={isSelected}
        isFocused={isFocused}
        borderRadius="medium"
        onClick={onClick}
        width={width}
        height={height}
        {...metaAttribute({ name: MetaConstants.Card, testID })}
        {...getStyledProps(styledProps)}
        {...makeAccessible({ label: as === 'label' ? accessibilityLabel : undefined })}
      >
        <CardSurface
          height={height}
          padding={padding}
          borderRadius="medium"
          surfaceLevel={surfaceLevel}
          elevation={elevation}
          textAlign={'left' as never}
        >
          {href ? (
            <LinkOverlay
              {...makeAccessible({ label: accessibilityLabel })}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
              }}
              className="blade-card-linkoverlay"
              href={href}
            />
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

/*
# TODO
- Scope Link to only do normal navagitation
- Provide accessibilityLabel for linkable Card
- Go with ScaleOnHover
- Go with method 1 for multi select
*/
