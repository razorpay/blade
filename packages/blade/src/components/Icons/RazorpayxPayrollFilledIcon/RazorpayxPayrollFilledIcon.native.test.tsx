import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RazorpayxPayrollFilledIcon from '.';

describe('<RazorpayxPayrollFilledIcon />', () => {
  it('should render RazorpayxPayrollFilledIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayxPayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
