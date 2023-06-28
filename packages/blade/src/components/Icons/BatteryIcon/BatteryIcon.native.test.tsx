import BatteryIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BatteryIcon />', () => {
  it('should render BatteryIcon', () => {
    const renderTree = renderWithTheme(
      <BatteryIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
