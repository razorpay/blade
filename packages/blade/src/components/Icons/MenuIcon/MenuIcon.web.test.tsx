import MenuIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MenuIcon />', () => {
  it('should render MenuIcon', () => {
    const { container } = renderWithTheme(
      <MenuIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
