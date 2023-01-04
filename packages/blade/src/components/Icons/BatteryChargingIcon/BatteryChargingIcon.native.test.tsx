import BatteryChargingIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BatteryChargingIcon />', () => {
  it('should render BatteryChargingIcon', () => {
    const renderTree = renderWithTheme(
      <BatteryChargingIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
