import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VendorPaymentsIcon from './';

describe('<VendorPaymentsIcon />', () => {
  it('should render VendorPaymentsIcon', () => {
    const { container } = renderWithTheme(
      <VendorPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
