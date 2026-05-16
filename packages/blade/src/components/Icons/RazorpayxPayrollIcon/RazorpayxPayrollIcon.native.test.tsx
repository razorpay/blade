import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RazorpayxPayrollIcon from '.';

describe('<RazorpayxPayrollIcon />', () => {
  it('should render RazorpayxPayrollIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayxPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
