import VolumeXIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<VolumeXIcon />', () => {
  it('should render VolumeXIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeXIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
