import { Indicator } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<Indicator />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<Indicator accessibilityLabel="Success" />);

    expect(container).toMatchSnapshot();
  });

  it('should render different variants for size and color', () => {
    const { container } = renderWithTheme(
      <>
        <Indicator accessibilityLabel="Warning" size="small" color="notice" />
        <Indicator accessibilityLabel="Success" size="medium" color="positive" />
        <Indicator accessibilityLabel="Error" size="large" color="negative" />
        <Indicator accessibilityLabel="Info" color="information" />
      </>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with intense emphasis', () => {
    const { container } = renderWithTheme(
      <Indicator emphasis="intense" size="small" color="positive">
        Success
      </Indicator>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render text label', () => {
    const label = 'Active';
    const { getByText } = renderWithTheme(<Indicator>{label}</Indicator>);

    getByText(label);
  });

  it('should have role and a11y label when text label is passed', async () => {
    const label = 'Active';
    const { getByRole, getByLabelText } = renderWithTheme(<Indicator>{label}</Indicator>);

    getByRole('status');
    const indicator = getByLabelText(label);

    await assertAccessible(indicator);
  });

  it('should have role and a11y label when no text label is passed', async () => {
    const a11yLabel = 'Active';
    const { getByRole, getByLabelText } = renderWithTheme(
      <Indicator accessibilityLabel={a11yLabel} />,
    );

    getByRole('status');
    const indicator = getByLabelText(a11yLabel);

    await assertAccessible(indicator);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Indicator accessibilityLabel="Success" testID="indicator-test" />,
    );

    expect(getByTestId('indicator-test')).toBeTruthy();
  });
  it('should accept data-analytics attribute', () => {
    const { container } = renderWithTheme(
      <Indicator accessibilityLabel="Success" data-analytics-indicator="Success" />,
    );
    expect(container).toMatchSnapshot();
  });
});
