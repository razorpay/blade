import { Spinner } from '../Spinner';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

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

  it('should render default color Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner accessibilityLabel="Loading" color="primary" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render white color Spinner', () => {
    const { toJSON } = renderWithTheme(<Spinner accessibilityLabel="Loading" color="white" />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(
      <Spinner accessibilityLabel="Loading" testID="spinner-test" />,
    );
    expect(getByTestId('spinner-test')).toBeTruthy();
  });
});
