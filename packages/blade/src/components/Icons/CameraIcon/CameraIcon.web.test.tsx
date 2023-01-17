import CameraIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CameraIcon />', () => {
  it('should render CameraIcon', () => {
    const { container } = renderWithTheme(
      <CameraIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
