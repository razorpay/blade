import { Spinner } from '../Spinner';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Spinner />', () => {
  it('should render Spinner with default props', () => {
    const { toJSON } = renderWithTheme(<Spinner accessibilityLabel="Loading" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner accessibilityLabel="Loading" size="medium" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render large size Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner accessibilityLabel="Loading" size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render xlarge size Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner accessibilityLabel="Loading" size="xlarge" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render low contrast Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner accessibilityLabel="Loading" contrast="low" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render high contrast Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner accessibilityLabel="Loading" contrast="high" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Spinner accessibilityLabel="Loading" testID="spinner-test" />,
    );
    expect(getByTestId('spinner-test')).toBeTruthy();
  });
});
