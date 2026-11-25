import React from 'react';
import { fireEvent, waitFor, act, render } from '@testing-library/react';
import { ChartXAxis, ChartYAxis, ChartTooltip } from '..';
import { ChartLineWrapper, ChartLine } from '../../LineChart';
import { ChartAreaWrapper, ChartArea } from '../../AreaChart';
import { ChartBarWrapper, ChartBar } from '../../BarChart';
import { ChartDonutWrapper, ChartDonut } from '../../DonutChart';
import { createActivePointBuilder, useActivePointChange } from '../activePoint';
import type { ChartActivePoint } from '../types';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={800} height={400}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const data = [
  { day: '1 Nov', upi: 412300, cards: 214500 },
  { day: '2 Nov', upi: 468900, cards: 236800 },
  { day: '3 Nov', upi: 451200, cards: 228900 },
];
const INR = { type: 'currency', currency: 'INR' } as const;

describe('createActivePointBuilder', () => {
  const series = [
    {
      dataKey: 'upi',
      name: 'UPI',
      color: '#00f',
      colorToken: 'data.background.categorical.blue.moderate' as const,
    },
    {
      dataKey: 'cards',
      name: 'Cards',
      color: '#0a0',
      colorToken: 'data.background.categorical.green.moderate' as const,
    },
  ];

  it('writes the values with valueFormat and the label raw', () => {
    const build = createActivePointBuilder({
      data,
      children: [<ChartXAxis key="x" dataKey="day" />],
      series,
      valueFormat: INR,
    });
    expect(build(1)).toEqual({
      index: 1,
      label: '2 Nov',
      formattedLabel: '2 Nov',
      items: [
        {
          dataKey: 'upi',
          name: 'UPI',
          value: 468900,
          formattedValue: '₹4,68,900.00',
          color: '#00f',
          colorToken: 'data.background.categorical.blue.moderate',
        },
        {
          dataKey: 'cards',
          name: 'Cards',
          value: 236800,
          formattedValue: '₹2,36,800.00',
          color: '#0a0',
          colorToken: 'data.background.categorical.green.moderate',
        },
      ],
    });
    expect(build(9)).toBeNull();
  });

  it('takes the tooltip formatters over valueFormat and the axis tickFormatter', () => {
    const build = createActivePointBuilder({
      data,
      children: [
        <ChartXAxis key="x" dataKey="day" tickFormatter={(value) => `Day ${value}`} />,
        <ChartTooltip
          key="t"
          formatter={(value: unknown) => [`${Number(value) / 1000}K`, 'ignored']}
          labelFormatter={(label: unknown) => `On ${String(label)}`}
        />,
      ],
      series,
      valueFormat: INR,
    });
    const point = build(0);
    expect(point?.formattedLabel).toBe('On 1 Nov');
    expect(point?.items[0].formattedValue).toBe('412.3K');
  });

  it('takes the axis tickFormatter when the tooltip has no labelFormatter', () => {
    const build = createActivePointBuilder({
      data,
      children: [<ChartXAxis key="x" dataKey="day" tickFormatter={(value) => `Day ${value}`} />],
      series,
    });
    expect(build(2)?.formattedLabel).toBe('Day 3 Nov');
    expect(build(2)?.items[1].formattedValue).toBe('228900');
  });

  it('gives the formatters the row payload, as recharts does', () => {
    // recharts types the item and the payload loosely. Read them as the rows they hold.
    const formatter = jest.fn(
      (_value: unknown, _name: unknown, item: unknown, _index: unknown, _payload: unknown) =>
        `on ${(item as { payload: { day: string } }).payload.day}`,
    );
    const labelFormatter = jest.fn(
      (_label: unknown, payload: unknown) =>
        `UPI ${(payload as Array<{ payload: { upi: number } }>)[0].payload.upi}`,
    );
    const build = createActivePointBuilder({
      data,
      children: [
        <ChartXAxis key="x" dataKey="day" />,
        <ChartTooltip key="t" formatter={formatter} labelFormatter={labelFormatter} />,
      ],
      series,
    });
    const point = build(1);
    expect(point?.formattedLabel).toBe('UPI 468900');
    expect(point?.items[0].formattedValue).toBe('on 2 Nov');
    // The payload of the point holds the item with its row, as the 5th argument.
    expect(formatter.mock.calls[0][4]).toEqual([
      expect.objectContaining({ dataKey: 'upi', value: 468900, payload: data[1] }),
    ]);
  });

  it('takes a raw label from getLabel, and labelFormatter still writes formattedLabel', () => {
    const build = createActivePointBuilder({
      data,
      children: [
        <ChartTooltip key="t" labelFormatter={(label: unknown) => `Slice ${String(label)}`} />,
      ],
      series: [series[0]],
      getLabel: (row) => `name-${String(row.day)}`,
    });
    expect(build(0)).toMatchObject({ label: 'name-1 Nov', formattedLabel: 'Slice name-1 Nov' });
    expect(build(0)?.items[0].name).toBe('UPI');
  });

  it('reads the label from the Y axis of a vertical bar chart', () => {
    const build = createActivePointBuilder({
      data,
      children: [<ChartYAxis key="y" type="category" dataKey="day" />],
      series,
      labelAxisId: 'chart-y-axis',
    });
    expect(build(0)?.label).toBe('1 Nov');
  });
});

describe('useActivePointChange', () => {
  const Probe = ({
    index,
    onChange,
    value = 'a',
  }: {
    index?: number;
    onChange: (point: ChartActivePoint | null) => void;
    value?: string;
  }): null => {
    useActivePointChange(
      index,
      (i) => ({
        index: i,
        label: String(i),
        formattedLabel: String(i),
        items: [
          {
            dataKey: 'k',
            name: 'k',
            value,
            formattedValue: value,
            color: '#000',
            colorToken: 'data.background.categorical.blue.moderate',
          },
        ],
      }),
      onChange,
    );
    return null;
  };

  it('calls again when the point reads differently at the same index', () => {
    const onChange = jest.fn();
    const { rerender } = render(<Probe index={1} onChange={onChange} />);
    rerender(<Probe index={1} onChange={onChange} />);
    expect(onChange).toHaveBeenCalledTimes(1);
    // New data or a new valueFormat at the same index: the point reads differently.
    rerender(<Probe index={1} value="b" onChange={onChange} />);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0].items[0].formattedValue).toBe('b');
  });

  it('calls null on unmount when a point was active, and nothing when none was', () => {
    const active = jest.fn();
    render(<Probe index={1} onChange={active} />).unmount();
    expect(active).toHaveBeenLastCalledWith(null);
    const idle = jest.fn();
    render(<Probe onChange={idle} />).unmount();
    expect(idle).not.toHaveBeenCalled();
  });

  it('calls only when the index changes, and null when it goes', () => {
    const onChange = jest.fn();
    const { rerender } = render(<Probe onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
    rerender(<Probe index={1} onChange={onChange} />);
    rerender(<Probe index={1} onChange={onChange} />);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ index: 1 }));
    rerender(<Probe index={2} onChange={onChange} />);
    rerender(<Probe onChange={onChange} />);
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith(null);
  });
});

describe('onActivePointChange on the chart wrappers', () => {
  const pressArrow = async (container: HTMLElement): Promise<void> => {
    const surface = await waitFor(() => {
      const element = container.querySelector('.recharts-wrapper svg');
      expect(element).not.toBeNull();
      return element as SVGElement;
    });
    act(() => {
      surface.focus();
      fireEvent.focus(surface);
      fireEvent.keyDown(surface, { key: 'ArrowRight' });
    });
  };

  it.each(['v1', 'v2'] as const)(
    'reports the point the arrow keys reach on a line chart, %s',
    async (version) => {
      const onChange = jest.fn();
      const { container } = renderWithTheme(
        <Box width="800px" height="400px">
          <ChartLineWrapper
            data={data}
            version={version}
            valueFormat={INR}
            onActivePointChange={onChange}
          >
            <ChartXAxis dataKey="day" />
            <ChartYAxis />
            <ChartLine dataKey="upi" name="UPI" />
          </ChartLineWrapper>
        </Box>,
      );
      await pressArrow(container);
      await waitFor(() => expect(onChange).toHaveBeenCalled());
      const point = onChange.mock.calls[onChange.mock.calls.length - 1][0] as ChartActivePoint;
      expect(point.label).toBe(data[point.index].day);
      expect(point.items).toEqual([
        expect.objectContaining({ dataKey: 'upi', name: 'UPI', value: data[point.index].upi }),
      ]);
      expect(point.items[0].formattedValue).toMatch(/^₹/);
      expect(point.items[0].color).toMatch(/^(hsl|#|rgb)/);
      expect(point.items[0].colorToken).toMatch(/^data\.background\./);
    },
  );

  it.each(['area', 'bar'] as const)('reports the active point of a %s chart', async (kind) => {
    const onChange = jest.fn();
    const chart =
      kind === 'area' ? (
        <ChartAreaWrapper data={data} version="v2" onActivePointChange={onChange}>
          <ChartXAxis dataKey="day" />
          <ChartYAxis />
          <ChartArea dataKey="upi" name="UPI" />
          <ChartArea dataKey="cards" name="Cards" />
        </ChartAreaWrapper>
      ) : (
        <ChartBarWrapper data={data} version="v2" onActivePointChange={onChange}>
          <ChartXAxis dataKey="day" />
          <ChartYAxis />
          <ChartBar dataKey="upi" name="UPI" />
          <ChartBar dataKey="cards" name="Cards" />
        </ChartBarWrapper>
      );
    const { container } = renderWithTheme(
      <Box width="800px" height="400px">
        {chart}
      </Box>,
    );
    await pressArrow(container);
    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const point = onChange.mock.calls[0][0] as ChartActivePoint;
    expect(point.items.map((item) => item.name)).toEqual(['UPI', 'Cards']);
  });

  it('renders the same with no callback: no reporter, no change', () => {
    const render = (onChange?: () => void): string =>
      renderWithTheme(
        <Box width="800px" height="400px">
          <ChartDonutWrapper onActivePointChange={onChange}>
            <ChartDonut dataKey="upi" nameKey="day" data={data} />
          </ChartDonutWrapper>
        </Box>,
      ).container.innerHTML.replace(/recharts\d+-clip/g, 'clip');
    expect(render(jest.fn())).toBe(render());
  });
});
