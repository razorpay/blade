import React from 'react';
import { CardFooter } from './CardFooter';
import { CardHeader } from './CardHeader';
import { CardSurface } from './CardSurface';
import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';
import { getIn } from '~utils';

export type CardProps = {
  children: React.ReactNode;
  backgroundLevel: 2 | 3;
};

const Card = ({ children, backgroundLevel = 3 }: CardProps): React.ReactElement => {
  const { theme } = useTheme();
  const backgroundColor = getIn(
    theme,
    `colors.surface.background.level${backgroundLevel}.lowContrast`,
  );

  return (
    <CardSurface
      paddingLeft="spacing.7"
      paddingRight="spacing.7"
      paddingTop="spacing.6"
      paddingBottom="spacing.6"
      borderRadius="medium"
      background={backgroundColor}
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

export { Card };
