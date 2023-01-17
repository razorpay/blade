import BatteryChargingIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BatteryChargingIcon />', () => {
  it('should render BatteryChargingIcon', () => {
    const { container } = renderWithTheme(
      <BatteryChargingIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
