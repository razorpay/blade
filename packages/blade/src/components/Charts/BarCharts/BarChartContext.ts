import { createContext, useContext } from 'react';
// Context for chart orientation
interface BarChartContextType {
  layout?: 'horizontal' | 'vertical';
  activeIndex?: number;
  colorTheme: 'default' | 'informational';
}

export const BarChartContext = createContext<BarChartContextType>({
  layout: 'horizontal',
  activeIndex: undefined,
  colorTheme: 'default',
});

export const useBarChartContext = (): BarChartContextType => useContext(BarChartContext);
