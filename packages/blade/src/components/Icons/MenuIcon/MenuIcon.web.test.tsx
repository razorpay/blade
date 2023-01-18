import MenuIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MenuIcon />', () => {
  it('should render MenuIcon', () => {
    const { container } = renderWithTheme(
      <MenuIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
