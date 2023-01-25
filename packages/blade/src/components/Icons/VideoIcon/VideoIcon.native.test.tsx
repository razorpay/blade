import VideoIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<VideoIcon />', () => {
  it('should render VideoIcon', () => {
    const renderTree = renderWithTheme(
      <VideoIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
