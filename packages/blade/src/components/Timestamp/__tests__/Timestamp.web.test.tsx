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

  it('should render all timeStyle options', () => {
    const styles = ['short', 'medium', 'long', 'full'] as const;
    styles.forEach((timeStyle) => {
      const { container } = renderWithTheme(
        <Timestamp value={FIXED_DATE} format="time" timeStyle={timeStyle} />,
      );
      expect(container).toMatchSnapshot();
    });
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

  it('should throw an error for invalid date value', () => {
    expect(() => {
      renderWithTheme(<Timestamp value="not-a-date" />);
    }).toThrow('[Blade: Timestamp]');
  });
});

describe('formatTimestamp utility', () => {
  const baseOptions = {
    date: FIXED_DATE,
    dateStyle: 'medium' as const,
    timeStyle: 'short' as const,
    hourCycle: undefined,
    precision: 'minute' as const,
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
