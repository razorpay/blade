import YoutubeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<YoutubeIcon />', () => {
  it('should render YoutubeIcon', () => {
    const renderTree = renderWithTheme(
      <YoutubeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
