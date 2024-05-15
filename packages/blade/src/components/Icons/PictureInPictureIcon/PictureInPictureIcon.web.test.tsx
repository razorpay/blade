import PictureInPictureIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PictureInPictureIcon />', () => {
  it('should render PictureInPictureIcon', () => {
    const { container } = renderWithTheme(
      <PictureInPictureIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
