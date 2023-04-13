import { BaseSpinner } from '../BaseSpinner';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BaseSpinner />', () => {
  it('should render BaseSpinner with default props', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" size="medium" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render xlarge size BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" size="xlarge" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast BaseSpinner', () => {
    const { toJSON } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" contrast="high" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast BaseSpinner with right label', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner
        accessibilityLabel="Loading"
        contrast="low"
        label="Loading"
        labelPosition="right"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast BaseSpinner with bottom label', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner
        accessibilityLabel="Loading"
        contrast="high"
        label="Loading"
        labelPosition="bottom"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast positive intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="positive" contrast="low" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast positive intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="positive" contrast="high" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast negative intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="negative" contrast="low" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast negative intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="negative" contrast="high" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render low contrast information intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="information" contrast="low" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast information intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="information" contrast="high" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render low contrast notice intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="notice" contrast="low" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast notice intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="notice" contrast="high" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast neutral intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="neutral" contrast="low" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast neutral intent BaseSpinner', () => {
    const { toJSON } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="neutral" contrast="high" />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" testID="base-spinner-test" />,
    );
    expect(getByTestId('base-spinner-test')).toBeTruthy();
  });
});
