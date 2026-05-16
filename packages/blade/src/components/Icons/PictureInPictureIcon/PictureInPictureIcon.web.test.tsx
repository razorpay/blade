import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PictureInPictureIcon from './';

describe('<PictureInPictureIcon />', () => {
  it('should render PictureInPictureIcon', () => {
    const { container } = renderWithTheme(
      <PictureInPictureIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
