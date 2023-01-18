import VolumeIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<VolumeIcon />', () => {
  it('should render VolumeIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
