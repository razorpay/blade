import SidebarIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SidebarIcon />', () => {
  it('should render SidebarIcon', () => {
    const renderTree = renderWithTheme(
      <SidebarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
