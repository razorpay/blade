import SidebarIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SidebarIcon />', () => {
  it('should render SidebarIcon', () => {
    const renderTree = renderWithTheme(
      <SidebarIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
