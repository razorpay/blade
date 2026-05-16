import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AutomatePayrollIcon from './';

describe('<AutomatePayrollIcon />', () => {
  it('should render AutomatePayrollIcon', () => {
    const { container } = renderWithTheme(
      <AutomatePayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
