import VolumeHighIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<VolumeHighIcon />', () => {
  it('should render VolumeHighIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeHighIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
