import { Timestamp } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

// Fixed date for deterministic output — 2025-03-21 09:20 IST (UTC+5:30)
const FIXED_DATE = new Date('2025-03-21T03:50:00.000Z');

describe('<Timestamp />', () => {
  it('should render Timestamp on server', () => {
    const { container } = renderWithSSR(
      <Timestamp value={FIXED_DATE} format="dateTime" locale="en-IN" />,
    );

    // Renders a semantic <time> element with an ISO dateTime attribute
    expect(container.querySelector('time')).toBeTruthy();
    expect(container.querySelector('time')?.getAttribute('datetime')).toMatch(
      /2025-03-21T\d{2}:\d{2}:\d{2}/,
    );

    // Displays the formatted date with en-IN locale
    expect(container.textContent).toMatch(/21 Mar 2025/);
  });

  it('should return null for an invalid date value in production', () => {
    // In production (non-__DEV__), invalid dates render nothing rather than "Invalid Date".
    // Must disable __DEV__ explicitly — the SSR test environment runs with __DEV__ = true.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = global as any;
    const originalDev = g.__DEV__;
    g.__DEV__ = false;
    const { container } = renderWithSSR(<Timestamp value="not-a-date" />);
    expect(container.querySelector('[data-blade-component="timestamp"]')).toBeNull();
    g.__DEV__ = originalDev;
  });

  it('should throw for an invalid date in __DEV__', () => {
    expect(() => {
      renderWithSSR(<Timestamp value="not-a-date" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should render format="date" with no time text', () => {
    const { container } = renderWithSSR(
      <Timestamp value={FIXED_DATE} format="date" locale="en-US" />,
    );
    expect(container.textContent).toMatch(/Mar/);
    expect(container.textContent).not.toMatch(/AM|PM|:/);
  });

  it('should render a <time> element with ISO datetime attribute on SSR', () => {
    const { container } = renderWithSSR(<Timestamp value={FIXED_DATE} />);
    expect(container.querySelector('time')?.getAttribute('datetime')).toBe(
      FIXED_DATE.toISOString(),
    );
  });
});
