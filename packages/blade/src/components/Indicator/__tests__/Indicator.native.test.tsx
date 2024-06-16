import { Indicator } from '..';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Indicator />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<Indicator accessibilityLabel="Success" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render different variants for size and color', () => {
    const { toJSON } = renderWithTheme(
      <>
        <Indicator accessibilityLabel="Warning" size="small" color="notice" />
        <Indicator accessibilityLabel="Success" size="medium" color="positive" />
        <Indicator accessibilityLabel="Error" size="large" color="negative" />
        <Indicator accessibilityLabel="Info" color="information" />
      </>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render with intense emphasis', () => {
    const { toJSON } = renderWithTheme(
      <Indicator emphasis="intense" size="small" color="positive">
        Success
      </Indicator>,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render text label', () => {
    const label = 'Active';
    const { getByText } = renderWithTheme(<Indicator>{label}</Indicator>);

    getByText(label);
  });

  it('should have a11y label when text label is passed', () => {
    const label = 'Active';
    const { getByLabelText } = renderWithTheme(<Indicator>{label}</Indicator>);

    getByLabelText(label);
  });

  it('should have role and a11y label when no text label is passed', () => {
    const a11yLabel = 'Active';
    const { getByLabelText } = renderWithTheme(<Indicator accessibilityLabel={a11yLabel} />);

    getByLabelText(a11yLabel);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Indicator accessibilityLabel="Success" testID="indicator-test" />,
    );

    expect(getByTestId('indicator-test')).toBeTruthy();
  });
});
