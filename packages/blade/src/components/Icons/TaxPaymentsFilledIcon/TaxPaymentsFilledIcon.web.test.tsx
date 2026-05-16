import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TaxPaymentsFilledIcon from './';

describe('<TaxPaymentsFilledIcon />', () => {
  it('should render TaxPaymentsFilledIcon', () => {
    const { container } = renderWithTheme(
      <TaxPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
