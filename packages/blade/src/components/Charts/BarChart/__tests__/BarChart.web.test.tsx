import React from 'react';
import { waitFor } from '@testing-library/react';
import { ChartBarWrapper, ChartBar } from '../BarChart';
import {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
  ChartReferenceBand,
} from '../../CommonChartComponents';
import { REFERENCE_BAND_LAYER_CLASS } from '../../CommonChartComponents/tokens';
import { perLineBandClass } from '../../utils/referenceBandUtils';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Box } from '~components/Box/Box';

const mockData = [
  { name: 'Jan', sales: 4000, profit: 2000, revenue: 6000 },
  { name: 'Feb', sales: 3000, profit: 1500, revenue: 4500 },
  { name: 'Mar', sales: 2000, profit: 1000, revenue: 3000 },
  { name: 'Apr', sales: 5000, profit: 2500, revenue: 7500 },
];

const rangeData = [
  { name: 'Jan', sales: 4000, min: 3000, max: 5000 },
  { name: 'Feb', sales: 3000, min: 2200, max: 4200 },
  { name: 'Mar', sales: 2000, min: 1400, max: 3100 },
  { name: 'Apr', sales: 5000, min: 3800, max: 6000 },
];

// Mock recharts ResponsiveContainer for consistent testing
// Thanks to : https://jskim1991.medium.com/react-writing-tests-with-graphs-9b7f2c9eeefc

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

describe('<BarChart />', () => {
  it('should render basic BarChart with single bar', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartBar dataKey="sales" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render BarChart with multiple bars', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartBar dataKey="sales" name="Sales" />
          <ChartBar dataKey="profit" name="Profit" />
          <ChartBar dataKey="revenue" name="Revenue" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render stacked BarChart', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartBar dataKey="sales" name="Sales" stackId="stack-1" />
          <ChartBar dataKey="profit" name="Profit" stackId="stack-1" />
          <ChartBar dataKey="revenue" name="Revenue" stackId="stack-1" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render BarChart with custom colors', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartBar dataKey="sales" color="data.background.categorical.blue.moderate" />
          <ChartBar dataKey="profit" color="data.background.categorical.blue.moderate" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render complete chart with all components', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={mockData}>
          <ChartCartesianGrid />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="sales" name="Sales" />
          <ChartBar dataKey="profit" name="Profit" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});

describe('<ChartReferenceBand /> inside a BarChart', () => {
  it('should render a BarChart with a reference band', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={rangeData}>
          <ChartReferenceBand lowerDataKey="min" upperDataKey="max" name="Reference band" />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar dataKey="sales" name="Sales" />
        </ChartBarWrapper>
      </Box>,
    );
    // The band is committed after Recharts lays the bound series out, so wait for it before
    // snapshotting — otherwise the snapshot races the band layer.
    await waitFor(() => {
      expect(container.querySelectorAll(`.${REFERENCE_BAND_LAYER_CLASS} path`)).toHaveLength(1);
    });
    expect(container).toMatchSnapshot();
  });

  it('should paint a filled band path between the bounds, behind the bars', async () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={rangeData}>
          <ChartReferenceBand lowerDataKey="min" upperDataKey="max" />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartBar dataKey="sales" name="Sales" />
        </ChartBarWrapper>
      </Box>,
    );
    // The band is derived from the rendered bound-series geometry, committed asynchronously.
    await waitFor(() => {
      expect(container.querySelectorAll(`.${REFERENCE_BAND_LAYER_CLASS} path`)).toHaveLength(1);
    });
    const bandPath = container.querySelector(`.${REFERENCE_BAND_LAYER_CLASS} path`)!;
    // A closed, filled area built from straight segments only.
    expect(bandPath.getAttribute('fill')).not.toBe('none');
    const d = bandPath.getAttribute('d') ?? '';
    expect(d).toContain('Z');
    expect(d).not.toMatch(/[CQAST]/);
  });

  it('should not render a band layer when no reference band is present', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={rangeData}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartBar dataKey="sales" name="Sales" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(container.querySelectorAll(`.${REFERENCE_BAND_LAYER_CLASS} path`)).toHaveLength(0);
  });

  it('should show the value and the range for the hovered bar in the tooltip', async () => {
    const { getByText } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={rangeData}>
          <ChartReferenceBand lowerDataKey="min" upperDataKey="max" name="Industry range" />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          {/* defaultIndex pins the tooltip to Mar without needing a real pointer. */}
          <ChartTooltip defaultIndex={2} formatter={(value) => `${Number(value)}%`} />
          <ChartBar dataKey="sales" name="Success rate" />
        </ChartBarWrapper>
      </Box>,
    );
    await waitFor(() => {
      expect(getByText('Success rate')).toBeInTheDocument();
    });
    // The bar's own value, formatted.
    expect(getByText('2000%')).toBeInTheDocument();
    // …and a second row for the standalone band's min–max at that same data point.
    expect(getByText('Industry range')).toBeInTheDocument();
    expect(getByText('1400%–3100%')).toBeInTheDocument();
  });

  it('should show a legend swatch for a standalone band', async () => {
    const { queryByText } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={rangeData}>
          <ChartReferenceBand lowerDataKey="min" upperDataKey="max" name="Peer range" />
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartLegend />
          <ChartBar dataKey="sales" name="Sales" />
        </ChartBarWrapper>
      </Box>,
    );
    await waitFor(() => {
      expect(queryByText('Peer range')).toBeInTheDocument();
    });
  });
});

describe('BarChart per-bar reference bands (range on ChartBar)', () => {
  const groupedRangeData = [
    {
      name: 'Jan',
      sales: 4000,
      salesMin: 3000,
      salesMax: 5000,
      profit: 2000,
      profitMin: 1500,
      profitMax: 2600,
    },
    {
      name: 'Feb',
      sales: 3000,
      salesMin: 2200,
      salesMax: 4200,
      profit: 1500,
      profitMin: 1100,
      profitMax: 2000,
    },
    {
      name: 'Mar',
      sales: 2000,
      salesMin: 1400,
      salesMax: 3100,
      profit: 1000,
      profitMin: 700,
      profitMax: 1500,
    },
  ];

  const renderGrouped = (): ReturnType<typeof renderWithTheme> =>
    renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={groupedRangeData}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartTooltip />
          <ChartLegend />
          <ChartBar
            dataKey="sales"
            name="Sales"
            rangeLowerDataKey="salesMin"
            rangeUpperDataKey="salesMax"
            rangeName="Sales range"
          />
          <ChartBar
            dataKey="profit"
            name="Profit"
            rangeLowerDataKey="profitMin"
            rangeUpperDataKey="profitMax"
            rangeName="Profit range"
          />
        </ChartBarWrapper>
      </Box>,
    );

  it('should render bound series for every bar that declares a range', () => {
    const { container } = renderGrouped();
    expect(container.querySelector(`.${perLineBandClass('sales', 'lower')}`)).toBeInTheDocument();
    expect(container.querySelector(`.${perLineBandClass('sales', 'upper')}`)).toBeInTheDocument();
    expect(container.querySelector(`.${perLineBandClass('profit', 'lower')}`)).toBeInTheDocument();
    expect(container.querySelector(`.${perLineBandClass('profit', 'upper')}`)).toBeInTheDocument();
  });

  it('should not paint any band until a bar is hovered', () => {
    const { container } = renderGrouped();
    const layer = container.querySelector(`.${REFERENCE_BAND_LAYER_CLASS}`);
    // The layer may be absent entirely, or present with no band path — either way nothing is drawn.
    expect(layer?.querySelectorAll('path').length ?? 0).toBe(0);
  });

  it('should keep per-bar bands out of the legend by default', () => {
    const { queryByText, getByText } = renderGrouped();
    expect(getByText('Sales')).toBeInTheDocument();
    expect(queryByText('Sales range')).not.toBeInTheDocument();
    expect(queryByText('Profit range')).not.toBeInTheDocument();
  });

  it('should show a per-bar band in the legend when showRangeLegend is set', () => {
    const { getByText } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={groupedRangeData}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartLegend />
          <ChartBar
            dataKey="sales"
            name="Sales"
            rangeLowerDataKey="salesMin"
            rangeUpperDataKey="salesMax"
            rangeName="Sales range"
            showRangeLegend
          />
        </ChartBarWrapper>
      </Box>,
    );
    expect(getByText('Sales range')).toBeInTheDocument();
  });

  it('should not render bound series when only one range bound is given', () => {
    const { container } = renderWithTheme(
      <Box width="500px" height="500px">
        <ChartBarWrapper data={groupedRangeData}>
          <ChartXAxis dataKey="name" />
          <ChartYAxis />
          <ChartBar dataKey="sales" name="Sales" rangeLowerDataKey="salesMin" />
        </ChartBarWrapper>
      </Box>,
    );
    expect(
      container.querySelector(`.${perLineBandClass('sales', 'lower')}`),
    ).not.toBeInTheDocument();
    expect(container.querySelector(`.${REFERENCE_BAND_LAYER_CLASS}`)).not.toBeInTheDocument();
  });
});
