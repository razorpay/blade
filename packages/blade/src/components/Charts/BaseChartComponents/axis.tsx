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
        fontWeight: theme.typography.fonts.weight.regular,
        letterSpacing: theme.typography.letterSpacings[100],
      }}
      stroke={theme.colors.surface.border.gray.muted}
      // eslint-disable-next-line react/no-unused-prop-types
      label={({ viewBox }: { viewBox: { x: number; y: number; width: number } }) => (
        <text
          x={viewBox.x + viewBox.width / 2 - 32}
          y={viewBox.y + 14.5 + 24}
          textAnchor="middle"
          fill={theme.colors.surface.text.gray.subtle}
          fontSize={theme.typography.fonts.size[75]}
          fontFamily={theme.typography.fonts.family.text}
          fontWeight={theme.typography.fonts.weight.medium}
          letterSpacing={theme.typography.letterSpacings[100]}
        >
          {props?.label}
        </text>
      )}
      dataKey={props?.dataKey}
    />
  );
};

export const YAxis: React.FC<YAxisProps> = (props) => {
  const { theme } = useTheme();

  return (
    <RechartsYAxis
      tick={{
        fill: theme.colors.surface.text.gray.normal,
        fontSize: theme.typography.fonts.size[75],
        fontFamily: theme.typography.fonts.family.text,
        fontWeight: theme.typography.fonts.weight.regular,
        letterSpacing: theme.typography.letterSpacings[100],
      }}
      stroke={theme.colors.surface.border.gray.muted}
      label={{
        value: props?.label,
        position: 'insideLeft',
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
