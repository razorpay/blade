/**
 * Native tests for <Timestamp />.
 *
 * We avoid toMatchSnapshot() throughout — native snapshots are large JSON trees
 * that are sensitive to styling token changes and (for time formats) to the
 * timezone of the CI runner. Instead we assert on specific, observable properties.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from '../Timestamp';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

// Fixed date — use format="date" for timezone-invariant assertions
const FIXED_DATE = new Date('2026-05-30T13:08:32.000Z');

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Timestamp /> (native)', () => {
  it('should render Timestamp with default props', () => {
    const { toJSON } = renderWithTheme(<Timestamp value={FIXED_DATE} />);
    expect(toJSON()).not.toBeNull();
  });

  it('should render with format="date"', () => {
    // format="date" is timezone-invariant — safe to assert on text content
    const { getByText } = renderWithTheme(<Timestamp value={FIXED_DATE} format="date" />);
    // en-IN medium date style: "30 May 2026"
    expect(getByText(/30 May 2026/)).toBeTruthy();
  });

  it('should render with format="time"', () => {
    // Only assert the component renders — time text is timezone-sensitive
    const { toJSON } = renderWithTheme(<Timestamp value={FIXED_DATE} format="time" />);
    expect(toJSON()).not.toBeNull();
  });

  it('should render with format="relative"', () => {
    // Freeze time so relative output is deterministic
    jest.useFakeTimers().setSystemTime(FIXED_DATE);
    const fiveMinAgo = new Date(FIXED_DATE.getTime() - 5 * 60 * 1000);
    const { getByText } = renderWithTheme(<Timestamp value={fiveMinAgo} format="relative" />);
    expect(getByText(/5 minutes ago/)).toBeTruthy();
    jest.useRealTimers();
  });

  it('should render all body type sizes', () => {
    const { toJSON } = renderWithTheme(
      <>
        <Timestamp value={FIXED_DATE} format="date" type="body" size="xsmall" />
        <Timestamp value={FIXED_DATE} format="date" type="body" size="small" />
        <Timestamp value={FIXED_DATE} format="date" type="body" size="medium" />
        <Timestamp value={FIXED_DATE} format="date" type="body" size="large" />
      </>,
    );
    expect(toJSON()).not.toBeNull();
  });

  it('should render all heading type sizes', () => {
    const { toJSON } = renderWithTheme(
      <>
        <Timestamp value={FIXED_DATE} format="date" type="heading" size="small" />
        <Timestamp value={FIXED_DATE} format="date" type="heading" size="medium" />
        <Timestamp value={FIXED_DATE} format="date" type="heading" size="large" />
        <Timestamp value={FIXED_DATE} format="date" type="heading" size="xlarge" />
        <Timestamp value={FIXED_DATE} format="date" type="heading" size="2xlarge" />
      </>,
    );
    expect(toJSON()).not.toBeNull();
  });

  it('should render all display type sizes', () => {
    const { toJSON } = renderWithTheme(
      <>
        <Timestamp value={FIXED_DATE} format="date" type="display" size="small" />
        <Timestamp value={FIXED_DATE} format="date" type="display" size="medium" />
        <Timestamp value={FIXED_DATE} format="date" type="display" size="large" />
        <Timestamp value={FIXED_DATE} format="date" type="display" size="xlarge" />
      </>,
    );
    expect(toJSON()).not.toBeNull();
  });

  it('should accept ISO string as value', () => {
    const { getByText } = renderWithTheme(
      <Timestamp value="2026-05-30T13:08:32.000Z" format="date" />,
    );
    expect(getByText(/30 May 2026/)).toBeTruthy();
  });

  it('should accept Unix timestamp (ms) as value', () => {
    const { getByText } = renderWithTheme(<Timestamp value={FIXED_DATE.getTime()} format="date" />);
    expect(getByText(/30 May 2026/)).toBeTruthy();
  });

  it('should apply custom color without crashing', () => {
    const { toJSON } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="date" color="feedback.text.positive.intense" />,
    );
    expect(toJSON()).not.toBeNull();
  });

  it('should accept testID prop', () => {
    const { getByTestId } = renderWithTheme(
      <Timestamp value={FIXED_DATE} testID="timestamp-native-test" />,
    );
    expect(getByTestId('timestamp-native-test')).toBeTruthy();
  });

  it('should throw an error for invalid date value in __DEV__', () => {
    expect(() => {
      renderWithTheme(<Timestamp value="not-a-date" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should render nothing for invalid date value in production', () => {
    const g = global as any;
    const originalDev = g.__DEV__;
    g.__DEV__ = false;
    try {
      const { toJSON } = renderWithTheme(<Timestamp value="not-a-date" />);
      // renderWithTheme wraps in a BladeProvider View — toJSON() is that wrapper, never null.
      // When Timestamp returns null, the wrapper renders with no children.
      expect(toJSON()?.children).toBeNull();
    } finally {
      // Always restore __DEV__ — if the assertion above throws, the next test
      // (which relies on __DEV__ = true) must not be affected.
      g.__DEV__ = originalDev;
    }
  });

  it('should throw __DEV__ error for invalid type × size combination', () => {
    expect(() => {
      // @ts-expect-error intentionally invalid combination
      renderWithTheme(<Timestamp value={FIXED_DATE} type="body" size="2xlarge" />);
    }).toThrow('[Blade: Timestamp]');

    expect(() => {
      // @ts-expect-error intentionally invalid combination
      renderWithTheme(<Timestamp value={FIXED_DATE} type="heading" size="xsmall" />);
    }).toThrow('[Blade: Timestamp]');

    expect(() => {
      // @ts-expect-error intentionally invalid combination
      renderWithTheme(<Timestamp value={FIXED_DATE} type="display" size="2xlarge" />);
    }).toThrow('[Blade: Timestamp]');
  });

  it('should render with hourCycle="24h" without crashing', () => {
    const { toJSON } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" hourCycle="24h" />,
    );
    expect(toJSON()).not.toBeNull();
  });

  it('should render with precision="second" without crashing', () => {
    const { toJSON } = renderWithTheme(
      <Timestamp value={FIXED_DATE} format="time" precision="second" />,
    );
    expect(toJSON()).not.toBeNull();
  });

  it('should NOT render a <time> element on native (no semantic HTML)', () => {
    const { toJSON } = renderWithTheme(<Timestamp value={FIXED_DATE} />);
    const json = JSON.stringify(toJSON());
    // Native renders View/Text components — no HTML "time" tag
    expect(json).not.toContain('"type":"time"');
  });
});
