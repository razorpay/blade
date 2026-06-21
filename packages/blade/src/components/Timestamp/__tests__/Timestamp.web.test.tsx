import { act } from '@testing-library/react';
import { Timestamp } from '../Timestamp';
import { formatTimestamp, toDate } from '../utils';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// Fixed date for deterministic test output
const FIXED_DATE = new Date('2026-05-30T13:08:32.000Z');

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Timestamp />', () => {
  // ─── Basic render ────────────────────────────────────────────────────────────

  it('should render with default props', () => {
    const { container } = renderWithTheme(<Timestamp value={FIXED_DATE} />);
    const el = container.querySelector('[data-blade-component="timestamp"]');
    expect(el).toBeTruthy();
    expect(el?.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('should render a semantic <time> element with ISO dateTime attribute', () => {
    const { container } = renderWithTheme(<Timestamp value={FIXED_DATE} format="dateTime" />);
    const timeEl = container.querySelector('time');
    expect(timeEl).toBeTruthy();
    expect(timeEl?.getAttribute('datetime')).toBe(FIXED_DATE.toISOString());
  });

  it('should accept ISO string as value', () => {
    const { container } = renderWithTheme(
      <Timestamp value="2026-05-30T13:08:32.000Z" format="date" />,
    );
    expect(container.querySelector('time')).toBeTruthy();
    expect(container.textContent?.trim().length).toBeGreaterThan(0);
  });

  it('should accept Unix timestamp (ms) as value', () => {
    const { container } = renderWithTheme(<Timestamp value={FIXED_DATE.getTime()} format="date" />);
    expect(container.querySelector('time')).toBeTruthy();
    expect(container.textContent?.trim().length).toBeGreaterThan(0);
  });

  // ─── format prop ─────────────────────────────────────────────────────────────

  it('should render format="date" — no time component in text', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" locale="en-US" />,
    );
    const text = container.textContent ?? '';
    // date format should not contain time separator or AM/PM
    expect(text).toMatch(/May|30|2026/);
    expect(text).not.toMatch(/AM|PM|\d:\d\d/);
  });

  it('should render format="time" — contains hour and minute', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" timeFormat="12h" locale="en-US" />,
    );
    const text = container.textContent ?? '';
    expect(text).toMatch(/\d:\d\d/);
    expect(text).toMatch(/AM|PM/i);
  });

  it('should render format="relative" — produces human-relative label', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const { container } = renderWithTheme(<Timestamp value={fiveMinAgo} format="relative" />);
    const text = container.textContent ?? '';
    // Should be something like "5 minutes ago"
    expect(text).toMatch(/ago|now|minute/i);
    jest.useRealTimers();
  });

  it('should render format="dateTime" — contains both date and time parts', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="dateTime" locale="en-US" />,
    );
    const text = container.textContent ?? '';
    expect(text).toMatch(/May|30|2026/);
    expect(text).toMatch(/\d:\d\d/);
  });

  // ─── dateFormat prop ───────────────────────────────────────────────────────────

  it('should render dateFormat="short" — compact numeric date', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" dateFormat="short" locale="en-US" />,
    );
    // en-US short gives "5/30/26"
    expect(container.textContent).toMatch(/\d+\/\d+\/\d+/);
  });

  it('should render dateFormat="full" — includes weekday', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" dateFormat="full" locale="en-US" />,
    );
    // "Saturday, May 30, 2026"
    expect(container.textContent).toMatch(
      /Saturday|Sunday|Monday|Tuesday|Wednesday|Thursday|Friday/,
    );
  });

  it('should render all dateFormat options without throwing', () => {
    (['short', 'medium', 'long', 'full'] as const).forEach((dateFormat) => {
      expect(() =>
        renderWithTheme(<Timestamp value={FIXED_DATE} format="date" dateFormat={dateFormat} />),
      ).not.toThrow();
    });
  });

  // ─── precision prop ───────────────────────────────────────────────────────────

  it('should render precision="minute" — no seconds in time', () => {
    const { container } = renderWithTheme(
      <Timestamp
        value={FIXED_DATE}
        format="time"
        precision="minute"
        timeFormat="12h"
        locale="en-US"
      />,
    );
    // "1:08 PM" — only hours and minutes
    expect(container.textContent).toMatch(/\d:\d{2}\s*(AM|PM)/i);
    expect(container.textContent).not.toMatch(/\d:\d{2}:\d{2}/);
  });

  it('should render precision="second" — includes seconds in time', () => {
    const { container } = renderWithTheme(
      <Timestamp
        value={FIXED_DATE}
        format="time"
        precision="second"
        timeFormat="12h"
        locale="en-US"
      />,
    );
    // "1:08:32 PM"
    expect(container.textContent).toMatch(/\d:\d{2}:\d{2}/);
  });

  // ─── timeFormat prop ────────────────────────────────────────────────────────────

  it('should render timeFormat="12h" — output has AM/PM', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" timeFormat="12h" locale="en-US" />,
    );
    expect(container.textContent).toMatch(/AM|PM/i);
  });

  it('should render timeFormat="24h" — output has no AM/PM', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" timeFormat="24h" locale="en-US" />,
    );
    expect(container.textContent).not.toMatch(/AM|PM/i);
    // 13:08 format
    expect(container.textContent).toMatch(/13:\d{2}/);
  });

  // ─── type × size combinations ─────────────────────────────────────────────────

  it('should render all body sizes without throwing', () => {
    (['xsmall', 'small', 'medium', 'large'] as const).forEach((size) => {
      expect(() =>
        renderWithTheme(<Timestamp value={FIXED_DATE} type="body" size={size} />),
      ).not.toThrow();
    });
  });

  it('should render all heading sizes without throwing', () => {
    (['small', 'medium', 'large', 'xlarge', '2xlarge'] as const).forEach((size) => {
      expect(() =>
        renderWithTheme(<Timestamp value={FIXED_DATE} type="heading" size={size} />),
      ).not.toThrow();
    });
  });

  it('should render all display sizes without throwing', () => {
    (['small', 'medium', 'large', 'xlarge'] as const).forEach((size) => {
      expect(() =>
        renderWithTheme(<Timestamp value={FIXED_DATE} type="display" size={size} />),
      ).not.toThrow();
    });
  });

  it('should throw __DEV__ error for invalid type × size: body + 2xlarge', () => {
    expect(() => {
      // @ts-expect-error intentionally invalid
      renderWithTheme(<Timestamp value={FIXED_DATE} type="body" size="2xlarge" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should throw __DEV__ error for invalid type × size: heading + xsmall', () => {
    expect(() => {
      // @ts-expect-error intentionally invalid
      renderWithTheme(<Timestamp value={FIXED_DATE} type="heading" size="xsmall" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should throw __DEV__ error for invalid type × size: display + 2xlarge', () => {
    expect(() => {
      // @ts-expect-error intentionally invalid
      renderWithTheme(<Timestamp value={FIXED_DATE} type="display" size="2xlarge" />);
    }).toThrow('[Blade: Timestamp]');
  });

  // ─── weight prop ──────────────────────────────────────────────────────────────

  it('should render all text weights without throwing', () => {
    (['regular', 'medium', 'semibold'] as const).forEach((weight) => {
      expect(() => renderWithTheme(<Timestamp value={FIXED_DATE} weight={weight} />)).not.toThrow();
    });
  });

  // ─── color prop ───────────────────────────────────────────────────────────────

  it('should render with custom color without throwing', () => {
    expect(() =>
      renderWithTheme(<Timestamp value={FIXED_DATE} color="feedback.text.positive.intense" />),
    ).not.toThrow();
  });

  // ─── tooltip ─────────────────────────────────────────────────────────────────

  it('should show tooltip by default for format="relative"', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const { container } = renderWithTheme(<Timestamp value={fiveMinAgo} format="relative" />);
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeTruthy();
    jest.useRealTimers();
  });

  it('should suppress tooltip when showTooltip=false', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const { container } = renderWithTheme(
      <Timestamp value={fiveMinAgo} format="relative" showTooltip={false} />,
    );
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeNull();
    jest.useRealTimers();
  });

  it('should show tooltip for dateFormat="short"', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" dateFormat="short" />,
    );
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeTruthy();
  });

  it('should NOT show tooltip for dateFormat="full"', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="dateTime" dateFormat="full" />,
    );
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeNull();
  });

  it('should force tooltip on when showTooltip=true for an otherwise non-tooltip case', () => {
    const { container } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="dateTime" dateFormat="medium" showTooltip />,
    );
    expect(container.querySelector('[data-testid="tooltip-interactive-wrapper"]')).toBeTruthy();
  });

  // ─── locale ───────────────────────────────────────────────────────────────────

  it('should use locale prop for formatting', () => {
    const { container: containerUS } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" dateFormat="medium" locale="en-US" />,
    );
    const { container: containerIN } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" dateFormat="medium" locale="en-IN" />,
    );
    expect(containerUS.textContent?.trim().length).toBeGreaterThan(0);
    expect(containerIN.textContent?.trim().length).toBeGreaterThan(0);
  });

  // ─── accessibility ────────────────────────────────────────────────────────────

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

  // ─── invalid date ─────────────────────────────────────────────────────────────

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

  // ─── precision validation ─────────────────────────────────────────────────────

  it('should throw __DEV__ error for precision="hour" with format="dateTime"', () => {
    expect(() => {
      renderWithTheme(<Timestamp value={FIXED_DATE} format="dateTime" precision="hour" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should throw __DEV__ error for precision="day" with format="time"', () => {
    expect(() => {
      renderWithTheme(<Timestamp value={FIXED_DATE} format="time" precision="day" />);
    }).toThrow('[Blade: Timestamp]');
  });

  // ─── auto-update ──────────────────────────────────────────────────────────────

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
});

// ─── formatTimestamp utility ──────────────────────────────────────────────────

describe('formatTimestamp utility', () => {
  const baseOptions = {
    date: FIXED_DATE,
    format: 'dateTime' as const,
    dateFormat: 'medium' as const,
    timeFormat: undefined,
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

  it('should format relative — just now for < 10s', () => {
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveSecsAgo = new Date(FIXED_DATE.getTime() - 5 * 1000);
    const result = formatTimestamp({
      ...baseOptions,
      date: fiveSecsAgo,
      format: 'relative',
      precision: 'second',
    });
    expect(result).toBe('now');
    jest.useRealTimers();
  });

  it('should format date with dateFormat="short"', () => {
    const result = formatTimestamp({ ...baseOptions, format: 'date', dateFormat: 'short' });
    // en-US short: "5/30/26"
    expect(result).toMatch(/\d+\/\d+\/\d+/);
  });

  it('should format time with timeFormat="24h"', () => {
    const result = formatTimestamp({ ...baseOptions, format: 'time', timeFormat: '24h' });
    // 13:08
    expect(result).toMatch(/13:\d{2}/);
    expect(result).not.toMatch(/AM|PM/i);
  });

  it('should format time with precision="second"', () => {
    const result = formatTimestamp({
      ...baseOptions,
      format: 'time',
      timeFormat: '12h',
      precision: 'second',
    });
    // "1:08:32 PM"
    expect(result).toMatch(/\d:\d{2}:\d{2}/);
  });
});

// ─── toDate utility ───────────────────────────────────────────────────────────

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
