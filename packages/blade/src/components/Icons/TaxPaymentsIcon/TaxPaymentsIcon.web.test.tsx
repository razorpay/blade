import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TaxPaymentsIcon from './';

describe('<TaxPaymentsIcon />', () => {
  it('should render TaxPaymentsIcon', () => {
    const { container } = renderWithTheme(
      <TaxPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
