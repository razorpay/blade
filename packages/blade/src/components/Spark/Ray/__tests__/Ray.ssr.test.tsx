import { Ray } from '../Ray';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Ray />', () => {
  it('should render Ray on server', () => {
    const { container } = renderWithSSR(<Ray accessibilityLabel="Ray" />);
    expect(container).toMatchSnapshot();
  });
});
