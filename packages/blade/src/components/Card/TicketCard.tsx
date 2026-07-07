import React from 'react';
import { Card, CardBody, CardTearLine } from './Card';
import type { CardProps } from './Card';
import type { BladeElementRef } from '~utils/types';

export type TicketCardProps = Omit<CardProps, 'variant' | 'children'> & {
  /**
   * Content for the section above the tear line.
   */
  topSection: React.ReactNode;
  /**
   * Content for the section below the tear line.
   */
  bottomSection: React.ReactNode;
};

const _TicketCard: React.ForwardRefRenderFunction<BladeElementRef, TicketCardProps> = (
  { topSection, bottomSection, ...rest },
  ref,
): React.ReactElement => {
  return (
    <Card ref={ref} variant="ticket" {...rest}>
      <CardBody>{topSection}</CardBody>
      <CardTearLine />
      <CardBody>{bottomSection}</CardBody>
    </Card>
  );
};

const TicketCard = React.forwardRef(_TicketCard);

export { TicketCard };
