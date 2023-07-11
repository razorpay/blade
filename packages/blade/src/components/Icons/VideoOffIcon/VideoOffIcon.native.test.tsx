import VideoOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<VideoOffIcon />', () => {
  it('should render VideoOffIcon', () => {
    const renderTree = renderWithTheme(
      <VideoOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
