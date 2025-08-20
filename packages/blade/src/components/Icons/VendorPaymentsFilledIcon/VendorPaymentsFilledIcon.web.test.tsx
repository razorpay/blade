import VendorPaymentsFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VendorPaymentsFilledIcon />', () => {
  it('should render VendorPaymentsFilledIcon', () => {
    const { container } = renderWithTheme(
      <VendorPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
