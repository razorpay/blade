import renderWithTheme from '~utils/testing/renderWithTheme.native';

import BatteryChargingIcon from '.';

describe('<BatteryChargingIcon />', () => {
  it('should render BatteryChargingIcon', () => {
    const renderTree = renderWithTheme(
      <BatteryChargingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
