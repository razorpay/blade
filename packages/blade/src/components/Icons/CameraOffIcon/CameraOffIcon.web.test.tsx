import CameraOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CameraOffIcon />', () => {
  it('should render CameraOffIcon', () => {
    const { container } = renderWithTheme(
      <CameraOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
