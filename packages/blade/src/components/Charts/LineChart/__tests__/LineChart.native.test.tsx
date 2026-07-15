import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ChartLineWrapper, ChartLine } from '../LineChart';
import {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
  ChartReferenceLine,
} from '../../CommonChartComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

// Suppress console.error for expected Recharts/animated-library warnings that
// fire during native test rendering (e.g. reanimated worklet warnings, React
// bridging warnings from react-native-svg). Without this the test output is
// noisy, but no real errors are masked — failing renders still throw.
beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const mockData = [
  { name: 'Jan', sales: 4000, profit: 2000, revenue: 6000 },
  { name: 'Feb', sales: 3000, profit: 1500, revenue: 4500 },
  { name: 'Mar', sales: 2000, profit: 1000, revenue: 3000 },
  { name: 'Apr', sales: 5000, profit: 2500, revenue: 7500 },
];

// Helper: fire a layout event so the chart has non-zero size and renders SVG.
const fireLayout = (element: unknown, width = 400, height = 300): void => {
  fireEvent(element as never, 'layout', {
    nativeEvent: { layout: { x: 0, y: 0, width, height } },
  });
};

describe('<ChartLineWrapper /> (native)', () => {
  it('should render a single line', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="single-line">
        <ChartLine dataKey="sales" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('single-line-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render multiple lines with legend, grid and axes', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="multi-line">
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartLegend />
        <ChartLine dataKey="sales" name="Sales" />
        <ChartLine dataKey="profit" name="Profit" />
        <ChartLine dataKey="revenue" name="Revenue" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('multi-line-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render different line types', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="line-types">
        <ChartLine dataKey="sales" type="linear" />
        <ChartLine dataKey="profit" type="monotone" />
        <ChartLine dataKey="revenue" type="step" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('line-types-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render different stroke styles', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="stroke-styles">
        <ChartLine dataKey="sales" strokeStyle="solid" />
        <ChartLine dataKey="profit" strokeStyle="dashed" />
        <ChartLine dataKey="revenue" strokeStyle="dotted" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('stroke-styles-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render custom and sequential colors', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="custom-colors">
        <ChartLine dataKey="sales" color="data.background.categorical.gray.moderate" />
        <ChartLine dataKey="profit" color="data.background.sequential.blue.400" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('custom-colors-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with dots enabled', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="dots-enabled">
        <ChartLine dataKey="sales" dot={true} />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('dots-enabled-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render empty-state copy when data is empty', () => {
    const { getByText } = renderWithTheme(
      <ChartLineWrapper data={[]}>
        <ChartLine dataKey="sales" />
      </ChartLineWrapper>,
    );
    expect(getByText('No data to display')).toBeTruthy();
  });

  it('should render with connectNulls and a null value', () => {
    const dataWithNulls = [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: null },
      { name: 'Mar', sales: 2000 },
    ];
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={dataWithNulls} testID="connect-nulls">
        <ChartLine dataKey="sales" connectNulls={true} />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('connect-nulls-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a horizontal reference line (y)', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="ref-h">
        <ChartYAxis />
        <ChartLine dataKey="sales" />
        <ChartReferenceLine y={4000} label="Target" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('ref-h-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render a vertical reference line (x)', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="ref-v">
        <ChartXAxis dataKey="name" />
        <ChartLine dataKey="sales" />
        <ChartReferenceLine x="Feb" label="Launch" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('ref-v-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should toggle a line off when its legend entry is pressed', () => {
    const onSelectedDataKeysChange = jest.fn();
    const { getByTestId, queryAllByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="toggle">
        <ChartLegend onSelectedDataKeysChange={onSelectedDataKeysChange} />
        <ChartLine dataKey="sales" name="Sales" />
        <ChartLine dataKey="profit" name="Profit" />
      </ChartLineWrapper>,
    );

    fireLayout(getByTestId('toggle-layout'));
    expect(queryAllByTestId('line-path-profit').length).toBeGreaterThan(0);

    fireEvent.press(getByTestId('legend-profit'));

    expect(onSelectedDataKeysChange).toHaveBeenCalledTimes(1);
    expect(onSelectedDataKeysChange).toHaveBeenCalledWith({
      dataKey: 'profit',
      selectedKeysArray: ['sales'],
    });
    expect(queryAllByTestId('line-path-profit').length).toBe(0);
    expect(queryAllByTestId('line-path-sales').length).toBeGreaterThan(0);
  });

  it('should honor controlled selectedDataKeys', () => {
    const { getByTestId, queryAllByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="controlled">
        <ChartLegend selectedDataKeys={['sales']} />
        <ChartLine dataKey="sales" name="Sales" />
        <ChartLine dataKey="profit" name="Profit" />
      </ChartLineWrapper>,
    );

    fireLayout(getByTestId('controlled-layout'));
    expect(queryAllByTestId('line-path-sales').length).toBeGreaterThan(0);
    expect(queryAllByTestId('line-path-profit').length).toBe(0);
  });

  it('shows a tooltip on tap, keeps it after release, and toggles it off on re-tap', () => {
    const { getByTestId, queryByText } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="scrub">
        <ChartXAxis dataKey="name" />
        <ChartTooltip />
        <ChartLine dataKey="sales" name="Sales" />
      </ChartLineWrapper>,
    );

    // Single view owns BOTH onLayout and the responder (mirrors AreaChart), so
    // layout + responder events fire on the same `scrub-layout` testID.
    const surface = getByTestId('scrub-layout');
    fireLayout(surface);
    const at = { nativeEvent: { locationX: 40, locationY: 100 } };

    // Tap → tooltip appears (taps use touchStart/touchEnd, not responder events,
    // so parent ScrollViews can still scroll vertically).
    fireEvent(surface, 'touchStart', at);
    fireEvent(surface, 'touchEnd', at);
    expect(queryByText('Sales')).toBeTruthy();

    // Tapping the same index again toggles the selection (and tooltip) off.
    fireEvent(surface, 'touchStart', at);
    fireEvent(surface, 'touchEnd', at);
    expect(queryByText('Sales')).toBeFalsy();
  });

  it('should render with negative data values', () => {
    const negativeData = [
      { name: 'Jan', profit: 2000 },
      { name: 'Feb', profit: -1500 },
      { name: 'Mar', profit: 3000 },
      { name: 'Apr', profit: -500 },
    ];
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={negativeData} testID="negative">
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartLine dataKey="profit" name="Profit" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('negative-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with all-negative data without a positive yMax', () => {
    const allNegativeData = [
      { name: 'Jan', profit: -2000 },
      { name: 'Feb', profit: -1500 },
      { name: 'Mar', profit: -3000 },
      { name: 'Apr', profit: -500 },
    ];
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={allNegativeData} testID="all-negative">
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartLine dataKey="profit" name="Profit" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('all-negative-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should ignore null cells when computing y-domain (connectNulls)', () => {
    const sparseData = [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: null },
      { name: 'Mar', sales: 4200 },
      { name: 'Apr', sales: 4100 },
    ];
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={sparseData} testID="sparse-null">
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartLine dataKey="sales" name="Sales" connectNulls />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('sparse-null-layout'));
    expect(toJSON()).toMatchSnapshot();
  });

  it('should omit null series rows from the tooltip by default (filterNull)', () => {
    const sparseData = [
      { name: 'Jan', sales: 4000, profit: 2000 },
      { name: 'Feb', sales: null, profit: 1500 },
      { name: 'Mar', sales: 4200, profit: 1800 },
    ];
    const { getByTestId, getByText, queryByText } = renderWithTheme(
      <ChartLineWrapper data={sparseData} testID="null-tooltip">
        <ChartTooltip />
        <ChartLine dataKey="sales" name="Sales" connectNulls />
        <ChartLine dataKey="profit" name="Profit" />
      </ChartLineWrapper>,
    );

    const surface = getByTestId('null-tooltip-layout');
    fireLayout(surface);

    // Scrub to Feb (index 1) — layout 400 wide, 3 points → spacing ~200.
    const atFeb = {
      nativeEvent: { locationX: 40 + 200, locationY: 150, pageX: 240, pageY: 150 },
    };
    fireEvent(surface, 'responderGrant', atFeb);
    // Null series omitted (Recharts filterNull=true default); non-null series kept.
    expect(queryByText('Sales')).toBeFalsy();
    expect(queryByText('—')).toBeFalsy();
    expect(getByText('Profit')).toBeTruthy();
    expect(getByText('1500')).toBeTruthy();
  });

  it('should show a placeholder for null tooltip values when filterNull={false}', () => {
    const sparseData = [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: null },
      { name: 'Mar', sales: 4200 },
    ];
    const { getByTestId, getByText, queryByText } = renderWithTheme(
      <ChartLineWrapper data={sparseData} testID="null-tooltip-show">
        <ChartTooltip filterNull={false} />
        <ChartLine dataKey="sales" name="Sales" connectNulls />
      </ChartLineWrapper>,
    );

    const surface = getByTestId('null-tooltip-show-layout');
    fireLayout(surface);

    const atFeb = {
      nativeEvent: { locationX: 40 + 200, locationY: 150, pageX: 240, pageY: 150 },
    };
    fireEvent(surface, 'responderGrant', atFeb);
    expect(getByText('Sales')).toBeTruthy();
    expect(getByText('—')).toBeTruthy();
    expect(queryByText('0')).toBeFalsy();
  });

  it('should resolve nested dataKeys like metrics.sales', () => {
    const nestedData = [
      { date: '2023-01-01', metrics: { sales: 4000, profit: 2000 } },
      { date: '2023-02-01', metrics: { sales: 3000, profit: 1500 } },
    ];
    const { getByTestId, queryAllByTestId, getByText } = renderWithTheme(
      <ChartLineWrapper data={nestedData} testID="nested">
        <ChartXAxis dataKey="date" />
        <ChartYAxis />
        <ChartTooltip />
        <ChartLine dataKey="metrics.sales" name="Sales" />
        <ChartLine dataKey="metrics.profit" name="Profit" />
      </ChartLineWrapper>,
    );

    const surface = getByTestId('nested-layout');
    fireLayout(surface);
    expect(queryAllByTestId('line-path-metrics.sales').length).toBeGreaterThan(0);
    expect(queryAllByTestId('line-path-metrics.profit').length).toBeGreaterThan(0);

    fireEvent(surface, 'responderGrant', {
      nativeEvent: { locationX: 40, locationY: 100 },
    });
    expect(getByText('Sales')).toBeTruthy();
    expect(getByText('4000')).toBeTruthy();
    expect(getByText('Profit')).toBeTruthy();
    expect(getByText('2000')).toBeTruthy();
  });

  it('should apply ChartYAxis tickFormatter to y-axis labels', () => {
    const formatCurrency = (value: number): string => `$${Math.round(value / 1000)}K`;
    const { getByTestId, toJSON } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="y-format">
        <ChartYAxis tickFormatter={formatCurrency} />
        <ChartLine dataKey="sales" />
      </ChartLineWrapper>,
    );

    fireLayout(getByTestId('y-format-layout'));
    // react-native-svg exposes tick labels via the TSpan `content` prop.
    const tree = JSON.stringify(toJSON());
    // Domain max for sales (5000) nice-ceils to 5000; ticks include 0 and 5000.
    expect(tree).toContain('"$0K"');
    expect(tree).toContain('"$5K"');
  });

  it('should accept a testID via metaAttribute', () => {
    const { getByTestId } = renderWithTheme(
      <ChartLineWrapper data={mockData} testID="line-chart-test">
        <ChartLine dataKey="sales" />
      </ChartLineWrapper>,
    );
    expect(getByTestId('line-chart-test')).toBeTruthy();
  });
});
