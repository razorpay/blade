import renderWithTheme from '~utils/testing/renderWithTheme.native';

import VolumeOffIcon from '.';

describe('<VolumeOffIcon />', () => {
  it('should render VolumeOffIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeOffIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
