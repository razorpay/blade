import { createContext, useContext } from 'react';
import type { BarChartContextType } from './types';

export const BarChartContext = createContext<BarChartContextType>({
  layout: 'horizontal',
  activeIndex: undefined,
  colorTheme: 'default',
  totalBars: 0,
});

export const useBarChartContext = (): BarChartContextType => useContext(BarChartContext);
