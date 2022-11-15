import { Indicator } from '..';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Indicator />', () => {
  it('should render', () => {
    const { toJSON } = renderWithTheme(<Indicator accessibilityLabel="Success" />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('should render different variants for size and intent', () => {
    const { toJSON } = renderWithTheme(
      <>
        <Indicator accessibilityLabel="Warning" size="small" intent="notice" />
        <Indicator accessibilityLabel="Success" size="medium" intent="positive" />
        <Indicator accessibilityLabel="Error" size="large" intent="negative" />
        <Indicator accessibilityLabel="Info" intent="information" />
      </>,
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
});
