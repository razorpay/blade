import { createContext, useContext } from 'react';
import type { CommonChartComponentsContextType } from './types';

export const CommonChartComponentsContext = createContext<CommonChartComponentsContextType>({
  dataColorMapping: undefined,
  setDataColorMapping: () => undefined,
  chartName: undefined,
  selectedDataKeys: undefined,
  setSelectedDataKeys: () => undefined,
});

export const useCommonChartComponentsContext = (): CommonChartComponentsContextType =>
  useContext(CommonChartComponentsContext);
