import PlayIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PlayIcon />', () => {
  it('should render PlayIcon', () => {
    const renderTree = renderWithTheme(
      <PlayIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
