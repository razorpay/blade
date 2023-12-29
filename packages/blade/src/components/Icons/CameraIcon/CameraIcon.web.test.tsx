import CameraIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CameraIcon />', () => {
  it('should render CameraIcon', () => {
    const { container } = renderWithTheme(
      <CameraIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
