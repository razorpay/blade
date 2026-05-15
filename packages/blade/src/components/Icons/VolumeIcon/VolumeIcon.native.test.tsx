import renderWithTheme from '~utils/testing/renderWithTheme.native';

import VolumeIcon from '.';

describe('<VolumeIcon />', () => {
  it('should render VolumeIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
