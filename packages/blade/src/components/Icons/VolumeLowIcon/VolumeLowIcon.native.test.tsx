import VolumeLowIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<VolumeLowIcon />', () => {
  it('should render VolumeLowIcon', () => {
    const renderTree = renderWithTheme(
      <VolumeLowIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
