import BatteryIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BatteryIcon />', () => {
  it('should render BatteryIcon', () => {
    const { container } = renderWithTheme(
      <BatteryIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
