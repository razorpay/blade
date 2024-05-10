import WatchIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WatchIcon />', () => {
  it('should render WatchIcon', () => {
    const renderTree = renderWithTheme(
      <WatchIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
