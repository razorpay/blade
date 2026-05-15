import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SidebarIcon from './';

describe('<SidebarIcon />', () => {
  it('should render SidebarIcon', () => {
    const { container } = renderWithTheme(
      <SidebarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
