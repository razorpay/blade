import React from 'react';
import { CardSurface } from './CardSurface';
import { CardProvider } from './CardContext';
import Box from '~components/Box';

export type CardProps = {
  children: React.ReactNode;
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
  return <Box>{children}</Box>;
};

export { Card, CardBody };
