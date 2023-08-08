import React from 'react';
import type { CarouselProps } from './types';

type CarouselContextProps =
  | (Pick<CarouselProps, 'visibleItems' | 'carouselItemWidth' | 'shouldAddStartEndSpacing'> & {
      carouselContainerRef: React.RefObject<HTMLDivElement>;
      setActiveIndicator: (value: React.SetStateAction<number>) => void;
      carouselId: string | null;
      totalNumberOfSlides: number;
    })
  | null;
const CarouselContext = React.createContext<CarouselContextProps>(null);

const useCarouselContext = (): NonNullable<CarouselContextProps> => {
  const state = React.useContext<CarouselContextProps>(CarouselContext);

  if (!state) {
    throw new Error('[Blade Carousel]: useCarouselContext must be used within Carousel');
  }

  return state;
};

export { CarouselContext, useCarouselContext };
export type { CarouselContextProps };
