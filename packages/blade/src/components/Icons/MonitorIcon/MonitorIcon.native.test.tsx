import MonitorIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<MonitorIcon />', () => {
  it('should render MonitorIcon', () => {
    const renderTree = renderWithTheme(
      <MonitorIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
