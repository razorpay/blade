import RazorpayxPayrollIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RazorpayxPayrollIcon />', () => {
  it('should render RazorpayxPayrollIcon', () => {
    const { container } = renderWithTheme(
      <RazorpayxPayrollIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
