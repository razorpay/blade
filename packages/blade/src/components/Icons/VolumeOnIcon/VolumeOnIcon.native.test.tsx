import renderWithTheme from '~utils/testing/renderWithTheme.native';

import VolumeOnIcon from '.';

describe('<VolumeOnIcon />', () => {
  it('should render VolumeOnIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeOnIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
