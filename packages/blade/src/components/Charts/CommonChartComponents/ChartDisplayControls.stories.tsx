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
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '~components/Charts';
import { Box } from '~components/Box';
import { Text } from '~components/Typography/Text';

const data = [
  { month: 'Jan', online: 42000, offline: 18000 },
  { month: 'Feb', online: 51000, offline: 21500 },
  { month: 'Mar', online: 47500, offline: 26000 },
  { month: 'Apr', online: 68000, offline: 24000 },
  { month: 'May', online: 74500, offline: 31000 },
  { month: 'Jun', online: 98000, offline: 36500 },
];

/** `default` leaves the prop unset, so `axisStyle` sets it. */
type Unset = 'default';
type OnOff = Unset | 'on' | 'off';

type ChartDisplayControlsArgs = {
  axisStyle: 'lines' | 'minimal';
  yAxisLine: OnOff;
  yLabelPlacement: Unset | 'left' | 'right' | 'overlap';
  yGridlines: OnOff;
  gridlineWidth: Unset | 'thin' | 'thinner';
  legendPlacement: Unset | 'top' | 'bottom';
  labelSize: Unset | 's' | 'm' | 'l';
  lineStyle: 'solid' | 'dashed';
  valueFormat: 'none' | 'currency';
  chartWidth: number;
  showEdgeGuides: boolean;
};

const unset = <T extends string>(value: T | Unset): T | undefined =>
  value === 'default' ? undefined : value;
const onOff = (value: OnOff): boolean | undefined =>
  value === 'default' ? undefined : value === 'on';

const toDisplayProps = (args: ChartDisplayControlsArgs): ChartWrapperDisplayProps => ({
  axisStyle: args.axisStyle,
  yAxisLine: onOff(args.yAxisLine),
  yLabelPlacement: unset(args.yLabelPlacement),
  yGridlines: onOff(args.yGridlines),
  gridlineWidth: unset(args.gridlineWidth),
  legendPlacement: unset(args.legendPlacement),
  labelSize: unset(args.labelSize),
  valueFormat: args.valueFormat === 'currency' ? { type: 'currency', currency: 'INR' } : undefined,
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
  const display = toDisplayProps(args);
  const { chartWidth: width, showEdgeGuides } = args;
  // An array, not a fragment: the wrappers read their direct children.
  const common = [
    <ChartCartesianGrid key="grid" />,
    <ChartXAxis key="x" dataKey="month" />,
    <ChartYAxis key="y" />,
    <ChartTooltip key="tooltip" />,
    <ChartLegend key="legend" />,
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
    </Box>
  );
};

/**
 * Every display control of the line, area and bar chart wrappers, as a live control. `default`
 * leaves a prop unset, so `axisStyle` sets it. `lineStyle` sets `strokeStyle` on the second line.
 */
export const ChartDisplayControls = ChartDisplayControlsTemplate.bind({});
ChartDisplayControls.storyName = 'Chart Display Controls';
ChartDisplayControls.args = {
  axisStyle: 'lines',
  yAxisLine: 'default',
  yLabelPlacement: 'default',
  yGridlines: 'default',
  gridlineWidth: 'default',
  legendPlacement: 'default',
  labelSize: 'default',
  lineStyle: 'dashed',
  valueFormat: 'none',
  chartWidth: 360,
  showEdgeGuides: false,
};

export default {
  title: 'Components/Charts/Chart Display Controls',
  component: ChartDisplayControlsTemplate,
  argTypes: {
    axisStyle: {
      control: 'inline-radio',
      options: ['lines', 'minimal'],
      description: 'Sets the defaults of the other props. An explicit prop wins.',
    },
    yAxisLine: {
      control: 'inline-radio',
      options: ['default', 'on', 'off'],
      description: '`yAxisLine`. Default: on with lines, off with minimal.',
    },
    yLabelPlacement: {
      control: 'inline-radio',
      options: ['default', 'left', 'right', 'overlap'],
      description:
        '`yLabelPlacement`. Default: the classic 60px gutter with lines, overlap with minimal. `outside` is an alias of `right`.',
    },
    yGridlines: {
      control: 'inline-radio',
      options: ['default', 'on', 'off'],
      description: '`yGridlines`. Default: on.',
    },
    gridlineWidth: {
      control: 'inline-radio',
      options: ['default', 'thin', 'thinner'],
      description:
        '`gridlineWidth`: thin is border.width.thin (1px), thinner is border.width.thinner (0.5px). Default: thin with lines, thinner with minimal.',
    },
    legendPlacement: {
      control: 'inline-radio',
      options: ['default', 'top', 'bottom'],
      description: '`legendPlacement`. Default: bottom.',
    },
    labelSize: {
      control: 'inline-radio',
      options: ['default', 's', 'm', 'l'],
      description:
        '`labelSize`: fonts.size 75, 100, 200 for the axis labels and the legend. Default: axis 75, legend 100.',
    },
    lineStyle: {
      control: 'inline-radio',
      options: ['solid', 'dashed'],
      description: '`strokeStyle` on the second ChartLine. Line chart only.',
    },
    valueFormat: {
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
