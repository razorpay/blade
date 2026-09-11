import { createContext, useContext } from 'react';
import type { BarChartContextType } from './types';

export const BarChartContext = createContext<BarChartContextType>({
  layout: 'horizontal',
  activeIndex: undefined,
  colorTheme: 'categorical',
  totalBars: 0,
  hoveredDataKey: null,
  hoveredBarIndex: null,
  setHoveredBar: () => undefined,
});

export const useBarChartContext = (): BarChartContextType => useContext(BarChartContext);
