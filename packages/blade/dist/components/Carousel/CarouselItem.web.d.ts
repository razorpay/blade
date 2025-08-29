import { default as React } from 'react';
import { CarouselProps } from './types';
import { DataAnalyticsAttribute } from '../../utils/types';
type CarouselItemProps = {
    id?: string;
    index?: number;
    children: React.ReactNode;
    shouldHaveStartSpacing?: boolean;
    shouldHaveEndSpacing?: boolean;
    snapAlign?: CarouselProps['snapAlign'];
    gap?: CarouselProps['gap'];
} & DataAnalyticsAttribute;
declare const CarouselItem: ({ children, shouldHaveStartSpacing, shouldHaveEndSpacing, id, index, snapAlign, gap, ...rest }: CarouselItemProps) => React.ReactElement;
export { CarouselItem };
