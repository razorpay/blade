import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import type { ChartWrapperDisplayProps } from './types';
import {
  ChartLineWrapper,
  ChartLine,
  ChartAreaWrapper,
  ChartArea,
  ChartBarWrapper,
  ChartBar,
  ChartDonutWrapper,
  ChartDonut,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '~components/Charts';
import { Box } from '~components/Box';
import { Text } from '~components/Typography/Text';

const donutData = [
  { name: 'UPI', value: 52000 },
  { name: 'Cards', value: 24000 },
  { name: 'Netbanking', value: 14000 },
  { name: 'Wallets', value: 6000 },
];

const categoryData = [
  { method: 'UPI', online: 98000, offline: 36500 },
  { method: 'Cards', online: 51000, offline: 21500 },
  { method: 'Netbanking', online: 24000, offline: 6000 },
  { method: 'Payment links', online: 18000, offline: 4000 },
];

const data = [
  { month: 'Jan', online: 42000, offline: 18000 },
  { month: 'Feb', online: 51000, offline: 21500 },
  { month: 'Mar', online: 47500, offline: 26000 },
  { month: 'Apr', online: 68000, offline: 24000 },
  { month: 'May', online: 74500, offline: 31000 },
  { month: 'Jun', online: 98000, offline: 36500 },
];

/** `default` leaves the prop unset, so the v2 default applies. */
type Unset = 'default';
type OnOff = Unset | 'on' | 'off';

/** Each control is named for the component and the prop it sets. */
type ChartDisplayControlsArgs = {
  version: 'v1' | 'v2';
  gridShowBorder: 'on' | 'off';
  yAxisLabelPlacement: Unset | 'left' | 'right' | 'overlap';
  gridHorizontal: OnOff;
  gridLineWidth: Unset | 'thin' | 'thinner';
  legendPlacement: Unset | 'top' | 'bottom';
  donutLegendPlacement: Unset | 'top' | 'bottom' | 'left' | 'right';
  showLegend: 'on' | 'off';
  legendGap:
    | Unset
    | 'spacing.3'
    | 'spacing.4'
    | 'spacing.5'
    | 'spacing.6'
    | 'spacing.7'
    | 'spacing.8';
  lineStyle: 'solid' | 'dashed';
  valueFormat: 'none' | 'currency';
  chartWidth: number;
  showEdgeGuides: boolean;
};

const unset = <T extends string>(value: T | Unset): T | undefined =>
  value === 'default' ? undefined : value;
const onOff = (value: OnOff): boolean | undefined =>
  value === 'default' ? undefined : value === 'on';

/** The props of the wrapper: `version` and `valueFormat` only. */
const toWrapperProps = (args: ChartDisplayControlsArgs): ChartWrapperDisplayProps => ({
  version: args.version,
  valueFormat: args.valueFormat === 'currency' ? { type: 'currency', currency: 'INR' } : undefined,
});

/** The props of ChartCartesianGrid: `showBorder`, `lineWidth` and recharts' `horizontal`. */
const toGridProps = (
  args: ChartDisplayControlsArgs,
): React.ComponentProps<typeof ChartCartesianGrid> => ({
  showBorder: args.gridShowBorder === 'on',
  lineWidth: unset(args.gridLineWidth),
  horizontal: onOff(args.gridHorizontal),
});

const ChartCard = ({
  title,
  width,
  showEdgeGuides,
  children,
}: {
  title: string;
  width: number;
  showEdgeGuides: boolean;
  children: React.ReactNode;
}): React.ReactElement => (
  <Box display="flex" flexDirection="column" gap="spacing.3">
    <Text size="medium" weight="semibold">
      {title}
    </Text>
    {/* A dashed outline at the chart's content edges, to check the label column. */}
    <div
      style={{
        width,
        height: 260,
        outline: showEdgeGuides ? '1px dashed #E5484D' : undefined,
      }}
    >
      {children}
    </div>
  </Box>
);

const ChartDisplayControlsTemplate: StoryFn<ChartDisplayControlsArgs> = (args) => {
  const display = toWrapperProps(args);
  const gridProps = toGridProps(args);
  const { chartWidth: width, showEdgeGuides } = args;
  const legendGap = unset(args.legendGap);
  // A ChartLegend child shows the legend. With none, the chart has no legend.
  const legend = (placement: 'top' | 'bottom' | 'left' | 'right' | undefined): React.ReactNode =>
    args.showLegend === 'on' ? (
      <ChartLegend key="legend" placement={placement} gap={legendGap} />
    ) : null;
  // An array, not a fragment: the wrappers read their direct children.
  const common = [
    <ChartCartesianGrid key="grid" {...gridProps} />,
    <ChartXAxis key="x" dataKey="month" />,
    <ChartYAxis key="y" labelPlacement={unset(args.yAxisLabelPlacement)} />,
    <ChartTooltip key="tooltip" />,
    legend(unset(args.legendPlacement)),
  ];
  return (
    <Box display="flex" flexWrap="wrap" gap="spacing.9" padding="spacing.5">
      <ChartCard title="Line" width={width} showEdgeGuides={showEdgeGuides}>
        <ChartLineWrapper data={data} {...display}>
          {common}
          <ChartLine dataKey="online" name="Online" />
          <ChartLine dataKey="offline" name="Offline" strokeStyle={args.lineStyle} />
        </ChartLineWrapper>
      </ChartCard>
      <ChartCard title="Area" width={width} showEdgeGuides={showEdgeGuides}>
        <ChartAreaWrapper data={data} {...display}>
          {common}
          <ChartArea dataKey="online" name="Online" />
          <ChartArea dataKey="offline" name="Offline" />
        </ChartAreaWrapper>
      </ChartCard>
      <ChartCard title="Bar" width={width} showEdgeGuides={showEdgeGuides}>
        <ChartBarWrapper data={data} {...display}>
          {common}
          <ChartBar dataKey="online" name="Online" />
          <ChartBar dataKey="offline" name="Offline" />
        </ChartBarWrapper>
      </ChartCard>
      {/* Categories on the Y axis: always lines and a left column. See the story description. */}
      <ChartCard title="Horizontal bar" width={width} showEdgeGuides={showEdgeGuides}>
        <ChartBarWrapper data={categoryData} layout="vertical" {...display}>
          <ChartCartesianGrid {...gridProps} />
          <ChartXAxis type="number" />
          <ChartYAxis type="category" dataKey="method" />
          <ChartTooltip />
          {legend(unset(args.legendPlacement))}
          <ChartBar dataKey="online" name="Online" stackId="method" />
          <ChartBar dataKey="offline" name="Offline" stackId="method" />
        </ChartBarWrapper>
      </ChartCard>
      {/* The donut has a legend and no axes: only the legend props apply. */}
      <ChartCard title="Donut" width={width} showEdgeGuides={showEdgeGuides}>
        <ChartDonutWrapper {...display}>
          <ChartDonut dataKey="value" nameKey="name" data={donutData} />
          <ChartTooltip />
          {legend(unset(args.donutLegendPlacement))}
        </ChartDonutWrapper>
      </ChartCard>
    </Box>
  );
};

/**
 * Every display control of the line, area, bar and donut charts, as a live control. Each control
 * names the component and the prop it sets. `version` picks the look: `v1` renders as Blade
 * master and ignores the other controls. `v2` takes them. `default` leaves a prop unset, so the
 * v2 default applies. `lineStyle` sets `strokeStyle` on the second line.
 *
 * - The wrapper takes `version` and `valueFormat`.
 * - ChartCartesianGrid takes `showBorder`, `lineWidth` and recharts' `horizontal`.
 * - ChartYAxis takes `labelPlacement`.
 * - ChartLegend takes `placement` and `gap`. With no ChartLegend, the chart has no legend.
 * - The horizontal bar chart (`layout="vertical"`) keeps a `left` column for its category names.
 *   `labelPlacement` does not apply to it.
 * - The donut takes the legend props only.
 */
export const ChartDisplayControls = ChartDisplayControlsTemplate.bind({});
ChartDisplayControls.storyName = 'Chart Display Controls';
ChartDisplayControls.args = {
  version: 'v2',
  gridShowBorder: 'off',
  yAxisLabelPlacement: 'default',
  gridHorizontal: 'default',
  gridLineWidth: 'default',
  legendPlacement: 'default',
  donutLegendPlacement: 'default',
  showLegend: 'on',
  legendGap: 'default',
  lineStyle: 'dashed',
  valueFormat: 'none',
  chartWidth: 360,
  showEdgeGuides: false,
};

export default {
  title: 'Components/Charts/Chart Display Controls',
  component: ChartDisplayControlsTemplate,
  argTypes: {
    version: {
      name: 'Wrapper version',
      control: 'inline-radio',
      options: ['v1', 'v2'],
      description:
        '`version` on the chart wrapper. v1 renders as Blade master: the other controls have no effect. v2 is the new look. Default of the prop: v1.',
    },
    gridShowBorder: {
      name: 'ChartCartesianGrid showBorder',
      control: 'inline-radio',
      options: ['on', 'off'],
      description:
        '`showBorder` on ChartCartesianGrid: a line on the left, the right and the bottom of the plot, in the gridline colour and width. Default: off. With overlap, the Y labels show as left.',
    },
    yAxisLabelPlacement: {
      name: 'ChartYAxis labelPlacement',
      control: 'inline-radio',
      options: ['default', 'left', 'right', 'overlap'],
      description:
        '`labelPlacement` on ChartYAxis. Default: left. overlap with showBorder shows as left.',
    },
    gridHorizontal: {
      name: 'ChartCartesianGrid horizontal',
      control: 'inline-radio',
      options: ['default', 'on', 'off'],
      description: "recharts' `horizontal` on ChartCartesianGrid: the gridlines. Default: on.",
    },
    gridLineWidth: {
      name: 'ChartCartesianGrid lineWidth',
      control: 'inline-radio',
      options: ['default', 'thin', 'thinner'],
      description:
        '`lineWidth` on ChartCartesianGrid: thin is border.width.thin (1px), thinner is border.width.thinner (0.5px). Default: thinner.',
    },
    legendPlacement: {
      name: 'ChartLegend placement',
      control: 'inline-radio',
      options: ['default', 'top', 'bottom'],
      description: '`placement` on ChartLegend, in the line, area and bar charts. Default: bottom.',
    },
    donutLegendPlacement: {
      name: 'ChartLegend placement (donut)',
      control: 'inline-radio',
      options: ['default', 'top', 'bottom', 'left', 'right'],
      description:
        '`placement` on ChartLegend, in the donut. Default: bottom. The ring and the legend are one centred group.',
    },
    showLegend: {
      name: 'ChartLegend child',
      control: 'inline-radio',
      options: ['on', 'off'],
      description: 'A ChartLegend child, or none. With none, the chart has no legend.',
    },
    legendGap: {
      name: 'ChartLegend gap',
      control: 'select',
      options: [
        'default',
        'spacing.3',
        'spacing.4',
        'spacing.5',
        'spacing.6',
        'spacing.7',
        'spacing.8',
      ],
      description: '`gap` on ChartLegend. Default: spacing.5 (16px).',
    },
    lineStyle: {
      control: 'inline-radio',
      options: ['solid', 'dashed'],
      description:
        '`strokeStyle` on the second ChartLine. Line chart only. The legend swatch follows it.',
    },
    valueFormat: {
      name: 'Wrapper valueFormat',
      control: 'inline-radio',
      options: ['none', 'currency'],
      description: '`valueFormat`: none, or en-IN currency.',
    },
    chartWidth: {
      control: { type: 'range', min: 200, max: 720, step: 10 },
      description: 'The width of each chart box, in px. Not a prop.',
    },
    showEdgeGuides: {
      control: 'boolean',
      description: 'A dashed outline at the chart content edges. Not a prop.',
    },
  },
} as Meta<ChartDisplayControlsArgs>;
