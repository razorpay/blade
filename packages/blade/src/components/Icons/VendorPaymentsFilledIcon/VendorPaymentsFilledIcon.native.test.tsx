import VendorPaymentsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<VendorPaymentsFilledIcon />', () => {
  it('should render VendorPaymentsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <VendorPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
