import React from 'react';
import type { CarouselProps } from './types';
import { throwBladeError } from '~utils/logger';

type CarouselContextProps =
  | (Pick<
      CarouselProps,
      'carouselItemWidth' | 'shouldAddStartEndSpacing' | 'carouselItemAlignment'
    > & {
      carouselContainerRef: React.RefObject<HTMLDivElement>;
      setActiveIndicator: (value: React.SetStateAction<number>) => void;
      carouselId: string | null;
      totalNumberOfSlides: number;
      isResponsive?: boolean;
      visibleItems?: 1 | 2 | 3;
      /**
       * React native only
       */
      slideWidth?: number;
      activeSlide?: number;
    })
  | null;
const CarouselContext = React.createContext<CarouselContextProps>(null);

const useCarouselContext = (): NonNullable<CarouselContextProps> => {
  const state = React.useContext<CarouselContextProps>(CarouselContext);

  if (!state) {
    throwBladeError({
      moduleName: 'Carousel',
      message: 'useCarouselContext must be used within Carousel',
    });
  }

  return state!;
};

export { CarouselContext, useCarouselContext };
export type { CarouselContextProps };
