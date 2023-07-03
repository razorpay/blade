import { Divider } from '../Divider';
import { Box } from '~components/Box';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Divider />', () => {
  it('should render Divider within flex container', () => {
    const { toJSON } = renderWithTheme(
      <Box display="flex">
        <Divider />
      </Box>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it('should render Divider using height', () => {
    const { toJSON } = renderWithTheme(
      <Box display="flex" height="100px">
        <Divider orientation="vertical" height="100%" />
      </Box>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
