import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MusicIcon from '.';

describe('<MusicIcon />', () => {
  it('should render MusicIcon', () => {
    const renderTree = renderWithTheme(
      <MusicIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
