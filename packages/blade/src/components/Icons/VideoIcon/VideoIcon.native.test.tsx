import VideoIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<VideoIcon />', () => {
  it('should render VideoIcon', () => {
    const renderTree = renderWithTheme(
      <VideoIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
