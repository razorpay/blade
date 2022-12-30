import { Spinner } from '../Spinner';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<Spinner />', () => {
  it('should render high contrast Spinner', () => {
    const { container, getByText } = renderWithSSR(
      <Spinner accessibilityLabel="Loading" contrast="high" label="Loading" />,
    );
    expect(getByText('Loading')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
