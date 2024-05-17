import MusicIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MusicIcon />', () => {
  it('should render MusicIcon', () => {
    const renderTree = renderWithTheme(
      <MusicIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
