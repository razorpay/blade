import RazorpayxPayrollIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RazorpayxPayrollIcon />', () => {
  it('should render RazorpayxPayrollIcon', () => {
    const renderTree = renderWithTheme(
      <RazorpayxPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
