import VolumeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<VolumeIcon />', () => {
  it('should render VolumeIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
