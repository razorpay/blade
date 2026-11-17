import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import { ChartFunnelWrapper, ChartFunnel } from '../FunnelChart';
import {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
} from '../../CommonChartComponents';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

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

const steps = [
  { step: 'Carts abandoned', count: 34 },
  { step: 'Calls made', count: 19 },
  { step: 'Calls connected', count: 19 },
  { step: 'Ordered within 24 hours', count: 5 },
];

const Funnel = ({
  tooltip = <ChartTooltip />,
}: {
  tooltip?: React.ReactElement;
}): React.ReactElement => (
  <ChartFunnelWrapper data={steps} testID="funnel">
    <ChartCartesianGrid />
    <ChartXAxis dataKey="step" />
    <ChartYAxis />
    {tooltip}
    <ChartFunnel dataKey="count" />
  </ChartFunnelWrapper>
);

describe('<ChartFunnelWrapper />', () => {
  it('should render the columns on a percentage axis', () => {
    const { container, getByText } = renderWithTheme(<Funnel />);
    expect(getByText('100%')).toBeInTheDocument();
    expect(getByText('25%')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should show who reached and who dropped in the tooltip', () => {
    const { getByText } = renderWithTheme(<Funnel tooltip={<ChartTooltip defaultIndex={1} />} />);
    expect(getByText('Reached')).toBeInTheDocument();
    expect(getByText('(56%)')).toBeInTheDocument();
    expect(getByText('Dropped')).toBeInTheDocument();
    expect(getByText('15')).toBeInTheDocument();
    expect(getByText('(44%)')).toBeInTheDocument();
  });

  it('should leave out the dropped row when nobody dropped', () => {
    const { getByText, queryByText } = renderWithTheme(
      <Funnel tooltip={<ChartTooltip defaultIndex={2} />} />,
    );
    expect(getByText('(100%)')).toBeInTheDocument();
    expect(queryByText('Dropped')).not.toBeInTheDocument();
  });

  it('should show the tooltip when a step is reached with the keyboard', async () => {
    const { container, queryByText, getByText } = renderWithTheme(<Funnel />);
    expect(queryByText('Reached')).not.toBeInTheDocument();
    const chart = container.querySelector('svg[tabindex="0"]')!;
    fireEvent.focus(chart);
    fireEvent.keyDown(chart, { key: 'ArrowRight' });
    await waitFor(() => expect(getByText('Reached')).toBeInTheDocument());
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<Funnel />);
    await assertAccessible(container);
  });

  it('should grow the axis when a step is larger than the first', () => {
    const { getByText, queryByText } = renderWithTheme(
      <ChartFunnelWrapper
        data={[
          { step: 'A', count: 10 },
          { step: 'B', count: 20 },
        ]}
      >
        <ChartXAxis dataKey="step" />
        <ChartYAxis />
        <ChartFunnel dataKey="count" />
      </ChartFunnelWrapper>,
    );
    expect(getByText('200%')).toBeInTheDocument();
    expect(queryByText('25%')).not.toBeInTheDocument();
  });

  it('should use custom labels and value format in the tooltip', () => {
    const { getByText } = renderWithTheme(
      <ChartFunnelWrapper data={steps}>
        <ChartXAxis dataKey="step" />
        <ChartTooltip defaultIndex={1} />
        <ChartFunnel
          dataKey="count"
          name="Converted"
          droppedName="Lost"
          formatValue={(value) => `${value} carts`}
        />
      </ChartFunnelWrapper>,
    );
    expect(getByText('Converted')).toBeInTheDocument();
    expect(getByText('Lost')).toBeInTheDocument();
    expect(getByText('19 carts')).toBeInTheDocument();
  });
});
