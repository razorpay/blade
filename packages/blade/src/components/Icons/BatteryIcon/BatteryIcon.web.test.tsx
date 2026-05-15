import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BatteryIcon from './';

describe('<BatteryIcon />', () => {
  it('should render BatteryIcon', () => {
    const { container } = renderWithTheme(
      <BatteryIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
