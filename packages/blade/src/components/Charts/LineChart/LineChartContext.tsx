import { createContext, useContext } from 'react';

type LineChartContextType = {
  hoveredDataKey: string | null;
  setHoveredDataKey: (dataKey: string | null) => void;
};

export const LineChartContext = createContext<LineChartContextType>({
  hoveredDataKey: null,
  setHoveredDataKey: () => undefined,
});

export const useLineChartContext = (): LineChartContextType => useContext(LineChartContext);
