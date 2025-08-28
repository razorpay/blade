import React from 'react';
import type { ComponentProps } from 'react';
import {
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
} from 'recharts';
import { useTheme } from '~components/BladeProvider';

export interface ReferenceLineProps {
  y?: number;
  x?: number;
  label?: string;
  labelPosition?: 'left' | 'right' | 'top' | 'bottom';
  labelOffset?: number;
}

export type XAxisProps = {
  label?: string;
  dataKey?: string;
};
export type YAxisProps = {
  label?: string;
  dataKey?: string;
};
export type CartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;

export const XAxis: React.FC<XAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsXAxis
      tick={{
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
      }}
      stroke={theme.colors.surface.border.gray.muted}
      label={{
        //TODO: remove this hardcoding Value
        value: props?.label,
        position: 'insideBottom',
        //TODO: need to change this offset.
        offset: -10,
        style: {
          textAnchor: 'middle',
          fill: theme.colors.surface.text.gray.subtle,
          fontSize: theme.typography.fonts.size[75],
          fontWeight: theme.typography.fonts.weight.medium,
          fontFamily: theme.typography.fonts.family.text,
          letterSpacing: theme.typography.letterSpacings[100],
          lineHeight: theme.typography.lineHeights[500],
        },
      }}
      dataKey={props?.dataKey}
    />
  );
};

export const YAxis: React.FC<YAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsYAxis
      // axisLine={false}
      // tickLine={false}
      tick={{
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
      }}
      stroke={theme.colors.surface.border.gray.muted}
      label={{
        //TODO: remove this hardcoding Value
        value: props?.label,
        position: 'insideLeft',
        //TODO: need to change this offset.
        offset: -10,
        style: {
          textAnchor: 'middle',
          fill: theme.colors.surface.text.gray.subtle,
          fontSize: theme.typography.fonts.size[75],
          fontWeight: theme.typography.fonts.weight.medium,
          fontFamily: theme.typography.fonts.family.text,
          letterSpacing: theme.typography.letterSpacings[100],
          lineHeight: theme.typography.lineHeights[500],
        },
        angle: -90,
        fill: theme.colors.surface.text.gray.subtle,
      }}
      dataKey={props?.dataKey}
    />
  );
};

export const CartesianGrid: React.FC<CartesianGridProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsCartesianGrid
      stroke={theme.colors.surface.border.gray.muted}
      vertical={false}
      {...props}
    />
  );
};
