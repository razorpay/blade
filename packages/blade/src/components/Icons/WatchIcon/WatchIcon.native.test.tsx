import renderWithTheme from '~utils/testing/renderWithTheme.native';

import WatchIcon from '.';

describe('<WatchIcon />', () => {
  it('should render WatchIcon', () => {
    const renderTree = renderWithTheme(
      <WatchIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
