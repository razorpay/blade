import BatteryChargingIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BatteryChargingIcon />', () => {
  it('should render BatteryChargingIcon', () => {
    const { container } = renderWithTheme(
      <BatteryChargingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
