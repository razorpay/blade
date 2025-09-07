import RazorpayxPayrollFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RazorpayxPayrollFilledIcon />', () => {
  it('should render RazorpayxPayrollFilledIcon', () => {
    const { container } = renderWithTheme(
      <RazorpayxPayrollFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
