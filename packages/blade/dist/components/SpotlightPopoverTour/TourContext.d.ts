import { default as React } from 'react';
type TourContextProps = {
    attachStep: (id: string, ref: React.RefObject<HTMLElement>) => void;
    removeStep: (id: string) => void;
} | null;
declare const TourContext: React.Context<TourContextProps>;
declare const useTourContext: () => NonNullable<TourContextProps>;
export { useTourContext, TourContext };
