import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { InfoIcon } from '~components/Icons';

import { Badge } from '../';

describe('<Badge />', () => {
  it('should render Badge on server', () => {
    const label = 'Label';
    const { container } = renderWithSSR(
      <Badge icon={InfoIcon} emphasis="subtle" size="large">
        {label}
      </Badge>,
    );

    expect(container).toMatchSnapshot();
  });
});
