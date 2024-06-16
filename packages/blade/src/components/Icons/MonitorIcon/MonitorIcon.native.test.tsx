import MonitorIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MonitorIcon />', () => {
  it('should render MonitorIcon', () => {
    const renderTree = renderWithTheme(
      <MonitorIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
