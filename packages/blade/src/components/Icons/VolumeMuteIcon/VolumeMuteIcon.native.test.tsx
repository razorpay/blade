import VolumeMuteIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<VolumeMuteIcon />', () => {
  it('should render VolumeMuteIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeMuteIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
