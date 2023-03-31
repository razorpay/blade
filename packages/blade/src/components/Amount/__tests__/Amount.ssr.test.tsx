import { Amount } from '..';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<Amount />', () => {
  it('should render Amount on server', () => {
    const { container } = renderWithSSR(<Amount value={10000} />);

    expect(container).toMatchSnapshot();
  });
});
