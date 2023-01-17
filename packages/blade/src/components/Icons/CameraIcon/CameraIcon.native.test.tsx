import CameraIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CameraIcon />', () => {
  it('should render CameraIcon', () => {
    const renderTree = renderWithTheme(
      <CameraIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
