import { TrustBadge } from '../TrustBadge';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';

describe('<TrustBadge />', () => {
  it('should render the default badge with the default trust label', () => {
    const { container, getByText } = renderWithTheme(<TrustBadge />);
    expect(getByText('Razorpay Trusted Business')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render the icon-only badge without the visible label and expose an a11y label', () => {
    const { container, queryByText, getByRole } = renderWithTheme(
      <TrustBadge variant="icon-only" />,
    );
    expect(queryByText('Razorpay Trusted Business')).not.toBeInTheDocument();
    expect(getByRole('img', { name: 'Razorpay Trusted Business' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render a custom label when provided', () => {
    const { getByText } = renderWithTheme(<TrustBadge label="Razorpay Verified" />);
    expect(getByText('Razorpay Verified')).toBeInTheDocument();
  });

  it('should use the custom label as a11y label in icon-only form', () => {
    const { queryByText, getByRole } = renderWithTheme(
      <TrustBadge variant="icon-only" label="Razorpay Verified" />,
    );
    expect(queryByText('Razorpay Verified')).not.toBeInTheDocument();
    expect(getByRole('img', { name: 'Razorpay Verified' })).toBeInTheDocument();
  });

  it('should pass general a11y', async () => {
    const { container } = renderWithTheme(<TrustBadge />);
    await assertAccessible(container);
  });

  it('should support testID', () => {
    const { getByTestId } = renderWithTheme(<TrustBadge testID="trust-badge-test" />);
    expect(getByTestId('trust-badge-test')).toBeInTheDocument();
  });

  it('should support data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <TrustBadge testID="trust-badge-test" data-analytics-section="checkout" />,
    );
    expect(getByTestId('trust-badge-test')).toHaveAttribute('data-analytics-section', 'checkout');
  });
});
