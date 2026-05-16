import renderWithTheme from '~utils/testing/renderWithTheme.web';

import WatchIcon from './';

describe('<WatchIcon />', () => {
  it('should render WatchIcon', () => {
    const { container } = renderWithTheme(
      <WatchIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
