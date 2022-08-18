import HomeIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<HomeIcon />', () => {
  it('should render HomeIcon', () => {
    const { container } = renderWithTheme(
      <HomeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
