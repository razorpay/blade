import FilmIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<FilmIcon />', () => {
  it('should render FilmIcon', () => {
    const renderTree = renderWithTheme(
      <FilmIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
