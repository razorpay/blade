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

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useId: () => 'test-id',
}));

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
    const { toJSON } = renderWithTheme(
      <ChartLineWrapper data={mockData}>
        <ChartLine dataKey="sales" />
      </ChartLineWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render multiple lines with legend, grid and axes', () => {
    const { toJSON } = renderWithTheme(
      <ChartLineWrapper data={mockData}>
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartLegend />
        <ChartLine dataKey="sales" name="Sales" />
        <ChartLine dataKey="profit" name="Profit" />
        <ChartLine dataKey="revenue" name="Revenue" />
      </ChartLineWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render different line types', () => {
    const { toJSON } = renderWithTheme(
      <ChartLineWrapper data={mockData}>
        <ChartLine dataKey="sales" type="linear" />
        <ChartLine dataKey="profit" type="monotone" />
        <ChartLine dataKey="revenue" type="step" />
      </ChartLineWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render different stroke styles', () => {
    const { toJSON } = renderWithTheme(
      <ChartLineWrapper data={mockData}>
        <ChartLine dataKey="sales" strokeStyle="solid" />
        <ChartLine dataKey="profit" strokeStyle="dashed" />
        <ChartLine dataKey="revenue" strokeStyle="dotted" />
      </ChartLineWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render custom and sequential colors', () => {
    const { toJSON } = renderWithTheme(
      <ChartLineWrapper data={mockData}>
        <ChartLine dataKey="sales" color="data.background.categorical.gray.moderate" />
        <ChartLine dataKey="profit" color="data.background.sequential.blue.400" />
      </ChartLineWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with dots enabled', () => {
    const { toJSON } = renderWithTheme(
      <ChartLineWrapper data={mockData}>
        <ChartLine dataKey="sales" dot={true} />
      </ChartLineWrapper>,
    );
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
    const { toJSON } = renderWithTheme(
      <ChartLineWrapper data={dataWithNulls}>
        <ChartLine dataKey="sales" connectNulls={true} />
      </ChartLineWrapper>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render negative data values within the plot area', () => {
    const negativeData = [
      { name: 'Jan', profit: -2000 },
      { name: 'Feb', profit: 1000 },
      { name: 'Mar', profit: -500 },
      { name: 'Apr', profit: 3000 },
    ];
    const { toJSON, getByTestId } = renderWithTheme(
      <ChartLineWrapper data={negativeData} testID="negative">
        <ChartCartesianGrid />
        <ChartXAxis dataKey="name" />
        <ChartYAxis />
        <ChartLine dataKey="profit" name="Profit/Loss" />
      </ChartLineWrapper>,
    );
    fireLayout(getByTestId('negative-layout'));
    const tree = toJSON();
    expect(tree).toMatchSnapshot();

    // Explicitly verify that negative y-axis tick labels are rendered.
    // The y-domain should span [niceFloor(-2000), niceCeil(3000)] = [-2000, 5000].
    // Tick labels are rendered as SvgText children; find ones containing '-'.
    const json = JSON.stringify(tree);
    expect(json).toContain('-2.0K');
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

    // Tap → tooltip appears.
    fireEvent(surface, 'responderGrant', at);
    expect(queryByText('Sales')).toBeTruthy();

    // Release KEEPS it (tap-to-stay, DonutChart parity).
    fireEvent(surface, 'responderRelease', at);
    expect(queryByText('Sales')).toBeTruthy();

    // Tapping the same index again toggles the selection (and tooltip) off.
    fireEvent(surface, 'responderGrant', at);
    fireEvent(surface, 'responderRelease', at);
    expect(queryByText('Sales')).toBeFalsy();
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
