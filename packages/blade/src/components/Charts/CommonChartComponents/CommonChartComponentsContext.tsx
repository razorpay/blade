import { createContext, useContext } from 'react';
import type { CommonChartComponentsContextType } from './types';

export const CommonChartComponentsContext = createContext<CommonChartComponentsContextType>({
  dataColorMapping: undefined,
  setDataColorMapping: () => undefined,
  chartName: undefined,
  hiddenDataKeys: undefined,
  onLegendClick: () => undefined,
});

export const useCommonChartComponentsContext = (): CommonChartComponentsContextType =>
  useContext(CommonChartComponentsContext);
