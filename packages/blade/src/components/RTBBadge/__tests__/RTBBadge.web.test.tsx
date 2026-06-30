import { RTBBadge } from '../RTBBadge';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';

describe('<RTBBadge />', () => {
  it('should render the full badge (neutral) with the trusted-business label', () => {
    const { container, getByText } = renderWithTheme(<RTBBadge variant="neutral" />);
    expect(getByText('Razorpay Trusted Business')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render the subtle variant', () => {
    const { container, getByText } = renderWithTheme(<RTBBadge variant="subtle" />);
    expect(getByText('Razorpay Trusted Business')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should render the icon-only badge without the visible label and expose an a11y label', () => {
    const { container, queryByText, getByRole } = renderWithTheme(<RTBBadge type="icon" />);
    expect(queryByText('Razorpay Trusted Business')).not.toBeInTheDocument();
    expect(getByRole('img', { name: 'Razorpay Trusted Business' })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should pass general a11y', async () => {
    const { container } = renderWithTheme(<RTBBadge variant="neutral" />);
    await assertAccessible(container);
  });

  it('should support testID', () => {
    const { getByTestId } = renderWithTheme(<RTBBadge testID="rtb-badge-test" />);
    expect(getByTestId('rtb-badge-test')).toBeInTheDocument();
  });

  it('should support data-analytics attributes', () => {
    const { getByTestId } = renderWithTheme(
      <RTBBadge testID="rtb-badge-test" data-analytics-section="checkout" />,
    );
    expect(getByTestId('rtb-badge-test')).toHaveAttribute('data-analytics-section', 'checkout');
  });
});
