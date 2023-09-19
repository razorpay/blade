import { Spinner } from '../Spinner';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Spinner />', () => {
  it('should render default color Spinner', () => {
    const { container, getByText } = renderWithSSR(
      <Spinner accessibilityLabel="Loading" color="default" label="Loading" />,
    );
    expect(getByText('Loading')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
  it('should render white color Spinner', () => {
    const { container, getByText } = renderWithSSR(
      <Spinner accessibilityLabel="Loading" color="white" label="Loading" />,
    );
    expect(getByText('Loading')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
