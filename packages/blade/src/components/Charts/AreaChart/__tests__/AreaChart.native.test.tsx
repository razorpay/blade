import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { Line, Path } from 'react-native-svg';
import {
  ChartArea,
  ChartAreaWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartLegend,
  ChartTooltip,
  ChartReferenceLine,
} from '~components/Charts';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

const sampleData = [
  { month: 'Jan', teamA: 4000, teamB: 2400 },
  { month: 'Feb', teamA: 3000, teamB: 1398 },
  { month: 'Mar', teamA: 2000, teamB: 9800 },
  { month: 'Apr', teamA: 2780, teamB: 3908 },
];

const nullableData = [
  { name: 'Page A', uv: 4000 },
  { name: 'Page B', uv: 3000 },
  { name: 'Page C', uv: null },
  { name: 'Page D', uv: 1890 },
];

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ChartAreaWrapper /> (native)', () => {
  it('renders a single area chart', () => {
    const { toJSON } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartArea dataKey="teamA" name="Team A" color="data.background.categorical.blue.intense" />
        <ChartLegend />
      </ChartAreaWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders stacked areas', () => {
    const { toJSON } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartLegend />
        <ChartArea dataKey="teamA" name="Team A" stackId="1" />
        <ChartArea dataKey="teamB" name="Team B" stackId="1" />
      </ChartAreaWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders each curve type without error', () => {
    (['linear', 'monotone', 'step', 'stepBefore', 'stepAfter'] as const).forEach((type) => {
      const { toJSON } = renderWithTheme(
        <ChartAreaWrapper data={sampleData}>
          <ChartXAxis dataKey="month" />
          <ChartYAxis />
          <ChartArea dataKey="teamA" name="Team A" type={type} />
        </ChartAreaWrapper>,
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  it('renders with connectNulls bridging gaps', () => {
    const { toJSON } = renderWithTheme(
      <ChartAreaWrapper data={nullableData}>
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartArea dataKey="uv" name="Page A" connectNulls />
      </ChartAreaWrapper>,
    );
    expect(toJSON()).toBeTruthy();
  });

  it('renders a curved dashed null bridge (stroke-only) when connectNullsStyle is "dashed"', () => {
    const bridgeData = [
      { name: 'Jan', uv: 4000 },
      { name: 'Feb', uv: 3000 },
      { name: 'Mar', uv: 5000 },
      { name: 'Apr', uv: null },
      { name: 'May', uv: 1890 },
      { name: 'Jun', uv: 2390 },
    ];
    const { getByTestId, UNSAFE_getAllByType } = renderWithTheme(
      <ChartAreaWrapper data={bridgeData} testID="dashed">
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartArea dataKey="uv" name="UV" connectNulls connectNullsStyle="dashed" />
      </ChartAreaWrapper>,
    );

    fireEvent(getByTestId('dashed-scrub-surface'), 'layout', {
      nativeEvent: { layout: { width: 400, height: 300, x: 0, y: 0 } },
    });

    // react-native-svg normalizes strokeDasharray="5 5" to ['5', '5'].
    // eslint-disable-next-line babel/new-cap -- testing-library UNSAFE_* helper
    const bridges = UNSAFE_getAllByType(Path).filter((path) => {
      const dash = path.props.strokeDasharray;
      return Array.isArray(dash) ? dash.join(' ') === '5 5' : dash === '5 5';
    });
    expect(bridges.length).toBeGreaterThan(0);
    // A curved bridge is sampled at many points, so its `d` has multiple line-to commands.
    const bridgeD = bridges[0].props.d as string;
    expect((bridgeD.match(/L/g) ?? []).length).toBeGreaterThan(1);
  });

  it('renders empty-state copy when data is empty', () => {
    const { getByText } = renderWithTheme(
      <ChartAreaWrapper data={[]}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartArea dataKey="teamA" name="Team A" />
      </ChartAreaWrapper>,
    );
    expect(getByText('No data to display')).toBeTruthy();
  });

  it('renders a horizontal reference line (y)', () => {
    const { toJSON } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartReferenceLine y={3000} label="Target" />
      </ChartAreaWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders a vertical reference line (x)', () => {
    const { toJSON } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartReferenceLine x="Apr" label="Target" />
      </ChartAreaWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the vertical reference line as a dashed SVG line (not skipped)', () => {
    const { getByTestId, UNSAFE_getAllByType } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartReferenceLine x="Apr" label="Target" />
      </ChartAreaWrapper>,
    );

    fireEvent(getByTestId('chart-area-scrub-surface'), 'layout', {
      nativeEvent: { layout: { width: 400, height: 300, x: 0, y: 0 } },
    });

    // eslint-disable-next-line babel/new-cap
    const dashedLines = UNSAFE_getAllByType(Line).filter(
      (line) => line.props.strokeDasharray === '4 4',
    );
    expect(dashedLines.length).toBeGreaterThan(0);
  });

  it('renders legend items for each series that shows a legend', () => {
    const { getByText } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartLegend />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartArea dataKey="teamB" name="Team B" />
      </ChartAreaWrapper>,
    );
    expect(getByText('Team A')).toBeTruthy();
    expect(getByText('Team B')).toBeTruthy();
  });

  it('toggles a series when its legend item is pressed', () => {
    const onSelectedDataKeysChange = jest.fn();
    const { getByText } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartLegend onSelectedDataKeysChange={onSelectedDataKeysChange} />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartArea dataKey="teamB" name="Team B" />
      </ChartAreaWrapper>,
    );

    fireEvent.press(getByText('Team A'));

    expect(onSelectedDataKeysChange).toHaveBeenCalledTimes(1);
    expect(onSelectedDataKeysChange).toHaveBeenCalledWith({
      dataKey: 'teamA',
      selectedKeysArray: ['teamB'],
    });
  });

  it('respects controlled selectedDataKeys', () => {
    const { queryByText } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartLegend selectedDataKeys={['teamB']} />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartArea dataKey="teamB" name="Team B" />
      </ChartAreaWrapper>,
    );
    // Both legend rows are still present (legend always lists all series)...
    expect(queryByText('Team A')).toBeTruthy();
    expect(queryByText('Team B')).toBeTruthy();
  });

  it('does not plot a series with hide, but still shows it in the legend when showLegend is true', () => {
    const hidden = renderWithTheme(
      <ChartAreaWrapper data={sampleData} testID="hidden">
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartArea dataKey="teamB" name="Team B" hide />
        <ChartLegend />
      </ChartAreaWrapper>,
    );

    fireEvent(hidden.getByTestId('hidden-scrub-surface'), 'layout', {
      nativeEvent: { layout: { width: 400, height: 300, x: 0, y: 0 } },
    });

    // Legend still lists the hidden series (showLegend defaults to true).
    expect(hidden.getByText('Team A')).toBeTruthy();
    expect(hidden.getByText('Team B')).toBeTruthy();

    const visible = renderWithTheme(
      <ChartAreaWrapper data={sampleData} testID="visible">
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartArea dataKey="teamA" name="Team A" />
        <ChartArea dataKey="teamB" name="Team B" />
      </ChartAreaWrapper>,
    );
    fireEvent(visible.getByTestId('visible-scrub-surface'), 'layout', {
      nativeEvent: { layout: { width: 400, height: 300, x: 0, y: 0 } },
    });

    // eslint-disable-next-line babel/new-cap -- testing-library UNSAFE_* helper
    expect(hidden.UNSAFE_queryAllByType(Path).length).toBeLessThan(
      // eslint-disable-next-line babel/new-cap
      visible.UNSAFE_queryAllByType(Path).length,
    );
  });

  it('shows a tooltip on tap, keeps it after release, and toggles it off on re-tap', () => {
    const { getByTestId, queryByText } = renderWithTheme(
      <ChartAreaWrapper data={sampleData}>
        <ChartXAxis dataKey="month" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartArea dataKey="teamA" name="Team A" />
      </ChartAreaWrapper>,
    );

    const surface = getByTestId('chart-area-scrub-surface');

    // Simulate layout so the SVG plot (and therefore the tooltip) can render.
    fireEvent(surface, 'layout', {
      nativeEvent: { layout: { width: 400, height: 300, x: 0, y: 0 } },
    });

    // No tooltip value before interaction (3000 is Feb's teamA value).
    expect(queryByText('3000')).toBeFalsy();

    // Tap near the second data point (Feb) — locationX maps to index 1.
    // Taps use touchStart/touchEnd (chart does not claim responder on start,
    // so parent ScrollViews can still scroll vertically).
    fireEvent(surface, 'touchStart', { nativeEvent: { locationX: 155, locationY: 100 } });
    fireEvent(surface, 'touchEnd', { nativeEvent: { locationX: 155, locationY: 100 } });
    expect(queryByText('3000')).toBeTruthy();

    // Tapping the same point again toggles the selection (and tooltip) off.
    fireEvent(surface, 'touchStart', { nativeEvent: { locationX: 155, locationY: 100 } });
    fireEvent(surface, 'touchEnd', { nativeEvent: { locationX: 155, locationY: 100 } });
    expect(queryByText('3000')).toBeFalsy();
  });

  it('shows an em dash in the tooltip for null/missing values', () => {
    const { getByTestId, queryByText } = renderWithTheme(
      <ChartAreaWrapper data={nullableData}>
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartArea dataKey="uv" name="UV" />
      </ChartAreaWrapper>,
    );

    const surface = getByTestId('chart-area-scrub-surface');
    fireEvent(surface, 'layout', {
      nativeEvent: { layout: { width: 400, height: 300, x: 0, y: 0 } },
    });

    // Tap near the third data point (Page C, uv: null) — index 2 of 4.
    fireEvent(surface, 'touchStart', { nativeEvent: { locationX: 240, locationY: 100 } });
    fireEvent(surface, 'touchEnd', { nativeEvent: { locationX: 240, locationY: 100 } });

    expect(queryByText('—')).toBeTruthy();
    expect(queryByText('0')).toBeFalsy();
  });
});
