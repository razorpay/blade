import VideoOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<VideoOffIcon />', () => {
  it('should render VideoOffIcon', () => {
    const renderTree = renderWithTheme(
      <VideoOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
