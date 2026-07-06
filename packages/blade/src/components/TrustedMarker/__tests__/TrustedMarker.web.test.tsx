import { TrustedMarker } from '../TrustedMarker';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';

describe('<TrustedMarker />', () => {
  it('should render the full marker (neutral) with the default trust label', () => {
    const { container, getByText } = renderWithTheme(<TrustedMarker variant="neutral" />);
    expect(getByText('Razorpay Trusted Business')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render the subtle variant', () => {
    const { container, getByText } = renderWithTheme(<TrustedMarker variant="subtle" />);
    expect(getByText('Razorpay Trusted Business')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render the icon-only marker without the visible label and expose an a11y label', () => {
    const { container, queryByText, getByRole } = renderWithTheme(<TrustedMarker type="icon" />);
    expect(queryByText('Razorpay Trusted Business')).not.toBeInTheDocument();
    expect(getByRole('img', { name: 'Razorpay Trusted Business' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render a custom label when provided', () => {
    const { getByText } = renderWithTheme(<TrustedMarker label="Razorpay Verified" />);
    expect(getByText('Razorpay Verified')).toBeInTheDocument();
  });

  it('should use the custom label as a11y label in icon-only form', () => {
    const { queryByText, getByRole } = renderWithTheme(
      <TrustedMarker type="icon" label="Razorpay Verified" />,
    );
    expect(queryByText('Razorpay Verified')).not.toBeInTheDocument();
    expect(getByRole('img', { name: 'Razorpay Verified' })).toBeInTheDocument();
  });

  it('should pass general a11y', async () => {
    const { container } = renderWithTheme(<TrustedMarker variant="neutral" />);
    await assertAccessible(container);
  });

  it('should support testID', () => {
    const { getByTestId } = renderWithTheme(<TrustedMarker testID="trusted-marker-test" />);
    expect(getByTestId('trusted-marker-test')).toBeInTheDocument();
  });

  it('should support data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <TrustedMarker testID="trusted-marker-test" data-analytics-section="checkout" />,
    );
    expect(getByTestId('trusted-marker-test')).toHaveAttribute('data-analytics-section', 'checkout');
  });
});
