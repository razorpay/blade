import { createContext, useContext } from 'react';
// Context for chart orientation
interface PieChartContextType {
  type: 'donut' | 'pie';
  isHovered: boolean;
  setIsHovered: (isHovered: boolean) => void;
}

export const PieChartContext = createContext<PieChartContextType>({
  type: 'donut',
  isHovered: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsHovered: () => {},
});

export const usePieChartContext = (): PieChartContextType => useContext(PieChartContext);
