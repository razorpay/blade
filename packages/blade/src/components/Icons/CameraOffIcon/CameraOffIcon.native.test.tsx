import CameraOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CameraOffIcon />', () => {
  it('should render CameraOffIcon', () => {
    const renderTree = renderWithTheme(
      <CameraOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
