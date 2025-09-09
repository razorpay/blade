import { createContext, useContext } from 'react';
// Context for chart orientation
interface DonutChartContextType {
  type: 'donut' | 'pie';
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
}

export const DonutChartContext = createContext<DonutChartContextType>({
  type: 'donut',
  isHovered: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsHovered: () => {},
});

export const useDonutChartContext = (): DonutChartContextType => useContext(DonutChartContext);
