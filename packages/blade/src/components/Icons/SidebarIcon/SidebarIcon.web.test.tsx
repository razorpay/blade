import SidebarIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SidebarIcon />', () => {
  it('should render SidebarIcon', () => {
    const { container } = renderWithTheme(
      <SidebarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
