import { default as React } from 'react';
import { CarouselProps } from './types';
type CarouselContextProps = (Pick<CarouselProps, 'carouselItemWidth' | 'shouldAddStartEndSpacing' | 'carouselItemAlignment'> & {
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
}) | null;
declare const CarouselContext: React.Context<CarouselContextProps>;
declare const useCarouselContext: () => NonNullable<CarouselContextProps>;
export { CarouselContext, useCarouselContext };
export type { CarouselContextProps };
