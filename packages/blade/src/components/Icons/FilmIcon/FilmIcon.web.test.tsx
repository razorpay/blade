import FilmIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<FilmIcon />', () => {
  it('should render FilmIcon', () => {
    const { container } = renderWithTheme(
      <FilmIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
