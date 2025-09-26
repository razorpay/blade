import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  ResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import type { ChartAreaProps, ChartAreaWrapperProps } from './types';
import { componentIds } from './componentIds';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const Area: React.FC<ChartAreaProps> = ({
  color,
  type = 'monotone',
  connectNulls = false,
  showLegend = true,
  stackId = 1,
  dot = false,
  activeDot = true,
  _index,
  _colorTheme,
  ...props
}) => {
  const { theme } = useTheme();
  const themeColors = useChartsColorTheme({ colorTheme: _colorTheme });
  const colorToken = color ? getIn(theme.colors, color) : themeColors[_index ?? 0];
  const animationBegin = theme.motion.delay.gentle;
  const animationDuration = theme.motion.duration.xgentle;

  return (
    <RechartsArea
      {...props}
      fill={colorToken}
      stroke={colorToken}
      fillOpacity={0.09}
      type={type}
      connectNulls={connectNulls}
      legendType={showLegend ? 'rect' : 'none'}
      strokeWidth={3}
      dot={dot}
      stackId={stackId}
      activeDot={activeDot}
      animationBegin={animationBegin}
      animationDuration={animationDuration}
    />
  );
};

const ChartArea = assignWithoutSideEffects(Area, {
  componentId: componentIds.ChartArea,
});

// Main components
const ChartAreaWrapper: React.FC<ChartAreaWrapperProps & TestID & DataAnalyticsAttribute> = ({
  data,
  children,
  testID,
  colorTheme = 'default',
  ...restProps
}) => {
  const modifiedChildren = React.useMemo(() => {
    let AreaChartIndex = 0;
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === componentIds.ChartArea) {
        return React.cloneElement(child, {
          _index: AreaChartIndex++,
          _colorTheme: colorTheme,
        } as Partial<ChartAreaProps>);
      }
      return child;
    });
  }, [children, colorTheme]);

  return (
    <BaseBox
      {...metaAttribute({ name: 'chart-area-container', testID })}
      {...makeAnalyticsAttribute(restProps)}
      {...restProps}
      width="100%"
      height="100%"
    >
      <ResponsiveContainer>
        <RechartsAreaChart data={data}>{modifiedChildren}</RechartsAreaChart>
      </ResponsiveContainer>
    </BaseBox>
  );
};

export type { ChartAreaWrapperProps, ChartAreaProps };
export { ChartAreaWrapper, ChartArea };
