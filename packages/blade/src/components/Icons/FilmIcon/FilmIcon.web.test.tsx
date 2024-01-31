import FilmIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FilmIcon />', () => {
  it('should render FilmIcon', () => {
    const { container } = renderWithTheme(
      <FilmIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
