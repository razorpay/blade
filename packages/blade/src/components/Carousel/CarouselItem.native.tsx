/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import React from 'react';
import { useCarouselContext } from './CarouselContext';
import BaseBox from '~components/Box/BaseBox';

type CarouselItemProps = {
  children: React.ReactNode;
};

const CarouselItem = ({ children }: CarouselItemProps): React.ReactElement => {
  const { slideWidth } = useCarouselContext();

  return (
    <BaseBox
      width={`${slideWidth}px`}
      margin="spacing.0"
      paddingLeft="spacing.4"
      paddingRight="spacing.4"
    >
      {children}
    </BaseBox>
  );
};

export { CarouselItem };
