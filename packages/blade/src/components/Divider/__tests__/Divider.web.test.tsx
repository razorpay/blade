import { Divider } from '../Divider';
import { Box } from '~components/Box';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Divider />', () => {
  it('should render Divider within flex container', () => {
    const { container } = renderWithTheme(
      <Box display="flex">
        <Divider />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render vertical Divider using height', () => {
    const { container } = renderWithTheme(
      <Box display="block" height="100px">
        <Divider orientation="vertical" height="100%" />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should render horizontal Divider using width', () => {
    const { container } = renderWithTheme(
      <Box display="block" width="100px">
        <Divider width="100%" />
      </Box>,
    );
    expect(container).toMatchSnapshot();
  });
});
