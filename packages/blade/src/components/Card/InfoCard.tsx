import React from 'react';
import { Card, CardBody, CardTearLine } from './Card';
import type { CardProps } from './Card';
import type { BladeElementRef } from '~utils/types';

export type InfoCardProps = Omit<CardProps, 'variant' | 'children'> & {
  /**
   * Content for the emphasized header section.
   */
  topSection: React.ReactNode;
  /**
   * Content for the subtle body section.
   */
  bottomSection: React.ReactNode;
};

const _InfoCard: React.ForwardRefRenderFunction<BladeElementRef, InfoCardProps> = (
  { topSection, bottomSection, ...rest },
  ref,
): React.ReactElement => {
  return (
    <Card ref={ref} variant="info" {...rest}>
      <CardBody>{topSection}</CardBody>
      <CardTearLine />
      <CardBody>{bottomSection}</CardBody>
    </Card>
  );
};

const InfoCard = React.forwardRef(_InfoCard);

export { InfoCard };
