import renderWithTheme from '~utils/testing/renderWithTheme.native';

import VideoIcon from '.';

describe('<VideoIcon />', () => {
  it('should render VideoIcon', () => {
    const renderTree = renderWithTheme(
      <VideoIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
