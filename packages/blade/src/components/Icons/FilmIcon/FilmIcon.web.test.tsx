import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FilmIcon from './';

describe('<FilmIcon />', () => {
  it('should render FilmIcon', () => {
    const { container } = renderWithTheme(
      <FilmIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
