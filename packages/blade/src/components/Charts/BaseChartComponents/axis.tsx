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

export type XAxisProps = ComponentProps<typeof RechartsXAxis>;
export type YAxisProps = ComponentProps<typeof RechartsYAxis>;
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
      stroke="#c5d0db"
      label={{
        //TODO: remove this hardcoding Value
        value: 'Months',
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
      {...props}
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
      stroke="#c5d0db"
      label={{
        //TODO: remove this hardcoding Value
        value: 'Active Users',
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
      {...props}
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
