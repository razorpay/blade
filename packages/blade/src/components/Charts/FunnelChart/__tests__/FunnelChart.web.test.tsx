import React from 'react';
import { ChartFunnelWrapper, ChartFunnel } from '../FunnelChart';
import { ChartTooltip } from '../../CommonChartComponents';
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
    {tooltip}
    <ChartFunnel dataKey="count" nameKey="step" />
  </ChartFunnelWrapper>
);

describe('<ChartFunnelWrapper />', () => {
  it('should draw one recharts trapezoid and label per step', () => {
    const { container, getByText } = renderWithTheme(<Funnel />);
    expect(container.querySelectorAll('.recharts-funnel-trapezoid')).toHaveLength(4);
    expect(getByText('Calls made · 19 · 56%')).toBeInTheDocument();
    expect(getByText('Ordered within 24 hours · 5 · 15%')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should show the step and its count in the tooltip', () => {
    const { getByText } = renderWithTheme(<Funnel tooltip={<ChartTooltip defaultIndex={1} />} />);
    expect(getByText('Calls made')).toBeInTheDocument();
    expect(getByText('19')).toBeInTheDocument();
  });

  it('should draw nothing for empty data', () => {
    const { container } = renderWithTheme(
      <ChartFunnelWrapper data={[]}>
        <ChartFunnel dataKey="count" nameKey="step" />
      </ChartFunnelWrapper>,
    );
    expect(container.querySelectorAll('.recharts-funnel-trapezoid')).toHaveLength(0);
  });

  it('should name each step for screen readers', () => {
    const { getByRole } = renderWithTheme(<Funnel />);
    expect(getByRole('img', { name: 'Calls made · 19 · 56%' })).toBeInTheDocument();
  });

  it('should not add a keyboard stop with no keyboard behaviour', () => {
    const { container } = renderWithTheme(<Funnel />);
    expect(container.querySelector('[role="application"]')).toBeNull();
    expect(container.querySelector('svg[tabindex]')).toBeNull();
  });

  it('should throw without a ChartFunnel', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      renderWithTheme(
        <ChartFunnelWrapper data={steps}>
          <ChartTooltip />
        </ChartFunnelWrapper>,
      ),
    ).toThrow('ChartFunnelWrapper needs exactly one ChartFunnel child');
  });

  it('should throw with two ChartFunnel children', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      renderWithTheme(
        <ChartFunnelWrapper data={steps}>
          <ChartFunnel dataKey="count" nameKey="step" />
          <ChartFunnel dataKey="count" nameKey="step" />
        </ChartFunnelWrapper>,
      ),
    ).toThrow('exactly one ChartFunnel');
  });

  it('should throw when dataKey or nameKey is not in the data', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      renderWithTheme(
        <ChartFunnelWrapper data={steps}>
          <ChartFunnel dataKey="count" nameKey="stage" />
        </ChartFunnelWrapper>,
      ),
    ).toThrow('nameKey "stage"');
  });

  it('should throw when a later row is missing the dataKey', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      renderWithTheme(
        <ChartFunnelWrapper data={[{ step: 'A', count: 5 }, { step: 'B' }]}>
          <ChartFunnel dataKey="count" nameKey="step" />
        </ChartFunnelWrapper>,
      ),
    ).toThrow('dataKey "count"');
  });

  it('should fill the steps with the given color', () => {
    const getFill = (container: HTMLElement): string | null | undefined =>
      container.querySelector('.recharts-funnel-trapezoid path')?.getAttribute('fill');
    const { container: defaultContainer } = renderWithTheme(<Funnel />);
    const { container } = renderWithTheme(
      <ChartFunnelWrapper data={steps}>
        <ChartFunnel
          dataKey="count"
          nameKey="step"
          color="data.background.categorical.green.moderate"
        />
      </ChartFunnelWrapper>,
    );
    expect(getFill(container)).toBeTruthy();
    expect(getFill(container)).not.toBe(getFill(defaultContainer));
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<Funnel />);
    await assertAccessible(container);
  });
});
