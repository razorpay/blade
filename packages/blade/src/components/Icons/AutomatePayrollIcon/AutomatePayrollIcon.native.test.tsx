import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AutomatePayrollIcon from '.';

describe('<AutomatePayrollIcon />', () => {
  it('should render AutomatePayrollIcon', () => {
    const renderTree = renderWithTheme(
      <AutomatePayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
