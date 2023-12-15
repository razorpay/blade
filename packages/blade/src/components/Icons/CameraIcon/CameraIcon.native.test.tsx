import CameraIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CameraIcon />', () => {
  it('should render CameraIcon', () => {
    const renderTree = renderWithTheme(
      <CameraIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
