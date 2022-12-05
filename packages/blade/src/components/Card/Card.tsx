import React from 'react';
import { CardFooter, CardFooterLeading, CardFooterTrailing } from './CardFooter';
import {
  CardHeader,
  CardHeaderIcon,
  CardHeaderCounter,
  CardHeaderLeading,
  CardHeaderTrailing,
} from './CardHeader';
import { CardSurface } from './CardSurface';
import Box from '~components/Box';

export type CardProps = {
  children: React.ReactNode;
  surfaceLevel: 2 | 3;
};

const Card = ({ children, surfaceLevel = 3 }: CardProps): React.ReactElement => {
  return (
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
  );
};

type CardBodyProps = {
  children: React.ReactNode;
};

const CardBody = ({ children }: CardBodyProps): React.ReactElement => {
  return <Box>{children}</Box>;
};

Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Header = CardHeader;
Card.HeaderLeading = CardHeaderLeading;
Card.HeaderTrailing = CardHeaderTrailing;
Card.FooterLeading = CardFooterLeading;
Card.FooterTrailing = CardFooterTrailing;

export { Card, CardHeaderIcon, CardHeaderCounter };
