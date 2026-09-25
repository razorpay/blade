import { DotLoader } from '../DotLoader';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.web';

describe('<DotLoader />', () => {
  it('should render DotLoader with default props', () => {
    const { container } = renderWithTheme(<DotLoader />);
    expect(container).toMatchSnapshot();
  });

  it('should render three dots', () => {
    const { getByTestId } = renderWithTheme(<DotLoader testID="dot-loader-test" />);
    expect(getByTestId('dot-loader-test').children).toHaveLength(3);
  });

  it('should be hidden from assistive tech when no accessibilityLabel is passed', () => {
    const { getByTestId } = renderWithTheme(<DotLoader testID="dot-loader-test" />);
    expect(getByTestId('dot-loader-test')).toHaveAttribute('aria-hidden', 'true');
  });

  it('should expose a status role when accessibilityLabel is passed', () => {
    const { getByRole } = renderWithTheme(<DotLoader accessibilityLabel="Loading results" />);
    const loader = getByRole('status');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute('aria-label', 'Loading results');
    expect(loader).not.toHaveAttribute('aria-hidden');
  });

  it('should paint the dots with the resolved color token', () => {
    const { getByTestId } = renderWithTheme(
      <DotLoader color="interactive.icon.negative.subtle" testID="dot-loader-test" />,
    );
    // theme resolution happens in the component, so assert the dots got *a* color
    // rather than pinning the exact hsla string.
    const [firstDot] = Array.from(getByTestId('dot-loader-test').children);
    expect(window.getComputedStyle(firstDot).backgroundColor).not.toBe('');
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<DotLoader testID="dot-loader-test" />);
    expect(getByTestId('dot-loader-test')).toBeInTheDocument();
  });

  it('should render large at 1.5x the medium geometry', () => {
    const { getByTestId: getMedium } = renderWithTheme(<DotLoader testID="medium" />);
    const { getByTestId: getLarge } = renderWithTheme(<DotLoader size="large" testID="large" />);

    expect(getMedium('medium')).toHaveStyle({ width: '24px', height: '24px', gap: '2px' });
    expect(getLarge('large')).toHaveStyle({ width: '36px', height: '36px', gap: '3px' });

    const [mediumDot] = Array.from(getMedium('medium').children);
    const [largeDot] = Array.from(getLarge('large').children);
    expect(mediumDot).toHaveStyle({ width: '4px', height: '4px' });
    expect(largeDot).toHaveStyle({ width: '6px', height: '6px' });
  });

  it('should render large with the same dot count and a11y behaviour as medium', () => {
    const { getByTestId } = renderWithTheme(<DotLoader size="large" testID="dot-loader-test" />);
    expect(getByTestId('dot-loader-test').children).toHaveLength(3);
    expect(getByTestId('dot-loader-test')).toHaveAttribute('aria-hidden', 'true');
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<DotLoader accessibilityLabel="Loading" />);
    await assertAccessible(container);
  });
});
