import { Amount } from '..';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { InfoIcon } from '~components/Icons';

describe('<Badge />', () => {
  it('should render Badge on server', () => {
    const { container } = renderWithSSR(<Amount value={10000} />);

    expect(container).toMatchSnapshot();
  });
});
