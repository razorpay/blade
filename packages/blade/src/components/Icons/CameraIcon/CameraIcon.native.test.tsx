import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CameraIcon from '.';

describe('<CameraIcon />', () => {
  it('should render CameraIcon', () => {
    const renderTree = renderWithTheme(
      <CameraIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
