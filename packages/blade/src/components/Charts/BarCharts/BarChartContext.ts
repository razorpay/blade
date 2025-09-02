import { createContext, useContext } from 'react';
// Context for chart orientation
interface BarChartContextType {
  layout?: 'horizontal' | 'vertical';
  activeIndex?: number;
}

export const BarChartContext = createContext<BarChartContextType>({ layout: 'horizontal' , activeIndex : undefined });

export const useBarChartContext = (): BarChartContextType => useContext(BarChartContext);
