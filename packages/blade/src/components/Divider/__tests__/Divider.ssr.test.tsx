import { Divider } from '../Divider';
import { Box } from '~components/Box';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

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
