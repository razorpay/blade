import PictureInPictureIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PictureInPictureIcon />', () => {
  it('should render PictureInPictureIcon', () => {
    const renderTree = renderWithTheme(
      <PictureInPictureIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
