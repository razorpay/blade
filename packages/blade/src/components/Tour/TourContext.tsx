/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { throwBladeError } from '~utils/logger';

type TourContextProps = {
  attachStep: (id: string, ref: React.RefObject<HTMLElement>) => void;
  removeStep: (id: string, ref: React.RefObject<HTMLElement>) => void;
} | null;

const TourContext = React.createContext<TourContextProps>(null);

const useTourContext = (): NonNullable<TourContextProps> => {
  const context = React.useContext(TourContext);

  if (!context) {
    throwBladeError({
      message: 'useTourContext must be used within a TourProvider',
      moduleName: 'Tour',
    });
  }

  return context!;
};

export { useTourContext, TourContext };
