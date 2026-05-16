import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FilmIcon from '.';

describe('<FilmIcon />', () => {
  it('should render FilmIcon', () => {
    const renderTree = renderWithTheme(
      <FilmIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
