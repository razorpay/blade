import BatteryChargingIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BatteryChargingIcon />', () => {
  it('should render BatteryChargingIcon', () => {
    const renderTree = renderWithTheme(
      <BatteryChargingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
