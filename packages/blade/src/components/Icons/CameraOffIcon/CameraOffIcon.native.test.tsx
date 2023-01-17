import CameraOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CameraOffIcon />', () => {
  it('should render CameraOffIcon', () => {
    const renderTree = renderWithTheme(
      <CameraOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
