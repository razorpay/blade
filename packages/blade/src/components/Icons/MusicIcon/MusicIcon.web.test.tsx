import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MusicIcon from './';

describe('<MusicIcon />', () => {
  it('should render MusicIcon', () => {
    const { container } = renderWithTheme(
      <MusicIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
