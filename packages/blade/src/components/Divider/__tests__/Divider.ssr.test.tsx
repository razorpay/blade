import { Box } from '~components/Box';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

import { Divider } from '../Divider';

describe('<Divider />', () => {
  it('should render Divider on server', () => {
    const { container } = renderWithSSR(
      <Box display="flex">
        <Divider />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
