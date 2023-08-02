import React from 'react';
import type { CarouselProps } from './types';
import type { SpacingValueType } from '~components/Box/BaseBox';

type CarouselContextProps =
  | (Pick<CarouselProps, 'visibleItems'> & {
      carouselItemWidth?: SpacingValueType;
      carouselContainerRef: React.RefObject<HTMLDivElement>;
      setActiveIndicator: (value: React.SetStateAction<number>) => void;
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
