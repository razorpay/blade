import React from 'react';
import { CardSurface } from './CardSurface';
import { CardProvider, useVerifyInsideCard, useVerifyAllowedComponents } from './CardContext';
import BaseBox from '~components/Box/BaseBox';
import type { WithComponentId } from '~utils';
import { metaAttribute, MetaConstants } from '~utils';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { TestID } from '~src/_helpers/types';

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
   * **Description:**
   *
   * - 2: Used in layouts which are on top of the main background
   * - 3: Used over the cards template or as a text input backgrounds.
   *
   * **Links:**
   * - Docs: https://blade.razorpay.com/?path=/docs/tokens-colors--page#-theme-tokens
   * - Figma: https://shorturl.at/fsvwK
   */
  surfaceLevel?: 2 | 3;
} & TestID &
  StyledPropsBlade;

const Card = ({
  children,
  surfaceLevel = 3,
  testID,
  ...styledProps
}: CardProps): React.ReactElement => {
  useVerifyAllowedComponents(children, 'Card', [
    ComponentIds.CardHeader,
    ComponentIds.CardBody,
    ComponentIds.CardFooter,
  ]);

  return (
    <CardProvider>
      <CardSurface
        {...metaAttribute({ name: MetaConstants.Card, testID })}
        paddingLeft="spacing.7"
        paddingRight="spacing.7"
        paddingTop="spacing.6"
        paddingBottom="spacing.6"
        borderRadius="medium"
        surfaceLevel={surfaceLevel}
        {...getStyledProps(styledProps)}
      >
        {children}
      </CardSurface>
    </CardProvider>
  );
};

type CardBodyProps = {
  children: React.ReactNode;
} & TestID;

const CardBody: WithComponentId<CardBodyProps> = ({ children, testID }) => {
  useVerifyInsideCard('CardBody');

  return <BaseBox {...metaAttribute({ name: MetaConstants.CardBody, testID })}>{children}</BaseBox>;
};
CardBody.componentId = ComponentIds.CardBody;

export { Card, CardBody };
