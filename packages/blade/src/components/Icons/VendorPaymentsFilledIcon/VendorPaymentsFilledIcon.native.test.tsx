import renderWithTheme from '~utils/testing/renderWithTheme.native';

import VendorPaymentsFilledIcon from '.';

describe('<VendorPaymentsFilledIcon />', () => {
  it('should render VendorPaymentsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <VendorPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
