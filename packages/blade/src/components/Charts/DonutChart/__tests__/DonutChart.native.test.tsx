import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ChartDonutWrapper, ChartDonut, ChartDonutCell } from '../DonutChart';
import { ChartLegend, ChartTooltip } from '../../CommonChartComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Box } from '~components/Box';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const mockData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 300 },
  { name: 'Other', value: 200 },
];

const chartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 100 },
];

const LAYOUT_EVENT = {
  nativeEvent: { layout: { width: 400, height: 400, x: 0, y: 0 } },
};

// react-native does not run layout in the jest environment, so slices only
// render once we manually flush an onLayout event with a concrete size.
const flushLayout = (getByTestId: (id: string) => unknown): void => {
  fireEvent(getByTestId('donut-chart-canvas') as never, 'layout', LAYOUT_EVENT);
};

describe('<DonutChart /> (native)', () => {
  it('should render basic DonutChart', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    flushLayout(getByTestId);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render DonutChart with center text', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper content={{ label: 'Total', value: '1200' }}>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    flushLayout(getByTestId);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render DonutChart with all radius sizes', () => {
    (['small', 'medium', 'large'] as const).forEach((radius) => {
      const { toJSON, getByTestId } = renderWithTheme(
        <Box width="400px" height="400px">
          <ChartDonutWrapper>
            <ChartDonut data={mockData} dataKey="value" nameKey="name" radius={radius} />
          </ChartDonutWrapper>
        </Box>,
      );
      flushLayout(getByTestId);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render DonutChart with all chart types', () => {
    (['circle', 'semicircle'] as const).forEach((type) => {
      const { toJSON, getByTestId } = renderWithTheme(
        <Box width="400px" height="400px">
          <ChartDonutWrapper>
            <ChartDonut data={mockData} dataKey="value" nameKey="name" type={type} />
          </ChartDonutWrapper>
        </Box>,
      );
      flushLayout(getByTestId);
      expect(toJSON()).toMatchSnapshot();
    });
  });

  it('should render DonutChart with custom cell colors', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut data={chartData} dataKey="value" nameKey="name">
            <ChartDonutCell color="data.background.categorical.gray.moderate" />
            <ChartDonutCell color="data.background.categorical.blue.moderate" />
            <ChartDonutCell color="data.background.categorical.orange.moderate" />
            <ChartDonutCell color="data.background.categorical.red.moderate" />
            <ChartDonutCell color="data.background.categorical.purple.moderate" />
          </ChartDonut>
        </ChartDonutWrapper>
      </Box>,
    );
    flushLayout(getByTestId);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render DonutChart with custom center position', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut data={mockData} dataKey="value" nameKey="name" cx="60%" cy="40%" />
        </ChartDonutWrapper>
      </Box>,
    );
    flushLayout(getByTestId);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render an interactive legend and tooltip', () => {
    const { toJSON, getByTestId } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper content={{ label: 'Total', value: '1300' }}>
          <ChartDonut data={chartData} dataKey="value" nameKey="name" />
          <ChartLegend />
          <ChartTooltip />
        </ChartDonutWrapper>
      </Box>,
    );
    flushLayout(getByTestId);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle empty data without crashing', () => {
    const { toJSON } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut data={[]} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle data with null values without crashing', () => {
    const dataWithNulls = [
      { name: 'Desktop', value: 400 },
      { name: 'Mobile', value: null },
      { name: 'Tablet', value: 300 },
    ];
    const { toJSON, getByTestId } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut data={dataWithNulls} dataKey="value" nameKey="name" />
        </ChartDonutWrapper>
      </Box>,
    );
    flushLayout(getByTestId);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe('<DonutChart /> interactions (native)', () => {
  it('should fire onSelectedDataKeysChange and deselect when a legend item is pressed', () => {
    const onSelectedDataKeysChange = jest.fn();
    const { getByText } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut data={chartData} dataKey="value" nameKey="name" />
          <ChartLegend onSelectedDataKeysChange={onSelectedDataKeysChange} />
        </ChartDonutWrapper>
      </Box>,
    );

    fireEvent.press(getByText('Group D'));

    expect(onSelectedDataKeysChange).toHaveBeenCalledTimes(1);
    const { dataKey, selectedKeysArray } = onSelectedDataKeysChange.mock.calls[0][0];
    expect(dataKey).toBe('Group D');
    expect(selectedKeysArray).not.toContain('Group D');
    expect(selectedKeysArray).toContain('Group A');
  });

  it('should render pre-filtered with defaultSelectedDataKeys and re-add on press', () => {
    const onSelectedDataKeysChange = jest.fn();
    const { getByText } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut data={chartData} dataKey="value" nameKey="name" />
          <ChartLegend
            defaultSelectedDataKeys={['Group D', 'Group E']}
            onSelectedDataKeysChange={onSelectedDataKeysChange}
          />
        </ChartDonutWrapper>
      </Box>,
    );

    // 'Group A' starts deselected → pressing it should add it back.
    fireEvent.press(getByText('Group A'));

    expect(onSelectedDataKeysChange).toHaveBeenCalledTimes(1);
    const { dataKey, selectedKeysArray } = onSelectedDataKeysChange.mock.calls[0][0];
    expect(dataKey).toBe('Group A');
    expect(selectedKeysArray).toContain('Group A');
    expect(selectedKeysArray).toEqual(expect.arrayContaining(['Group A', 'Group D', 'Group E']));
  });

  it('should support a controlled selectedDataKeys legend', () => {
    const onSelectedDataKeysChange = jest.fn();
    const { getByText } = renderWithTheme(
      <Box width="400px" height="400px">
        <ChartDonutWrapper>
          <ChartDonut data={chartData} dataKey="value" nameKey="name" />
          <ChartLegend
            selectedDataKeys={['Group A']}
            onSelectedDataKeysChange={onSelectedDataKeysChange}
          />
        </ChartDonutWrapper>
      </Box>,
    );

    fireEvent.press(getByText('Group B'));

    expect(onSelectedDataKeysChange).toHaveBeenCalledTimes(1);
    const { selectedKeysArray } = onSelectedDataKeysChange.mock.calls[0][0];
    expect(selectedKeysArray).toEqual(expect.arrayContaining(['Group A', 'Group B']));
  });
});
