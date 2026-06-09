import { act } from '@testing-library/react';
import { Timestamp } from '../Timestamp';
import { formatTimestamp, toDate } from '../utils';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// Fixed date for deterministic test output
const FIXED_DATE = new Date('2026-05-30T13:08:32.000Z');

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Timestamp />', () => {
  it('should render Timestamp with default props (dateTime format)', () => {
    const { container } = renderWithTheme(<Timestamp value={FIXED_DATE} />);
    expect(container).toMatchSnapshot();
  });

  it('should render with format="date"', () => {
    const { container } = renderWithTheme(<Timestamp value={FIXED_DATE} format="date" />);
    expect(container).toMatchSnapshot();
  });

  it('should render with format="time"', () => {
    const { container } = renderWithTheme(<Timestamp value={FIXED_DATE} format="time" />);
    expect(container).toMatchSnapshot();
  });

  it('should render with format="relative"', () => {
    // Use a jest fake timer so relative time is deterministic
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const { container } = renderWithTheme(<Timestamp value={fiveMinAgo} format="relative" />);
    expect(container).toMatchSnapshot();
    jest.useRealTimers();
  });

  it('should accept ISO string as value', () => {
    const { container } = renderWithTheme(
      <Timestamp value="2026-05-30T13:08:32.000Z" format="date" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should accept Unix timestamp (ms) as value', () => {
    const { container } = renderWithTheme(<Timestamp value={FIXED_DATE.getTime()} format="date" />);
    expect(container).toMatchSnapshot();
  });

  it('should render all dateStyle options', () => {
    const styles = ['short', 'medium', 'long', 'full'] as const;
    styles.forEach((dateStyle) => {
      const { container } = renderWithTheme(
        <Timestamp value={FIXED_DATE} format="date" dateStyle={dateStyle} />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it('should render precision="minute" (default)', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" precision="minute" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render precision="second"', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" precision="second" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with hourCycle="12h"', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" hourCycle="12h" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with hourCycle="24h"', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" hourCycle="24h" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render all text sizes', () => {
    const sizes = ['xsmall', 'small', 'medium', 'large'] as const;
    sizes.forEach((size) => {
      const { container } = renderWithTheme(<Timestamp value={FIXED_DATE} size={size} />);
      expect(container).toMatchSnapshot();
    });
  });

  it('should render all text weights', () => {
    const weights = ['regular', 'medium', 'semibold'] as const;
    weights.forEach((weight) => {
      const { container } = renderWithTheme(<Timestamp value={FIXED_DATE} weight={weight} />);
      expect(container).toMatchSnapshot();
    });
  });

  it('should apply custom color', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} color="feedback.text.positive.intense" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should apply accessibilityLabel as aria-label', () => {
    const { getByLabelText } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" accessibilityLabel="Payment date" />,
    );
    expect(getByLabelText('Payment date')).toBeTruthy();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = renderWithTheme(
      <Timestamp value={FIXED_DATE} testID="timestamp-test" />,
    );
    expect(getByTestId('timestamp-test')).toBeTruthy();
  });

  it('should throw an error for invalid date value in __DEV__', () => {
    expect(() => {
      renderWithTheme(<Timestamp value="not-a-date" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should render nothing for invalid date value in production', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = global as any;
    const originalDev = g.__DEV__;
    g.__DEV__ = false;
    const { container } = renderWithTheme(<Timestamp value="not-a-date" />);
    expect(container.querySelector('[data-blade-component="timestamp"]')).toBeNull();
    g.__DEV__ = originalDev;
  });

  it('should render a semantic <time> element with ISO dateTime attribute', () => {
    const { container } = renderWithTheme(<Timestamp value={FIXED_DATE} format="dateTime" />);
    const timeEl = container.querySelector('time');
    expect(timeEl).toBeTruthy();
    expect(timeEl?.getAttribute('datetime')).toBe(FIXED_DATE.toISOString());
  });

  it('should show tooltip by default for format="relative"', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const { container } = renderWithTheme(<Timestamp value={fiveMinAgo} format="relative" />);
    // Tooltip wrapper has data-testid="tooltip-interactive-wrapper"
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeTruthy();
    jest.useRealTimers();
  });

  it('should suppress tooltip when noTooltip=true', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const { container } = renderWithTheme(
      <Timestamp value={fiveMinAgo} format="relative" noTooltip />,
    );
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeNull();
    jest.useRealTimers();
  });

  it('should show tooltip for dateStyle="short"', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" dateStyle="short" />,
    );
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeTruthy();
  });

  it('should NOT show tooltip for dateStyle="full"', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="dateTime" dateStyle="full" />,
    );
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeNull();
  });

  it('should use locale prop for formatting', () => {
    // en-US formats dates differently from en-IN
    const { container: containerUS } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" dateStyle="medium" locale="en-US" />,
    );
    const { container: containerIN } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" dateStyle="medium" locale="en-IN" />,
    );
    // Both should render but may differ in month/day ordering
    expect(containerUS.textContent).toBeTruthy();
    expect(containerIN.textContent).toBeTruthy();
  });

  it('should auto-update relative timestamp after interval', () => {
    jest.useFakeTimers();
    const now = FIXED_DATE.getTime();
    jest.setSystemTime(now);
    // 30 seconds ago — within the "every 10s" update window
    const thirtySecsAgo = new Date(now - 30 * 1000);
    const { container } = renderWithTheme(
      <Timestamp value={thirtySecsAgo} format="relative" precision="second" />,
    );
    const firstText = container.textContent;

    // Advance time by 10s (the update interval for timestamps < 1min old)
    act(() => {
      jest.advanceTimersByTime(10_000);
    });

    const secondText = container.textContent;
    // The displayed time should have changed (40s ago vs 30s ago)
    expect(secondText).not.toBe(firstText);
    jest.useRealTimers();
  });

  it('should throw __DEV__ error for precision="hour" with format="dateTime"', () => {
    expect(() => {
      renderWithTheme(<Timestamp value={FIXED_DATE} format="dateTime" precision="hour" />);
    }).toThrow('[Blade: Timestamp]');
  });
});

describe('formatTimestamp utility', () => {
  const baseOptions = {
    date: FIXED_DATE,
    dateStyle: 'medium' as const,
    hourCycle: undefined,
    precision: 'minute' as const,
    locale: 'en-US',
  };

  it('should format relative — minutes ago', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const result = formatTimestamp({ ...baseOptions, date: fiveMinAgo, format: 'relative' });
    expect(result).toBe('5 minutes ago');
    jest.useRealTimers();
  });

  it('should format relative — yesterday', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const yesterday = new Date(FIXED_DATE.getTime() - 24 * 60 * 60 * 1000);
    const result = formatTimestamp({ ...baseOptions, date: yesterday, format: 'relative' });
    expect(result).toBe('yesterday');
    jest.useRealTimers();
  });

  it('should format relative — in the future', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const inTwoMins = new Date(FIXED_DATE.getTime() + 2 * 60 * 1000);
    const result = formatTimestamp({ ...baseOptions, date: inTwoMins, format: 'relative' });
    expect(result).toBe('in 2 minutes');
    jest.useRealTimers();
  });

  it('should format relative — seconds with precision="second"', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const thirtySecsAgo = new Date(FIXED_DATE.getTime() - 30 * 1000);
    const result = formatTimestamp({
      ...baseOptions,
      date: thirtySecsAgo,
      format: 'relative',
      precision: 'second',
    });
    expect(result).toBe('30 seconds ago');
    jest.useRealTimers();
  });
});

describe('toDate utility', () => {
  it('should return same Date object when Date is passed', () => {
    expect(toDate(FIXED_DATE)).toBe(FIXED_DATE);
  });

  it('should parse ISO string', () => {
    const result = toDate('2026-05-30T13:08:32.000Z');
    expect(result.getTime()).toBe(FIXED_DATE.getTime());
  });

  it('should parse Unix timestamp in milliseconds', () => {
    const result = toDate(FIXED_DATE.getTime());
    expect(result.getTime()).toBe(FIXED_DATE.getTime());
  });
});
