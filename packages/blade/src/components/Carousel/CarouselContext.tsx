import React from 'react';
import type { CarouselProps } from './types';
import type { SpacingValueType } from '~components/Box/BaseBox';

type CarouselContextProps =
  | (Pick<CarouselProps, 'visibleItems'> & { carouselItemWidth?: SpacingValueType })
  | null;
const CarouselContext = React.createContext<CarouselContextProps>(null);

const useCarouselContext = (): CarouselContextProps => {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('[Blade Carousel]: useCarouselContext must be used within Carousel');
  }

  return context;
};

export { CarouselContext, useCarouselContext };
