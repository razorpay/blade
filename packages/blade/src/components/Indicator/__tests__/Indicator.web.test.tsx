import { Indicator } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';

describe('<Indicator />', () => {
  it('should render', () => {
    const { container } = renderWithTheme(<Indicator accessibilityLabel="Success" />);

    expect(container).toMatchSnapshot();
  });

  it('should render different variants for size and intent', () => {
    const { container } = renderWithTheme(
      <>
        <Indicator accessibilityLabel="Warning" size="small" intent="notice" />
        <Indicator accessibilityLabel="Success" size="medium" intent="positive" />
        <Indicator accessibilityLabel="Error" size="large" intent="negative" />
        <Indicator accessibilityLabel="Info" intent="information" />
      </>,
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
});
