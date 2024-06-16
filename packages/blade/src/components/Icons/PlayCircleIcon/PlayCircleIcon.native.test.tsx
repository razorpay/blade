import PlayCircleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PlayCircleIcon />', () => {
  it('should render PlayCircleIcon', () => {
    const renderTree = renderWithTheme(
      <PlayCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
