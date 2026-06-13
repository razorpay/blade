/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import type { FeedbackColors } from '~tokens/theme/theme';

type DrawerHeaderConfig = {
  color?: FeedbackColors;
  backgroundStyle?: 'default' | 'contiguous';
};

type DrawerContextType = {
  close: () => void;
  closeButtonRef?: React.MutableRefObject<any>;
  stackingLevel?: number;
  isExiting: boolean;
  setHeaderConfig?: (config: DrawerHeaderConfig) => void;
  headerConfig?: DrawerHeaderConfig;
};

const DrawerContext = React.createContext<DrawerContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {},
  isExiting: false,
});

export type { DrawerHeaderConfig };
export { DrawerContext };
