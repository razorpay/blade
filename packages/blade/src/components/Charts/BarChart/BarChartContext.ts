import { createContext, useContext } from 'react';
import type { BarChartContextType } from './types';

export const BarChartContext = createContext<BarChartContextType>({
  orientation: 'horizontal',
  activeIndex: undefined,
  colorTheme: 'default',
  totalBars: 0,
  isFirstActiveIndex: false,
  shouldPlayResetAnimation: false,
});

export const useBarChartContext = (): BarChartContextType => useContext(BarChartContext);
