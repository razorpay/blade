import renderWithTheme from '~utils/testing/renderWithTheme.native';

import VendorPaymentsIcon from '.';

describe('<VendorPaymentsIcon />', () => {
  it('should render VendorPaymentsIcon', () => {
    const renderTree = renderWithTheme(
      <VendorPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
