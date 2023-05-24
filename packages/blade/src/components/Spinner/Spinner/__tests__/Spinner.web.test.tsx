import { Spinner } from '../Spinner';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Spinner />', () => {
  it('should render Spinner with default props', () => {
    const { container } = renderWithTheme(<Spinner accessibilityLabel="Loading" />);
    expect(container).toMatchSnapshot();
  });

  it('should render medium size Spinner', () => {
    const { container } = renderWithTheme(<Spinner accessibilityLabel="Loading" size="medium" />);
    expect(container).toMatchSnapshot();
  });

  it('should render large size Spinner', () => {
    const { container } = renderWithTheme(<Spinner accessibilityLabel="Loading" size="large" />);
    expect(container).toMatchSnapshot();
  });

  it('should render xlarge size Spinner', () => {
    const { container } = renderWithTheme(<Spinner accessibilityLabel="Loading" size="xlarge" />);
    expect(container).toMatchSnapshot();
  });

  it('should render low contrast Spinner', () => {
    const { container } = renderWithTheme(<Spinner accessibilityLabel="Loading" contrast="low" />);
    expect(container).toMatchSnapshot();
  });

  it('should render high contrast Spinner', () => {
    const { container } = renderWithTheme(<Spinner accessibilityLabel="Loading" contrast="high" />);
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Spinner accessibilityLabel="Loading" testID="spinner-test" />,
    );
    expect(getByTestId('spinner-test')).toBeTruthy();
  });
});
