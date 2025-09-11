import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  ResponsiveContainer,
} from 'recharts';
import { useChartsColorTheme } from '../utils';
import type { AreaProps, AreaChartProps } from './types';
import { useTheme } from '~components/BladeProvider';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import getIn from '~utils/lodashButBetter/get';
import { throwBladeError } from '~utils/logger';

const MAX_AREAS = 10;

const Area: React.FC<AreaProps> = ({
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
  const themeColors = useChartsColorTheme({ colorTheme: _colorTheme ?? 'default' });
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

// Main components
const AreaChart: React.FC<AreaChartProps> = ({ data, children, colorTheme = 'default' }) => {
  const modifiedChildren = React.useMemo(() => {
    let AreaChartIndex = 0;
    return React.Children.map(children, (child) => {
      if (__DEV__ && AreaChartIndex >= MAX_AREAS) {
        throwBladeError({
          message: `Too many areas configured. Maximum allowed is ${MAX_AREAS}.`,
          moduleName: 'AreaChart',
        });
      }
      if (React.isValidElement(child) && child.type === Area) {
        return React.cloneElement(child, {
          _index: AreaChartIndex++,
          _colorTheme: colorTheme,
        } as Partial<AreaProps>);
      }
      return child;
    });
  }, [children, colorTheme]);

  return (
    <BaseBox {...metaAttribute({ name: 'area-chart' })} width="100%" height="100%">
      <ResponsiveContainer>
        <RechartsAreaChart data={data}>{modifiedChildren}</RechartsAreaChart>
      </ResponsiveContainer>
    </BaseBox>
  );
};

export { AreaChart, Area };
