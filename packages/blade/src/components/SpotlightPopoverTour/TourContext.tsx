/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import type { View } from 'react-native';
import { throwBladeError } from '~utils/logger';

/**
 * Tour step host element. Union (not Platform.Select) so shared context stays
 * assignable under both web and native typecheck configs.
 */
type TourElement = HTMLElement | View;

type TourContextProps = {
  attachStep: (id: string, ref: React.RefObject<TourElement>) => void;
  removeStep: (id: string) => void;
  /**
   * Native-only optional registration for ScrollView/FlatList parents when fiber walk fails.
   * Not part of the public consumer API.
   */
  registerScrollParent?: (scrollable: unknown) => void;
  /**
   * Native-only: notify tour to remask after a step layout change.
   */
  onStepLayout?: (id: string) => void;
} | null;

const TourContext = React.createContext<TourContextProps>(null);

const useTourContext = (): NonNullable<TourContextProps> => {
  const context = React.useContext(TourContext);

  if (!context) {
    throwBladeError({
      moduleName: 'Tour',
      message: 'useTourContext must be used within Tour',
    });
  }

  return context!;
};

export type { TourElement };
export { useTourContext, TourContext };
