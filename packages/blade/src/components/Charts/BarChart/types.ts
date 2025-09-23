import type { ComponentProps } from 'react';
import type { BarProps as RechartsBarProps } from 'recharts';
import type { m } from 'framer-motion';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import type { colorTheme } from '../utils';
import type {
  BaseBoxProps,
  FlexboxProps,
  GridProps,
} from '~components/Box/BaseBox/types/propsTypes';

type ChartBarProps = {
  /**
   * The data key of the bar chart.
   */
  dataKey: RechartsBarProps['dataKey'];
  /**
   * The name of the bar chart.
   */
  name?: RechartsBarProps['name']; // default to dataKey
  /**
   * The color of the bar chart.
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * The stack id of the bar chart.
   */
  stackId?: RechartsBarProps['stackId'];
  /**
   * The active bar of the bar chart.
   */
  activeBar?: RechartsBarProps['activeBar'];
  /**
   * The label of the bar chart.
   */
  label?: RechartsBarProps['label'];
  /**
   * The show legend of the bar chart.
   */
  showLegend?: boolean;
  /**
   * The index of the bar chart.
   * @private
   */
  _index?: number;
};

type data = {
  [key: string]: string | number;
};

type ChartBarWrapperProps = {
  children?: React.ReactNode;
  /**
   * The color theme of the bar chart.
   */
  colorTheme?: colorTheme;
  /**
   * The layout of the bar chart.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Chart data to be rendered
   */
  data: data[];
} & Partial<Omit<BaseBoxProps, keyof FlexboxProps | keyof GridProps>>;

interface BarChartContextType {
  orientation?: 'horizontal' | 'vertical';
  activeIndex?: number;
  colorTheme: colorTheme;
  totalBars: number;
  isFirstActiveIndex?: boolean;
  shouldPlayResetAnimation?: boolean;
}

type MotionRectProps = ComponentProps<typeof m.rect> & {
  animationTrigger: string;
  initialOpacity?: number;
  onFadeInComplete?: () => void;
  onFadeOutComplete?: () => void;
  onResetComplete?: () => void;
  fillOpacity: number;
};

export type { ChartBarProps, ChartBarWrapperProps, BarChartContextType, MotionRectProps };
