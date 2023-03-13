import { BaseSpinner } from '../BaseSpinner';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';

describe('<BaseSpinner />', () => {
  it('should render BaseSpinner with default props', () => {
    const { container } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" size="medium" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render large size BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render xlarge size BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" size="xlarge" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" contrast="low" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" contrast="high" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast BaseSpinner with right label', () => {
    const { container } = renderWithTheme(
      <BaseSpinner
        accessibilityLabel="Loading"
        contrast="low"
        label="Loading"
        labelPosition="right"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast BaseSpinner with bottom label', () => {
    const { container } = renderWithTheme(
      <BaseSpinner
        accessibilityLabel="Loading"
        contrast="high"
        label="Loading"
        labelPosition="bottom"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast positive intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="positive" contrast="low" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast positive intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="positive" contrast="high" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast negative intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="negative" contrast="low" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast negative intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="negative" contrast="high" />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render low contrast information intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="information" contrast="low" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast information intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="information" contrast="high" />,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render low contrast notice intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="notice" contrast="low" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast notice intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="notice" contrast="high" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast neutral intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="neutral" contrast="low" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast neutral intent BaseSpinner', () => {
    const { container } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" intent="neutral" contrast="high" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<BaseSpinner accessibilityLabel="Loading" />);
    await assertAccessible(container);
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <BaseSpinner accessibilityLabel="Loading" testID="base-spinner-test" />,
    );
    expect(getByTestId('base-spinner-test')).toBeTruthy();
  });
});
