import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AutomatePayrollFilledIcon from './';

describe('<AutomatePayrollFilledIcon />', () => {
  it('should render AutomatePayrollFilledIcon', () => {
    const { container } = renderWithTheme(
      <AutomatePayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
