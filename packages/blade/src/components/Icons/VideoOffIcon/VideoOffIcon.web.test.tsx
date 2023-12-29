import VideoOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VideoOffIcon />', () => {
  it('should render VideoOffIcon', () => {
    const { container } = renderWithTheme(
      <VideoOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
