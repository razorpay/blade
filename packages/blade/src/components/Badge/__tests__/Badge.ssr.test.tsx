import { Badge } from '../';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { InfoIcon } from '~components/Icons';

describe('<Badge />', () => {
  it('should render Badge on server', () => {
    const label = 'Label';
    const { container } = renderWithSSR(
      <Badge icon={InfoIcon} contrast="low" size="large" fontWeight="bold">
        {label}
      </Badge>,
    );

    expect(container).toMatchSnapshot();
  });
});
