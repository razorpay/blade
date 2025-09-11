import React from 'react';
import type { ComponentProps } from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area as RechartsArea,
  ResponsiveContainer,
} from 'recharts';
import type { AreaProps as RechartAreaProps } from 'recharts';

import { useChartsColorTheme } from '../utils';
import { useTheme } from '~components/BladeProvider';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import type { ChartColorCategories, ChartCategoricalEmphasis } from '~tokens/theme/theme';
import getIn from '~utils/lodashButBetter/get';
import { throwBladeError } from '~utils/logger';

const MAX_AREAS = 10;
// BladeColorToken type for charts - only allows categorical chart colors for area charts
export type BladeColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

// Chart-specific interfaces based on user specifications
interface AreaProps {
  type?: 'step' | 'stepAfter' | 'stepBefore' | 'linear' | 'monotone';
  connectNulls?: boolean;
  showLegend?: boolean;
  dataKey: string;
  name: string;
  stackId?: string | number;
  color?: BladeColorToken;
  dot?: RechartAreaProps['dot'];
  activeDot?: RechartAreaProps['activeDot'];
  /**
   * @private
   */
  _index?: number; // Add this for internal use
  /**
   * @private
   */
  _colorTheme?: 'default' | 'informational';
}

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

type AreaChartProps = Omit<ComponentProps<typeof RechartsAreaChart>, 'margin'> &
  StyledPropsBlade & {
    children?: React.ReactNode;
    colorTheme?: 'default' | 'informational';
  };

// Main components
const AreaChart: React.FC<AreaChartProps> = ({ children, colorTheme = 'default', ...props }) => {
  const styledProps = getStyledProps(props);

  // Predefined margins - not exposed to user
  const defaultMargin = {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16,
  };

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
    <BaseBox {...styledProps} {...metaAttribute({ name: 'area-chart' })} width="100%" height="100%">
      <ResponsiveContainer>
        <RechartsAreaChart {...props} margin={defaultMargin}>
          {modifiedChildren}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </BaseBox>
  );
};

export type { AreaChartProps, AreaProps };
export { AreaChart, Area };
