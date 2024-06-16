import FilmIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FilmIcon />', () => {
  it('should render FilmIcon', () => {
    const renderTree = renderWithTheme(
      <FilmIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
