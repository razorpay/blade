import VendorPaymentsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VendorPaymentsIcon />', () => {
  it('should render VendorPaymentsIcon', () => {
    const { container } = renderWithTheme(
      <VendorPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
