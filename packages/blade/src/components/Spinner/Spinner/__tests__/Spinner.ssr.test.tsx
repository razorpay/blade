import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Spinner } from '../Spinner';

describe('<Spinner />', () => {
  it('should render primary color Spinner', () => {
    const { container, getByText } = renderWithSSR(
      <Spinner accessibilityLabel="Loading" color="primary" label="Loading" />,
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
