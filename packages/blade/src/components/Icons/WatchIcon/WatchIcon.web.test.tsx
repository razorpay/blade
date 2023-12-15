import WatchIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WatchIcon />', () => {
  it('should render WatchIcon', () => {
    const { container } = renderWithTheme(
      <WatchIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
