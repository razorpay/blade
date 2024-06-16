import TaxPaymentsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TaxPaymentsIcon />', () => {
  it('should render TaxPaymentsIcon', () => {
    const { container } = renderWithTheme(
      <TaxPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
