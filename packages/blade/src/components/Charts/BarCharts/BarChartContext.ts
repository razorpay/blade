import { createContext, useContext } from 'react';
// Context for chart orientation
interface BarChartContextType {
  layout?: 'horizontal' | 'vertical';
}

export const BarChartContext = createContext<BarChartContextType>({ layout: 'horizontal' });

export const useBarChartContext = (): BarChartContextType => useContext(BarChartContext);
