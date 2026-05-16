import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PictureInPictureIcon from '.';

describe('<PictureInPictureIcon />', () => {
  it('should render PictureInPictureIcon', () => {
    const renderTree = renderWithTheme(
      <PictureInPictureIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
