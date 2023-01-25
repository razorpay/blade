import WatchIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<WatchIcon />', () => {
  it('should render WatchIcon', () => {
    const { container } = renderWithTheme(
      <WatchIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
