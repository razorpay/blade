import React from 'react';
import { CardSurface } from './CardSurface';
import { CardProvider, useVerifyInsideCard } from './CardContext';
import Box from '~components/Box';

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
  surfaceLevel: 2 | 3;
};

const Card = ({ children, surfaceLevel = 3 }: CardProps): React.ReactElement => {
  return (
    <CardProvider>
      <CardSurface
        paddingLeft="spacing.7"
        paddingRight="spacing.7"
        paddingTop="spacing.6"
        paddingBottom="spacing.6"
        borderRadius="medium"
        surfaceLevel={surfaceLevel}
      >
        {children}
      </CardSurface>
    </CardProvider>
  );
};

type CardBodyProps = {
  children: React.ReactNode;
};

const CardBody = ({ children }: CardBodyProps): React.ReactElement => {
  useVerifyInsideCard('CardBody');

  return <Box>{children}</Box>;
};

export { Card, CardBody };
